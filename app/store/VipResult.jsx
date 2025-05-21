import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth";

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
          const response = await fetch(`${SERVER_API}/`);
          
          const data = await response.json();
          if (response.ok) {
            set({ results: data });
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to fetch results");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message || "Failed to fetch results" };
        } finally {
          set({ loading: false });
        }
      },

      getMatchTime: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/match-time`);
          
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
    
      addResult: async (resultData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const response = await fetch(`${SERVER_API}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(resultData)
          });

          const data = await response.json();
          if (response.ok) {
            set(state => ({
              results: [...state.results, data]
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

      deleteResult: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const response = await fetch(`${SERVER_API}/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();
          if (response.ok) {
            set(state => ({
              results: state.results.filter(result => result._id !== id)
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
          
          const response = await fetch(`${SERVER_API}/match-time`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(timeData)
          });

          const data = await response.json();
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
    }),
    {
      name: "vip-result-store",
      getStorage: () => localStorage,
    }
  )
);