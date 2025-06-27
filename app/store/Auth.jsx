import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;
const STATUS_CHECK_INTERVAL = 30 * 1000;
const VIP_STATUS_CHECK_INTERVAL = 15 * 1000;

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
      vipCheckTimeoutId: null,
      emailVerified: false,
      isInitialized: false,

      activeUsersCount: 0,
      vipUsersCount: 0,
      adminUsersCount: 0,

      vipStatusListeners: new Set(),

      addVipStatusListener: (callback) => {
        const { vipStatusListeners } = get();
        vipStatusListeners.add(callback);
        return () => vipStatusListeners.delete(callback);
      },

      notifyVipStatusChange: (newStatus, oldStatus) => {
        const { vipStatusListeners } = get();
        vipStatusListeners.forEach((callback) => {
          try {
            callback(newStatus, oldStatus);
          } catch (error) {
            console.error("VIP status listener error:", error);
          }
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("vipStatusChanged", {
              detail: { newStatus, oldStatus, timestamp: Date.now() },
            })
          );
        }
      },

      isVipActive: () => {
        const { isVip, expires, isAdmin } = get();

        // If user is not VIP, return false
        if (!isVip) return false;

        // If there's no expiration date, consider it active (permanent)
        if (!expires) return true;

        // Check if the subscription is still active based on expiration date
        const now = new Date();
        const expirationDate = new Date(expires);
        const isActive = expirationDate > now;

        // If VIP status expired, handle the expiration
        if (isVip && !isActive) {
          setTimeout(() => {
            get().handleVipExpiration();
          }, 100);
        }

        return isActive;
      },

      handleVipExpiration: () => {
        const currentState = get();
        if (currentState.isVip && !get().isVipActive()) {
          console.log("VIP subscription expired, updating status...");
          get().updateUser({ isVip: false });
          get().forceVipStatusRefresh();
        }
      },

      initializeAuth: async () => {
        const state = get();

        if (state.isInitialized) return;
        set({ isInitialized: true });

        if (!state.isAuth || !state.accessToken || !state.refreshToken) {
          return;
        }

        const now = Date.now();
        const tokenExpired =
          !state.tokenExpirationTime || state.tokenExpirationTime <= now;
        const tokenExpiringSoon =
          state.tokenExpirationTime && state.tokenExpirationTime - now < 300000; // 5 minutes

        if (tokenExpired || tokenExpiringSoon) {
          console.log("Token expired or expiring soon, attempting refresh...");
          const refreshSuccess = await get().refreshAccessToken();

          if (!refreshSuccess) {
            console.log("Token refresh failed, clearing user data");
            get().clearUser();
            return;
          }
        }

        try {
          const isValid = await get().validateAuthState();
          if (!isValid) {
            console.log("Auth state validation failed, clearing user data");
            get().clearUser();
            return;
          }

          console.log("Auth state validated successfully");

          get().handleVipExpiration();

          get().scheduleTokenRefresh();
          get().scheduleStatusCheck();
          get().scheduleVipStatusCheck();
          get().startVipExpirationMonitor();

          setTimeout(() => {
            get().forceVipStatusRefresh();
          }, 1000);
        } catch (error) {
          get().clearUser();
        }
      },

      validateAuthState: async () => {
        try {
          const { accessToken } = get();
          if (!accessToken) return false;

          const response = await fetch(`${SERVER_API}/auth/validate`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 401) {
            return await get().refreshAccessToken();
          }

          const data = await response.json();
          if (data.status === "success") {
            if (data.data.user) {
              get().updateUser(data.data.user);
            }
            return true;
          }

          return false;
        } catch (error) {
          console.error("Auth validation error:", error);
          return false;
        }
      },

      resetInitialization: () => {
        set({ isInitialized: false });
      },

      setUser: (userData) => {
        const currentVipStatus = get().isVipActive();
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
          isInitialized: true,
        });

        const newVipStatus = get().isVipActive();
        if (currentVipStatus !== newVipStatus) {
          get().notifyVipStatusChange(newVipStatus, currentVipStatus);
        }

        get().scheduleTokenRefresh();
        get().scheduleStatusCheck();
        get().scheduleVipStatusCheck();
      },

      updateUser: (userData) => {
        const currentState = get();
        const oldVipStatus = currentState.isVipActive();

        set((state) => ({
          ...state,
          ...userData,
        }));

        const newVipStatus = get().isVipActive();
        if (oldVipStatus !== newVipStatus) {
          get().notifyVipStatusChange(newVipStatus, oldVipStatus);
        }
      },

      clearUser: () => {
        const currentVipStatus = get().isVipActive();

        get().cancelTokenRefresh();
        get().cancelStatusCheck();
        get().cancelVipStatusCheck();

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
          vipCheckTimeoutId: null,
          emailVerified: false,
          isInitialized: false,
        });

        if (currentVipStatus) {
          get().notifyVipStatusChange(false, currentVipStatus);
        }
      },

      resendVerificationCode: async (email) => {
        try {
          const response = await fetch(
            `${SERVER_API}/auth/resend-verification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

          const data = await response.json();
          return {
            success: data.status === "success",
            message: data.message,
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to resend verification code",
          };
        }
      },

      checkVipStatus: async () => {
        try {
          const { accessToken, isAuth, expires } = get();
          if (!accessToken || !isAuth) return;

          const currentVipActive = get().isVipActive();

          const response = await fetch(`${SERVER_API}/auth/vip-status`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (data.status === "success") {
            const serverVipStatus = data.data.isVip;
            const serverExpires = data.data.expires;

            // Always update with server data
            const hasChanges =
              get().isVip !== serverVipStatus ||
              expires !== serverExpires ||
              get().vipPlan !== data.data.vipPlan;

            if (hasChanges) {
              get().updateUser({
                isVip: serverVipStatus,
                expires: serverExpires,
                vipPlan: data.data.vipPlan,
                vipPlanDisplayName: data.data.vipPlanDisplayName,
                duration: data.data.duration,
                activation: data.data.activation,
              });
            }
          }
        } catch (error) {
          console.error("VIP status check failed:", error);
        }
      },

      scheduleVipStatusCheck: () => {
        const { vipCheckTimeoutId } = get();
        if (vipCheckTimeoutId) {
          clearTimeout(vipCheckTimeoutId);
        }

        const newTimeoutId = setTimeout(() => {
          get().checkVipStatus();
          get().scheduleVipStatusCheck();
        }, VIP_STATUS_CHECK_INTERVAL);

        set({ vipCheckTimeoutId: newTimeoutId });
      },

      cancelVipStatusCheck: () => {
        const { vipCheckTimeoutId } = get();
        if (vipCheckTimeoutId) {
          clearTimeout(vipCheckTimeoutId);
          set({ vipCheckTimeoutId: null });
        }
      },

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

      forceVipStatusRefresh: async () => {
        await Promise.all([get().checkVipStatus(), get().checkUserStatus()]);
      },

      startVipExpirationMonitor: () => {
        const checkExpiration = () => {
          const { isVip, expires, isAdmin } = get();

          // Only skip expiration monitoring if admin has no expiration date
          if (isAdmin && !expires) return;

          if (isVip && expires) {
            const now = new Date();
            const expirationDate = new Date(expires);
            const timeUntilExpiration = expirationDate - now;

            if (timeUntilExpiration <= 0) {
              console.log("VIP expired, updating status...");
              get().updateUser({ isVip: false });
              get().forceVipStatusRefresh();
            } else if (timeUntilExpiration <= 60000) {
              // 1 minute
              setTimeout(checkExpiration, 5000); // Check every 5 seconds
            } else {
              setTimeout(checkExpiration, VIP_STATUS_CHECK_INTERVAL);
            }
          }
        };

        const currentVipActive = get().isVipActive();
        if (currentVipActive) {
          checkExpiration();
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
            get().checkVipStatus();
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
              username: data.data.user.username,
            };
          }

          if (
            data.status === "success" &&
            data.data?.user &&
            data.data?.tokens
          ) {
            const userWithTokens = {
              ...data.data.user,
              tokens: data.data.tokens,
            };

            get().setUser(userWithTokens);
            get().startVipExpirationMonitor();

            return {
              success: true,
              message: data.message,
              isVip: get().isVipActive(), // Use computed VIP status
              isAdmin: data.data.user.isAdmin,
            };
          }

          return {
            success: false,
            message: data.message || "Login failed",
          };
        } catch (error) {
          return {
            success: false,
            message: "Login failed",
          };
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();

          get().clearUser();

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

            setTimeout(() => {
              get().forceVipStatusRefresh();
              get().startVipExpirationMonitor();
            }, 1000);

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
          const response = await fetch(
            `${SERVER_API}/auth/update-profile-image`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ image: imageData }),
            }
          );

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
          const response = await fetch(
            `${SERVER_API}/auth/reset-password-request`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            }
          );

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
            message: data.message,
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
        const { expires, isAdmin } = get();
        // Only return Infinity for admins without expiration dates
        if (isAdmin && !expires) return Infinity;
        if (!expires) return 0;
        const remaining = new Date(expires) - new Date();
        return Math.max(0, remaining);
      },

      getVipDaysRemaining: () => {
        const { isAdmin, expires } = get();
        // Only return null for admins without expiration dates
        if (isAdmin && !expires) return null;
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
