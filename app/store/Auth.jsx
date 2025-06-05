import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // User authentication state
      isAuth: false,
      userId: "",
      username: "",
      email: "",
      country: "",
      profileImage: "",
      isVip: false,
      vipPlan: "", // weekly, monthly, yearly
      vipPlanDisplayName: "", // Weekly, Monthly, Yearly
      duration: 0, // 7, 30, 365 days
      expires: null,
      activation: null,
      isAdmin: false,
      isAuthorized: false,
      payment: 0,
      accessToken: "",
      refreshToken: "",
      lastLogin: null,
      tokenExpirationTime: null,
      refreshTimeoutId: null,
      emailVerified: false,

      // Admin dashboard stats
      activeUsersCount: 0,
      vipUsersCount: 0,
      adminUsersCount: 0,

      setUser: (userData) => {
        const tokenExpirationTime = Date.now() + TOKEN_REFRESH_INTERVAL;
        set({
          isAuth: true,
          userId: userData.id,
          username: userData.username,
          email: userData.email,
          payment: userData.payment || 0,
          duration: userData.duration || 0,
          expires: userData.expires || null,
          activation: userData.activation || null,
          country: userData.country || "",
          profileImage: userData.profileImage || "",
          isVip: userData.isVip || false,
          vipPlan: userData.vipPlan || "",
          vipPlanDisplayName: userData.vipPlanDisplayName || "",
          isAdmin: userData.isAdmin || false,
          isAuthorized: userData.isAuthorized || false,
          emailVerified: userData.emailVerified || false,
          accessToken: userData.tokens.accessToken,
          refreshToken: userData.tokens.refreshToken,
          lastLogin: userData.lastLogin || new Date().toISOString(),
          tokenExpirationTime,
        });
        get().scheduleTokenRefresh();
      },

      updateUser: (userData) => {
        set((state) => ({
          ...state,
          ...userData,
        }));
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        set({
          isAuth: false,
          userId: "",
          username: "",
          email: "",
          country: "",
          profileImage: "",
          isVip: false,
          vipPlan: "",
          vipPlanDisplayName: "",
          duration: 0,
          expires: null,
          activation: null,
          isAdmin: false,
          isAuthorized: false,
          payment: 0,
          accessToken: "",
          refreshToken: "",
          lastLogin: null,
          tokenExpirationTime: null,
          emailVerified: false,
        });
      },

      verifyEmail: async (email, verificationCode) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/verify-email`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, verificationCode }),
          });
      
          const data = await response.json();
          if (data.status === "success") {
            set({ emailVerified: true });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Email verification failed" };
        }
      },

      register: async (userData) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });
      
          const data = await response.json();
      
          if (data.status === "success") {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
            };
            
            get().setUser(userWithTokens);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Registration failed" };
        }
      },

      login: async (email, password) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json();
      
          if (data.data?.user?.emailVerified === false) {
            return { 
              success: false, 
              message: "Please verify your email to log in. Check your inbox.",
              requiresVerification: true,
              email: data.data.user.email,
              username: data.data.user.username
            };
          }
      
          if (data.status === "success" && data.data?.user && data.data?.tokens) {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
            };
      
            get().setUser(userWithTokens);
            return { 
              success: true, 
              message: data.message,
              isVip: data.data.user.isVip, 
              isAdmin: data.data.user.isAdmin 
            };
          }
      
          return { 
            success: false, 
            message: data.message || "Login failed"
          };
        } catch (error) {
          return { 
            success: false, 
            message: "Login failed"
          };
        }
      },
      
      logout: async () => {
        try {
          const { accessToken } = get();
          await fetch(`${SERVER_API}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          get().clearUser();
          return { success: true, message: "Logout successful" };
        } catch (error) {
          get().clearUser(); // Clear user data even if request fails
          return { success: true, message: "Logged out" };
        }
      },

      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            get().clearUser();
            return false;
          }

          const response = await fetch(`${SERVER_API}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              tokenExpirationTime: Date.now() + TOKEN_REFRESH_INTERVAL,
            });
            get().scheduleTokenRefresh();
            return true;
          }
          get().clearUser();
          return false;
        } catch (error) {
          get().clearUser();
          return false;
        }
      },

      updateProfile: async (updateData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-profile`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          });

          const data = await response.json();
          if (data.status === "success") {
            get().updateUser(data.data.user);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile update failed" };
        }
      },

      updatePassword: async (passwordData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-password`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password update failed" };
        }
      },

      updateProfileImage: async (imageData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/update-profile-image`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ image: imageData }),
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ profileImage: data.data.profileImage });
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Profile image update failed" };
        }
      },

      requestPasswordReset: async (email) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password-request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset request failed" };
        }
      },

      resetPassword: async (token, newPassword) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
          });

          const data = await response.json();
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Password reset failed" };
        }
      },

      submitContactForm: async (email, username, message) => {
        try {
          const response = await fetch(`${SERVER_API}/auth/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, message }),
          });
      
          const data = await response.json();
          return { 
            success: data.status === "success", 
            message: data.message 
          };
        } catch (error) {
          return { success: false, message: "Failed to submit contact form" };
        }
      },

      deleteAccount: async () => {
        try {
          const { accessToken } = get();

          if (!accessToken) {
            return { success: false, message: "Not authenticated" };
          }
          
          const response = await fetch(`${SERVER_API}/auth/delete-account`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            get().clearUser();
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete account" };
        }
      },

      // Get payment plans for authenticated users
      getPaymentPlans: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/payment-plans`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          return { 
            success: data.status === "success", 
            data: data.data,
            message: data.message 
          };
        } catch (error) {
          return { success: false, message: "Failed to fetch payment plans" };
        }
      },

      // Admin functions
      toggleVipStatus: async (userData) => {
        try {
          const { accessToken } = get();
          
          const { userId, isVip, payment, duration } = userData;
          
          if (isVip && (!payment || !duration || ![7, 30, 365].includes(duration))) {
            return { 
              success: false, 
              message: "Invalid VIP data. Payment and valid duration (7, 30, or 365 days) are required." 
            };
          }

          const response = await fetch(`${SERVER_API}/auth/admin/toggle-vip`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId, isVip, payment, duration }),
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user counts
            await get().getAllUsers();
            await get().getUsersByRole('vip');
            return { success: true, message: data.message, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "VIP status update failed" };
        }
      },

      toggleAdmin: async (userId, makeAdmin) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/toggle-admin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userId, makeAdmin }),
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user counts
            await get().getAllUsers();
            await get().getUsersByRole('admin');
            return { success: true, message: data.message, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to toggle admin status" };
        }
      },

      bulkDeleteAccounts: async (userIds) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/bulk-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ userIds }),
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user counts after bulk deletion
            await get().getAllUsers();
            await get().getUsersByRole('vip');
            await get().getUsersByRole('admin');
          }
          return {
            success: data.status === "success",
            message: data.message,
            data: data.data,
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to perform bulk deletion",
          };
        }
      },

      deleteUserAccount: async (userId) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/delete-account/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            // Refresh user counts after deletion
            await get().getAllUsers();
            await get().getUsersByRole('vip');
            await get().getUsersByRole('admin');
          }
          return { success: data.status === "success", message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to delete user account" };
        }
      },

      getAllUsers: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/users`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          if (data.status === "success") {
            set({ activeUsersCount: data.data.count });
            return { success: true, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to fetch users" };
        }
      },

      getUsersByRole: async (role, action, userId) => {
        try {
          const { accessToken } = get();
          let url = `${SERVER_API}/auth/admin/users/by-role?role=${role}`;
          let options = {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          };

          if (action === "delete" && userId) {
            url += `&action=${action}`;
            options = {
              method: "GET", // Changed to GET as per the controller logic
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ userId }),
            };
          }

          const response = await fetch(url, options);
          const data = await response.json();
          
          if (data.status === "success") {
            if (role === 'vip') {
              set({ vipUsersCount: data.data.count });
            } else if (role === 'admin') {
              set({ adminUsersCount: data.data.count });
            }
            return { success: true, data: data.data };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Failed to fetch/update users by role" };
        }
      },

      getRevenueAnalytics: async () => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/analytics/revenue`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          const data = await response.json();
          return { 
            success: data.status === "success", 
            data: data.data,
            message: data.message 
          };
        } catch (error) {
          return { success: false, message: "Failed to fetch revenue analytics" };
        }
      },

      sendBulkEmails: async (emailData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/admin/email/bulk`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(emailData),
          });

          const data = await response.json();
          return { 
            success: data.status === "success", 
            message: data.message,
            data: data.data 
          };
        } catch (error) {
          return { success: false, message: "Failed to send bulk emails" };
        }
      },

      setActiveUsersCount: (count) => set({ activeUsersCount: count }),
      setVipUsersCount: (count) => set({ vipUsersCount: count }),
      setAdminUsersCount: (count) => set({ adminUsersCount: count }),

      // Token management
      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        const timeUntilRefresh = Math.max(0, tokenExpirationTime - Date.now() - 60000);
        const newTimeoutId = setTimeout(() => {
          get().refreshAccessToken();
        }, timeUntilRefresh);

        set({ refreshTimeoutId: newTimeoutId });
      },

      cancelTokenRefresh: () => {
        const { refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          set({ refreshTimeoutId: null });
        }
      },

      getVipPlanDisplayName: (duration) => {
        switch (duration) {
          case 7:
            return 'Weekly';
          case 30:
            return 'Monthly';
          case 365:
            return 'Yearly';
          default:
            return 'Custom';
        }
      },

      getVipPlanType: (duration) => {
        switch (duration) {
          case 7:
            return 'weekly';
          case 30:
            return 'monthly';
          case 365:
            return 'yearly';
          default:
            return 'custom';
        }
      },

      isVipActive: () => {
        const { isVip, expires } = get();
        return isVip && expires && new Date(expires) > new Date();
      },

      getVipTimeRemaining: () => {
        const { expires } = get();
        if (!expires) return 0;
        const remaining = new Date(expires) - new Date();
        return Math.max(0, remaining);
      },

      getVipDaysRemaining: () => {
        const timeRemaining = get().getVipTimeRemaining();
        return Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuth: state.isAuth,
        userId: state.userId,
        username: state.username,
        email: state.email,
        country: state.country,
        profileImage: state.profileImage,
        isVip: state.isVip,
        vipPlan: state.vipPlan,
        vipPlanDisplayName: state.vipPlanDisplayName,
        duration: state.duration,
        expires: state.expires,
        activation: state.activation,
        isAdmin: state.isAdmin,
        isAuthorized: state.isAuthorized,
        payment: state.payment,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        lastLogin: state.lastLogin,
        tokenExpirationTime: state.tokenExpirationTime,
        emailVerified: state.emailVerified,
        activeUsersCount: state.activeUsersCount,
        vipUsersCount: state.vipUsersCount,
        adminUsersCount: state.adminUsersCount,
      }),
    }
  )
);