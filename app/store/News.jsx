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

      fetchArticles: async (page = 1, limit = 1000, search = '', featured = false, category = '', sort = '-publishDate') => {
        try {
          set({ loading: true, error: null });
          
          let url = `${SERVER_API}/news?limit=${limit}&sort=${sort}`;
          
          if (category && category !== 'all' && category !== '') {
            url += `&category=${encodeURIComponent(category)}`;
          }
          if (featured) {
            url += `&featured=true`;
          }
          if (search && search.trim() !== '') {
            url += `&search=${encodeURIComponent(search)}`;
          }
          
          
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

      fetchNewsByCategory: async (category, page = 1, limit = 1000) => {
        try {
          set({ loading: true, error: null });
          
          if (!category || category === 'all') {
            // If no category or 'all', fetch all articles
            return await get().fetchArticles(page, limit);
          }
          
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

      searchNews: async (query, limit = 1000) => {
        try {
          set({ loading: true, error: null });
          
          if (!query || query.trim() === '') {
            return await get().fetchArticles(1, limit);
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

      createArticle: async (articleData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          if (!accessToken) {
            throw new Error('Authentication required');
          }

          if (!(articleData instanceof FormData)) {
            throw new Error('Article data must be provided as FormData');
          }
          
          const requestOptions = {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: articleData
          };

          const response = await fetch(`${SERVER_API}/news`, requestOptions);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to create news article');
          }

          if (data.success) {
            set(state => ({
              articles: [data.article, ...state.articles],
              totalArticles: state.totalArticles + 1
            }));
            return { success: true, data: data.article };
          }
          
          throw new Error(data.message || 'Failed to create news article');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      updateArticle: async (id, articleData) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;

          if (!accessToken) {
            throw new Error('Authentication required');
          }

          if (!(articleData instanceof FormData)) {
            throw new Error('Article data must be provided as FormData');
          }
          
          const requestOptions = {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            body: articleData
          };

          const response = await fetch(`${SERVER_API}/news/${id}`, requestOptions);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to update news article');
          }

          if (data.success) {
            set(state => ({
              articles: state.articles.map(article => 
                article._id === id ? data.article : article
              ),
              singleArticle: state.singleArticle?._id === id ? data.article : state.singleArticle,
              featuredArticles: state.featuredArticles.map(article => 
                article._id === id ? data.article : article
              )
            }));
            return { success: true, data: data.article };
          }
          
          throw new Error(data.message || 'Failed to update news article');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      deleteArticle: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/news/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to delete news article');
          }

          if (data.success) {
            set(state => ({
              articles: state.articles.filter(article => article._id !== id),
              singleArticle: state.singleArticle?._id === id ? null : state.singleArticle,
              featuredArticles: state.featuredArticles.filter(article => article._id !== id),
              totalArticles: Math.max(0, state.totalArticles - 1)
            }));
            return { success: true, message: data.message };
          }
          
          throw new Error(data.message || 'Failed to delete news article');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchNewsStats: async () => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/news/admin/stats`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch news statistics');
          }

          if (data.success) {
            set({ newsStats: data });
            return { success: true, data: data };
          }
          
          throw new Error(data.message || 'Failed to fetch news statistics');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      clearError: () => set({ error: null }),

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