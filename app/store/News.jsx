import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useNewsStore = create(
  persist(
    (set, get) => ({
      articles: [],
      singleArticle: null,
      featuredArticles: [],
      categories: ['football', 'basketball', 'tennis'],
      loading: false,
      error: null,
      totalArticles: 0,
      newsStats: null,

      fetchSingleArticle: async (id) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/news/${id}`);
      
          if (response.status === 404) {
            set({ singleArticle: null });
            throw new Error('News article not found');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && data.article) {
            set({ singleArticle: data.article });
            return { success: true, data: data.article };
          } else {
            set({ singleArticle: null });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, singleArticle: null });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchArticles: async (limit = 50, category = '', featured = false, search = '', sort = '-publishDate') => {
        try {
          set({ loading: true, error: null });
          
          let url = `${SERVER_API}/news?limit=${limit}&sort=${sort}`;
          
          if (category && category !== 'all') url += `&category=${encodeURIComponent(category)}`;
          if (featured) url += `&featured=true`;
          if (search) url += `&search=${encodeURIComponent(search)}`;
          
          const response = await fetch(url);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.articles)) {
            set({ 
              articles: data.articles,
              totalArticles: data.total || data.articles.length
            });
            return { success: true, data: data };
          } else {
            set({ articles: [], totalArticles: 0 });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, articles: [], totalArticles: 0 });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchFeaturedArticles: async (limit = 5) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/news/featured?limit=${limit}`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.articles)) {
            set({ featuredArticles: data.articles });
            return { success: true, data: data.articles };
          } else {
            set({ featuredArticles: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, featuredArticles: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchNewsByCategory: async (category, limit = 50) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/news/category/${category}?limit=${limit}`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.articles)) {
            set({ 
              articles: data.articles,
              totalArticles: data.total || data.articles.length
            });
            return { success: true, data: data };
          } else {
            set({ articles: [], totalArticles: 0 });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, articles: [], totalArticles: 0 });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      searchNews: async (query, limit = 50) => {
        try {
          set({ loading: true, error: null });
          
          if (!query || query.trim() === '') {
            throw new Error('Search query is required');
          }
          
          const response = await fetch(`${SERVER_API}/news/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.articles)) {
            set({ 
              articles: data.articles,
              totalArticles: data.total || data.articles.length
            });
            return { success: true, data: data };
          } else {
            set({ articles: [], totalArticles: 0 });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, articles: [], totalArticles: 0 });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

   

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      resetStore: () => set({
        articles: [],
        singleArticle: null,
        featuredArticles: [],
        loading: false,
        error: null,
        totalArticles: 0,
        newsStats: null
      }),
    }),
    {
      name: "news-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        articles: state.articles,
        featuredArticles: state.featuredArticles,
        categories: state.categories
      })
    }
  )
);