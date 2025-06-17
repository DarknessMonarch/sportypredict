import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;
const STATUS_CHECK_INTERVAL = 5 * 60 * 1000;

export const useAuthStore = create(
  persist(
    (set, get) => ({
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
      refreshTimeoutId: null,
      statusCheckTimeoutId: null,
      emailVerified: false,

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
        get().scheduleStatusCheck();
      },

      updateUser: (userData) => {
        set((state) => ({
          ...state,
          ...userData,
        }));
      },

      clearUser: () => {
        get().cancelTokenRefresh();
        get().cancelStatusCheck();
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
          statusCheckTimeoutId: null,
          emailVerified: false,
        });
      },

      // Check user status
      checkUserStatus: async () => {
        try {
          const { accessToken, isAuth } = get();
          if (!accessToken || !isAuth) return;

          const response = await fetch(`${SERVER_API}/auth/user-status`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            const currentState = get();
            const hasChanges =
              currentState.isVip !== data.data.isVip ||
              currentState.vipPlan !== data.data.vipPlan ||
              currentState.expires !== data.data.expires ||
              currentState.isAdmin !== data.data.isAdmin ||
              currentState.emailVerified !== data.data.emailVerified;

            if (hasChanges) {
              get().updateUser({
                isVip: data.data.isVip,
                vipPlan: data.data.vipPlan,
                vipPlanDisplayName: data.data.vipPlanDisplayName,
                duration: data.data.duration,
                expires: data.data.expires,
                activation: data.data.activation,
                isAdmin: data.data.isAdmin,
                isAuthorized: data.data.isAuthorized,
                emailVerified: data.data.emailVerified,
                payment: data.data.payment,
              });

              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("userStatusUpdated", {
                    detail: { changes: data.data },
                  })
                );
              }
            }
          }
        } catch (error) {
          console.error("Status check failed:", error);
        }
      },

      scheduleStatusCheck: () => {
        const { statusCheckTimeoutId } = get();
        if (statusCheckTimeoutId) {
          clearTimeout(statusCheckTimeoutId);
        }

        const newTimeoutId = setTimeout(() => {
          get().checkUserStatus();
          get().scheduleStatusCheck();
        }, STATUS_CHECK_INTERVAL);

        set({ statusCheckTimeoutId: newTimeoutId });
      },

      cancelStatusCheck: () => {
        const { statusCheckTimeoutId } = get();
        if (statusCheckTimeoutId) {
          clearTimeout(statusCheckTimeoutId);
          set({ statusCheckTimeoutId: null });
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

            if (data.data.user) {
              get().updateUser(data.data.user);
            }

            get().scheduleTokenRefresh();
            get().checkUserStatus();
            return true;
          }
          get().clearUser();
          return false;
        } catch (error) {
          get().clearUser();
          return false;
        }
      },

      refreshUserStatus: async () => {
        return await get().checkUserStatus();
      },

      isVipActive: () => {
        const { isVip, expires, isAdmin } = get();
        
        // Admin has permanent access
        if (isAdmin) return true;
        
        const isActive = isVip && expires && new Date(expires) > new Date();

        if (isVip && !isActive) {
          setTimeout(() => get().checkUserStatus(), 100);
        }

        return isActive;
      },

      // All the missing methods from your original auth store:

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
          
          // Clear user immediately for better UX
          get().clearUser();
          
          // Try to notify server, but don't fail if it doesn't work
          if (accessToken) {
            try {
              await fetch(`${SERVER_API}/auth/logout`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
            } catch (error) {
              console.warn("Server logout notification failed:", error);
            }
          }
          
          return { success: true, message: "Logout successful" };
        } catch (error) {
          // Ensure user is cleared even if server call fails
          get().clearUser();
          return { success: true, message: "Logged out" };
        }
      },

      processPayment: async (paymentData) => {
        try {
          const { accessToken } = get();
          const response = await fetch(`${SERVER_API}/auth/process-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(paymentData),
          });

          const data = await response.json();
          if (data.status === "success") {
            get().updateUser({
              isVip: data.data.user.isVip,
              vipPlan: data.data.user.vipPlan,
              vipPlanDisplayName: data.data.user.vipPlanDisplayName,
              duration: data.data.user.duration,
              activation: data.data.user.activation,
              expires: data.data.user.expires,
              payment: data.data.user.payment,
            });

            setTimeout(() => get().checkUserStatus(), 1000);
            return { success: true, message: data.message };
          }
          return { success: false, message: data.message };
        } catch (error) {
          return { success: false, message: "Payment processing failed" };
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

      // Add all other admin functions and helper functions...
      scheduleTokenRefresh: () => {
        const { tokenExpirationTime, refreshTimeoutId } = get();
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
        }

        const timeUntilRefresh = Math.max(
          0,
          tokenExpirationTime - Date.now() - 60000
        );
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
            return "Weekly";
          case 30:
            return "Monthly";
          case 365:
            return "Yearly";
          default:
            return "Custom";
        }
      },

      getVipPlanType: (duration) => {
        switch (duration) {
          case 7:
            return "weekly";
          case 30:
            return "monthly";
          case 365:
            return "yearly";
          default:
            return "custom";
        }
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