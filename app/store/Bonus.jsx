import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBonusStore = create(
  persist(
    (set, get) => ({
      bonuses: [],
      loading: false,
      error: null,

      fetchBonuses: async (query = "") => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/bonus?${query}`);
          const data = await response.json();

          if (response.ok) {
            set({ bonuses: data.data || [] });
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to fetch bonuses");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

    }),
    {
      name: "bonus-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
