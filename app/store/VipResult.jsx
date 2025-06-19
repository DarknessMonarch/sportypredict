import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useVipResultStore = create(
  persist(
    (set, get) => ({
      results: [],
      matchTime: null,
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
            const normalizedData = {
              ...data,
              time: data.time || data.hours || "",
              hours: data.hours || data.time || 0
            };
            set({ matchTime: normalizedData });
            return { success: true, data: normalizedData };
          }
          throw new Error(data.error || "Failed to fetch match time");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },



   

      clearError: () => set({ error: null }),

      resetLoading: () => set({ loading: false }),
    }),
    {
      name: "vipresult-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        results: state.results,
        matchTime: state.matchTime
      }),
    }
  )
);