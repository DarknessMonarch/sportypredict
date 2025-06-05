import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBannerStore = create(
  persist(
    (set, get) => ({
      banners: [],
      loading: false,
      error: null,

      fetchBanners: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/banners`);

          const data = await response.json();
          if (data.status === "success") {
            set({ banners: data.data });
            return { success: true, data: data.data };
          }
          throw new Error(data.message);
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: " banner-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
