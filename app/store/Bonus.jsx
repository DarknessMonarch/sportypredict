import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBonusStore = create(
  persist(
    (set, get) => ({
      bonuses: [],
      locations: [],
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

      createBonus: async (formData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/bonus`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (response.ok) {
            set((state) => ({
              bonuses: [...state.bonuses, data.data],
            }));
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to create bonus");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      deleteBonus: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/bonus/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            set((state) => ({
              bonuses: state.bonuses.filter((b) => b._id !== id),
            }));
            return { success: true };
          }

          throw new Error(data.error || "Failed to delete bonus");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      updateBonus: async (id, formData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          const response = await fetch(`${SERVER_API}/bonus/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (response.ok) {
            set((state) => ({
              bonuses: state.bonuses.map((b) =>
                b._id === id ? data.data : b
              ),
            }));
            return { success: true, data };
          }

          throw new Error(data.error || "Failed to update bonus");
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
      clearBonuses: () => set({ bonuses: [] }),

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "bonus-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);