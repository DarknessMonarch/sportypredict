import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const usePredictionStore = create(
  persist(
    (set, get) => ({
      predictions: [],
      singlePrediction: null,
      predictionCounts: {},
      loading: false,
      error: null,

      fetchPredictionCounts: async (date) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/counts/${date}`,
            requestOptions
          );
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && data.counts) {
            set({ predictionCounts: data.counts });
            return { success: true, counts: data.counts };
          } else {
            set({ predictionCounts: {} });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, predictionCounts: {} });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchSinglePrediction: async (category, teamA, teamB, date) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (category === 'vip') {
            if (!accessToken) {
              throw new Error('Authentication required for VIP predictions');
            }
          }
      
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/${category}/${teamA}/${teamB}/${date}`,
            requestOptions
          );
      
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          }
          
          if (response.status === 403) {
            throw new Error('VIP subscription required or has expired');
          }

          if (response.status === 404) {
            set({ singlePrediction: null });
            throw new Error('Prediction not found');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && data.data) {
            set({ singlePrediction: data.data });
            return { success: true, data: data.data };
          } else {
            set({ singlePrediction: null });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, singlePrediction: null });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchPredictions: async (date, category = 'football') => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (category === 'vip') {
            if (!accessToken) {
              throw new Error('Authentication required for VIP predictions');
            }
          }
      
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/${category}/${date}`,
            requestOptions
          );
      
          if (response.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          }
          
          if (response.status === 403) {
            throw new Error('VIP subscription required or has expired');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && Array.isArray(data.data)) {
            const sortedPredictions = data.data.sort((a, b) => 
              new Date(a.time).getTime() - new Date(b.time).getTime()
            );
            
            set({ predictions: sortedPredictions });
            return { success: true, data: sortedPredictions };
          } else {
            set({ predictions: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, predictions: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },


      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      resetStore: () => set({
        predictions: [],
        singlePrediction: null,
        predictionCounts: {},
        loading: false,
        error: null,
      }),
    }),
    {
      name: "prediction-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        predictions: state.predictions,
        singlePrediction: state.singlePrediction,
        predictionCounts: state.predictionCounts,
      })
    }
  )
);