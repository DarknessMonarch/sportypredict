import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth"; 
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useBlogStore = create(
  persist(
    (set, get) => ({
      blogs: [],
      singleBlog: null,
      featuredBlogs: [],
      categories: [],
      tags: [],
      loading: false,
      error: null,

      fetchSingleBlog: async (id) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/blog/${id}`);
      
          if (response.status === 404) {
            set({ singleBlog: null });
            throw new Error('Blog not found');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && data.blog) {
            set({ singleBlog: data.blog });
            return data.blog;
          } else {
            set({ singleBlog: null });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, singleBlog: null });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchBlogs: async (category = '', tag = '', search = '') => {
        try {
          set({ loading: true, error: null });
          
          let url = `${SERVER_API}/blog?`;
          
          if (category) url += `&category=${encodeURIComponent(category)}`;
          if (tag) url += `&tag=${encodeURIComponent(tag)}`;
          if (search) url += `&search=${encodeURIComponent(search)}`;
          
          const response = await fetch(url);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.blogs)) {
            set({ 
              blogs: data.blogs
            });
            return data;
          } else {
            set({ blogs: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, blogs: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchFeaturedBlogs: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/blog/featured`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.blogs)) {
            set({ featuredBlogs: data.blogs });
            return data.blogs;
          } else {
            set({ featuredBlogs: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, featuredBlogs: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/blog/categories`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.categories)) {
            set({ categories: data.categories });
            return data.categories;
          } else {
            set({ categories: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, categories: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchTags: async () => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/blog/tags`);
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.tags)) {
            set({ tags: data.tags });
            return data.tags;
          } else {
            set({ tags: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, tags: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      fetchAuthorBlogs: async (authorId) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/blog/author/${authorId}`);
      
          if (response.status === 404) {
            set({ blogs: [] });
            throw new Error('Author not found');
          }
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
      
          if (data.success && Array.isArray(data.blogs)) {
            set({ 
              blogs: data.blogs
            });
            return data;
          } else {
            set({ blogs: [] });
            throw new Error(data.message || 'Invalid data format received from server');
          }
        } catch (error) {
          set({ error: error.message, blogs: [] });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },


      toggleFeatured: async (id) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }

          const response = await fetch(`${SERVER_API}/blog/${id}/featured`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Failed to toggle featured status');
          }

          if (data.success) {
            set(state => ({
              blogs: state.blogs.map(blog => 
                blog._id === id ? { ...blog, featured: data.featured } : blog
              ),
              singleBlog: state.singleBlog?._id === id ? 
                { ...state.singleBlog, featured: data.featured } : state.singleBlog
            }));
            return { success: true, featured: data.featured, message: data.message };
          }
          
          throw new Error(data.message || 'Failed to toggle featured status');
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "blog-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);