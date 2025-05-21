import { create } from "zustand";

const SPORTS_API = process.env.NEXT_PUBLIC_SPORTS_API;
const FOOTBALL_API = process.env.NEXT_PUBLIC_FOOTBALL_API;

const createSportStore = (set, get) => ({
  sports: [],
  footballPredictions: [],
  loading: false,
  error: null,

  fetchSports: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(SPORTS_API);
      const data = await response.json();

      if (data.success) {
        // Format the data to ensure consistency
        const formattedData = data.data.map(item => ({
          ...item,
          sport: item.sport || "",
          league: item.league || "",
          _id: item._id || { teamA: "", teamB: "" }
        }));
        set({ sports: formattedData });
        return { success: true, data: formattedData };
      }
      throw new Error(data.message);
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ loading: false });
    }
  },

  fetchFootballPredictions: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(FOOTBALL_API);
      const data = await response.json();

      if (data.success) {
        // Format the football data to ensure consistency with sports data
        const formattedData = data.data.map(item => ({
          ...item,
          sport: "football", // Explicitly set sport as football
          league: item.league || "",
          // Ensure _id consistency
          _id: item._id || { teamA: item.teamA || "", teamB: item.teamB || "" }
        }));
        set({ footballPredictions: formattedData });
        return { success: true, data: formattedData };
      }
      throw new Error(data.message);
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ loading: false });
    }
  },

  fetchAllData: async () => {
    const [sportsResult, footballResult] = await Promise.all([
      get().fetchSports(),
      get().fetchFootballPredictions(),
    ]);

    return {
      sports: sportsResult,
      football: footballResult,
    };
  },

  getSportsCategories: () => {
    const sports = get().sports;
    return [...new Set(sports.map(sport => sport.sport))];
  },

  getSportsByCategory: (category) => {
    const sports = get().sports;
    return sports.filter(sport => sport.sport.toLowerCase() === category.toLowerCase());
  },

  getFootballByCategory: (category) => {
    const football = get().footballPredictions;
    // For football data, we might want to filter by league or other criteria
    return football;
  },

  getDataByType: (type) => {
    // Helper function to get appropriate data based on sport type
    if (type.toLowerCase() === "football") {
      return get().footballPredictions;
    } else {
      return get().sports.filter(item => 
        item.sport.toLowerCase() === type.toLowerCase()
      );
    }
  },

  clearData: () => {
    set({ sports: [], footballPredictions: [], error: null });
  },
});

// Create the store with no persistence for API data
export const useSportStore = create(createSportStore);