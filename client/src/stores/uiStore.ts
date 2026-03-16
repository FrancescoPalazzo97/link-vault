import { create } from "zustand";

interface UiState {
	isAddLinkOpen: boolean;
	mobileOpen: boolean;
	openAddLink: () => void;
	closeAddLink: () => void;
	setMobileOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
	isAddLinkOpen: false,
	mobileOpen: false,

	openAddLink: () => set({ isAddLinkOpen: true }),

	closeAddLink: () => set({ isAddLinkOpen: false }),

	setMobileOpen: (isOpen) => set({ mobileOpen: isOpen }),
}));
