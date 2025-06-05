import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAdvertStore = create(
  persist(
    (set, get) => ({
      adverts: [],
      loading: false,
      error: null,

      fetchAdverts: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/advert`);

          const data = await response.json();
          if (response.ok) {
            set({ adverts: data });
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to fetch adverts");
        } catch (error) {
          set({ error: error.message });
          return {
            success: false,
            message: error.message || "Failed to fetch adverts",
          };
        } finally {
          set({ loading: false });
        }
      },

      getAdvertById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/advert/${id}`);

          const data = await response.json();
          if (response.ok) {
            return { success: true, data };
          }
          throw new Error(data.error || "Failed to fetch advert");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

    }),
    {
      name: "advert-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);