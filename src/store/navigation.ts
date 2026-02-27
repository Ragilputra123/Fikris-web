import { create } from 'zustand';

type View = 'public' | 'dashboard' | 'members' | 'events' | 'attendance' | 'finance';

interface NavigationState {
  currentView: View;
  setView: (view: View) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentView: 'public',
  setView: (view) => set({ currentView: view, sidebarOpen: false }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
