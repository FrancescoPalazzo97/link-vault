import { create } from "zustand";

interface UiState {
	isAddLinkOpen: boolean;
	openAddLink: () => void;
	closeAddLink: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
	isAddLinkOpen: false,

	openAddLink: () => set({ isAddLinkOpen: true }),

	closeAddLink: () => set({ isAddLinkOpen: false }),
}));
