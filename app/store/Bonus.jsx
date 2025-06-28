import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBonusStore = create(
  persist(
    (set, get) => ({
      bonuses: [], // General bonuses (for HomeBonus)
      exclusiveBonuses: [], // Exclusive bonuses (for ExclusiveOffers)
      locations: [],
      loading: false,
      exclusiveLoading: false, // Separate loading state
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

      // New method specifically for exclusive bonuses
      fetchExclusiveBonuses: async (query = "") => {
        try {
          set({ exclusiveLoading: true, error: null });
          const response = await fetch(`${SERVER_API}/bonus?${query}`);
          const data = await response.json();

          if (response.ok) {
            set({ exclusiveBonuses: data.data || [] });
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to fetch exclusive bonuses");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ exclusiveLoading: false });
        }
      },

      fetchBonusesByLocation: async (location, query = "") => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/bonus/location/${encodeURIComponent(location)}?${query}`);
          const data = await response.json();

          if (response.ok) {
            set({ bonuses: data.data || [] });
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to fetch bonuses by location");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchAllLocations: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/bonus/locations`);
          const data = await response.json();

          if (response.ok) {
            set({ locations: data.data || [] });
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to fetch locations");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },



      // Helper function to filter bonuses by location in the store
      getBonusesByLocation: (location) => {
        const { bonuses } = get();
        if (!location) return bonuses;
        return bonuses.filter(bonus => 
          bonus.location.toLowerCase().includes(location.toLowerCase())
        );
      },

      // Clear bonuses from store
      clearBonuses: () => set({ bonuses: [], exclusiveBonuses: [] }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "bonus-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);