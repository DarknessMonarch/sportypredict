import { create } from "zustand";
import { useAuthStore } from "@/app/store/Auth";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const usePaymentStore = create(
  persist(
    (set, get) => ({
      paymentPlans: [],
      loading: false,
      error: null,

      fetchPaymentPlans: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/payment`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.status === "success") {
            set({ paymentPlans: data.data.plans || [] });
            return { success: true, data: data.data, message: data.message };
          }
          throw new Error(data.message || "Failed to fetch payment plans");
        } catch (error) {
          console.error("Fetch payment plans error:", error);
          set({ error: error.message });
          return { success: false, message: error.message || "Failed to fetch payment plans" };
        } finally {
          set({ loading: false });
        }
      },

      getPaymentPlanByCountry: async (country) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/payment/country/${encodeURIComponent(country)}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch payment plan for country");
        } catch (error) {
          console.error("Get payment plan by country error:", error);
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      getPricingByCountryAndPlan: async (country, planType) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(
            `${SERVER_API}/payment/pricing/${encodeURIComponent(country)}/${planType}`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch pricing");
        } catch (error) {
          console.error("Get pricing by country and plan error:", error);
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      validatePayment: async (country, duration, amount) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/payment/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ country, duration, amount })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.status === "success") {
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Payment validation failed");
        } catch (error) {
          console.error("Validate payment error:", error);
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },


      // Helper method to get payment plan by ID
      getPaymentPlanById: (id) => {
        const state = get();
        return state.paymentPlans.find(plan => plan._id === id);
      },

      // Helper method to get all countries
      getAllCountries: () => {
        const state = get();
        return [...new Set(state.paymentPlans.map(plan => plan.country))];
      },

      // Helper method to get payment plans with weekly pricing
      getWeeklyPlans: () => {
        const state = get();
        return state.paymentPlans.filter(plan => plan.weekly > 0);
      },

      // Helper method to get payment plans with monthly pricing
      getMonthlyPlans: () => {
        const state = get();
        return state.paymentPlans.filter(plan => plan.monthly > 0);
      },

      // Helper method to get payment plans with yearly pricing
      getYearlyPlans: () => {
        const state = get();
        return state.paymentPlans.filter(plan => plan.yearly > 0);
      },

      // Get all pricing for a specific country
      getCountryPricing: (country) => {
        const state = get();
        return state.paymentPlans.find(plan => plan.country === country);
      },

      // Get price by country and duration
      getPriceByCountryAndDuration: (country, duration) => {
        const plan = get().getCountryPricing(country);
        if (!plan) return null;

        switch (duration) {
          case 7:
            return { price: plan.weekly, planType: 'weekly', displayName: 'Weekly' };
          case 30:
            return { price: plan.monthly, planType: 'monthly', displayName: 'Monthly' };
          case 365:
            return { price: plan.yearly, planType: 'yearly', displayName: 'Yearly' };
          default:
            return null;
        }
      },

      // Get plan options for a country (simple list without savings calculations)
      getPlanOptions: (country) => {
        const plan = get().getCountryPricing(country);
        if (!plan) return [];

        const options = [];
        
        if (plan.weekly > 0) {
          options.push({
            duration: 7,
            planType: 'weekly',
            displayName: 'Weekly',
            price: plan.weekly,
            pricePerDay: plan.weekly / 7,
            currency: plan.currency
          });
        }
        
        if (plan.monthly > 0) {
          options.push({
            duration: 30,
            planType: 'monthly',
            displayName: 'Monthly',
            price: plan.monthly,
            pricePerDay: plan.monthly / 30,
            currency: plan.currency
          });
        }
        
        if (plan.yearly > 0) {
          options.push({
            duration: 365,
            planType: 'yearly',
            displayName: 'Yearly',
            price: plan.yearly,
            pricePerDay: plan.yearly / 365,
            currency: plan.currency
          });
        }

        return options;
      },

      // Validate if a payment amount matches expected price
      isValidPaymentAmount: async (country, duration, amount) => {
        const pricing = get().getPriceByCountryAndDuration(country, duration);
        if (!pricing) return false;

        // Allow small floating point differences (within 1 cent)
        return Math.abs(amount - pricing.price) < 0.01;
      },

      // Format price with currency
      formatPrice: (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency || 'USD'
        }).format(amount);
      },

      // Get duration options for a country
      getDurationOptions: (country) => {
        const plan = get().getCountryPricing(country);
        if (!plan) return [];

        const options = [];
        
        if (plan.weekly > 0) {
          options.push({
            duration: 7,
            label: 'Weekly',
            price: plan.weekly,
            formattedPrice: get().formatPrice(plan.weekly, plan.currency)
          });
        }
        
        if (plan.monthly > 0) {
          options.push({
            duration: 30,
            label: 'Monthly',
            price: plan.monthly,
            formattedPrice: get().formatPrice(plan.monthly, plan.currency)
          });
        }
        
        if (plan.yearly > 0) {
          options.push({
            duration: 365,
            label: 'Yearly',
            price: plan.yearly,
            formattedPrice: get().formatPrice(plan.yearly, plan.currency)
          });
        }

        return options;
      },

      clearError: () => set({ error: null }),

      resetStore: () => set({
        paymentPlans: [],
        loading: false,
        error: null,
      }),
    }),
    {
      name: "payment-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        paymentPlans: state.paymentPlans,
      }),
    }
  )
);