import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useVipResultStore = create(
  persist(
    (set, get) => ({
      results: [],
      matchTime: { hours: 0, minutes: 0, seconds: 0, active: true },
      loading: false,
      error: null,

      fetchResults: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/vipresult`);

          const data = await response.json();
          if (response.ok) {
            set({ results: data });
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to fetch results");
        } catch (error) {
          set({ error: error.message });
          return {
            success: false,
            message: error.message || "Failed to fetch results",
          };
        } finally {
          set({ loading: false });
        }
      },

      getMatchTime: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/vipresult/match-time`);

          const data = await response.json();
          if (response.ok) {
            set({ matchTime: data });
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to fetch match time");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      createResult: async (resultData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/vipresult`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(resultData),
          });

          // BETTER ERROR HANDLING
          const text = await response.text();
          let data;
          
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Failed to parse JSON response:', text);
            throw new Error('Invalid response from server');
          }

          if (response.ok) {
            set((state) => ({
              results: [data, ...state.results],
            }));
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to add result");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      updateResult: async (id, resultData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/vipresult/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(resultData),
          });

          // BETTER ERROR HANDLING
          const text = await response.text();
          let data;
          
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Failed to parse JSON response:', text);
            throw new Error('Invalid response from server');
          }

          if (response.ok) {
            set((state) => ({
              results: state.results.map((result) =>
                result._id === id ? data : result
              ),
            }));
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to update result");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      deleteResult: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/vipresult/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            set((state) => ({
              results: state.results.filter((result) => result._id !== id),
            }));
            return { success: true };
          }
          throw new Error(data.error || "Failed to delete result");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      updateMatchTime: async (timeData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/vipresult/match-time`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(timeData),
          });

          // BETTER ERROR HANDLING
          const text = await response.text();
          let data;
          
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('Failed to parse JSON response:', text);
            throw new Error('Invalid response from server');
          }

          if (response.ok) {
            set({ matchTime: data });
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to update match time");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Clear errors
      clearError: () => set({ error: null }),

      // Reset loading state
      resetLoading: () => set({ loading: false }),
    }),
    {
      name: "vipresult-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);