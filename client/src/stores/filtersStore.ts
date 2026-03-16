import { create } from "zustand";

interface FiltersState {
	search: string;
	selectedTag: string;
	selectedCategory: string;
	isFavorite: boolean;
	page: number;
	setSearch: (v: string) => void;
	setSelectedTag: (v: string) => void;
	setSelectedCategory: (v: string) => void;
	toggleFavorites: () => void;
	setPage: (n: number) => void;
	resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()((set) => ({
	search: "",
	selectedTag: "",
	selectedCategory: "",
	isFavorite: false,
	page: 1,

	setSearch: (v) => {
		set({ search: v, page: 1 });
	},

	setSelectedTag: (v) => {
		set({ selectedTag: v, page: 1 });
	},

	setSelectedCategory: (v) => {
		set({ selectedCategory: v, page: 1 });
	},

	toggleFavorites: () => set((s) => ({ isFavorite: !s.isFavorite, page: 1 })),

	setPage: (n) => set({ page: n }),

	resetFilters: () => {
		set({
			search: "",
			selectedTag: "",
			selectedCategory: "",
			isFavorite: false,
			page: 1,
		});
	},
}));
