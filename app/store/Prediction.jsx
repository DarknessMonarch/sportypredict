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
      vipSlipCounts: {},
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

      fetchVIPSlipCounts: async (date) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required for VIP slip counts');
          }
          
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          };
      
          const response = await fetch(
            `${SERVER_API}/predictions/vip-slip-counts/${date}`,
            requestOptions
          );
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.status === "success" && data.vipSlipCounts) {
            set({ vipSlipCounts: data.vipSlipCounts });
            return { success: true, vipSlipCounts: data.vipSlipCounts };
          } else {
            set({ vipSlipCounts: {} });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, vipSlipCounts: {} });
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
            `${SERVER_API}/predictions/${category}/${encodeURIComponent(teamA)}/${encodeURIComponent(teamB)}/${date}`,
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

      fetchPredictions: async (date, category = 'football', vipSlip = null) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (category === 'vip') {
            if (!accessToken) {
              throw new Error('Authentication required for VIP predictions');
            }
          }
      
          // Build URL with optional vipSlip filter
          let url = `${SERVER_API}/predictions/${category}/${date}`;
          if (category === 'vip' && vipSlip) {
            url += `?vipSlip=${encodeURIComponent(vipSlip)}`;
          }

          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
          };
      
          const response = await fetch(url, requestOptions);
      
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
            const sortedPredictions = data.data.sort((a, b) => {
              const timeA = a.time ? new Date(a.time).getTime() : 0;
              const timeB = b.time ? new Date(b.time).getTime() : 0;
              return timeA - timeB;
            });
            
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

      fetchAllPredictionsForDate: async (date) => {
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
      `${SERVER_API}/predictions/all/${date}`,
      requestOptions
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === "success" && Array.isArray(data.data)) {
      const sortedPredictions = data.data.sort((a, b) => {
        const timeA = a.time ? new Date(a.time).getTime() : 0;
        const timeB = b.time ? new Date(b.time).getTime() : 0;
        return timeA - timeB;
      });
      
      set({ predictions: sortedPredictions });
      return { 
        success: true, 
        data: sortedPredictions, 
        totalCount: data.totalCount || sortedPredictions.length 
      };
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

      getVIPPredictionsByStake: (stake) => {
        const state = get();
        return state.predictions.filter(pred => 
          pred.category === 'vip' && pred.stake === stake
        );
      },

      calculateTotalOddsForStake: (stake) => {
        const predictions = get().getVIPPredictionsByStake(stake);
        return predictions.reduce((total, pred) => total * (pred.odd || 1), 1);
      },

      getUniqueVIPStakes: () => {
        const state = get();
        const vipPredictions = state.predictions.filter(pred => pred.category === 'vip');
        const stakes = [...new Set(vipPredictions.map(pred => pred.stake))];
        return stakes.filter(stake => stake); // Remove empty stakes
      },

      isPartOfGroup: (predictionId) => {
        const state = get();
        return state.predictions.some(pred => 
          pred.isGrouped && 
          pred.originalPredictions && 
          pred.originalPredictions.some(original => original._id === predictionId)
        );
      },

      refreshPredictions: async (date, category, vipSlip = null) => {
        const currentState = get();
        if (!currentState.loading) {
          return currentState.fetchPredictions(date, category, vipSlip);
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      resetStore: () => set({
        predictions: [],
        singlePrediction: null,
        predictionCounts: {},
        vipSlipCounts: {},
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
        vipSlipCounts: state.vipSlipCounts,
      })
    }
  )
);