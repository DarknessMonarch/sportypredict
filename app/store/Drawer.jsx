import { create } from 'zustand';

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false; 
  
  return window.innerWidth < 768;
};

export const useDrawerStore = create((set) => ({
    isOpen: typeof window !== 'undefined' ? !isMobileDevice() : true, 

    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    setOpen: () => set({ isOpen: true }),  
    setClose: () => set({ isOpen: false }),
}));