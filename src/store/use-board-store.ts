import { create } from "zustand";

interface BoardStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
