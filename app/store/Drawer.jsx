import { create } from 'zustand';

export const useDrawerStore = create((set) => ({
    isOpen: true,
    toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    setOpen: () => set({ isOpen: true }),  
    setClose: () => set({ isOpen: false }),  
}));
