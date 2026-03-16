import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
	theme: Theme;
	toggle: () => void;
}

function getInitialTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: getInitialTheme(),

			toggle: () => {
				set((s) => ({
					theme: s.theme === "dark" ? "light" : "dark",
				}));
			},
		}),
		{ name: "lv_theme" }
	)
);

function applyTheme(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
}

applyTheme(useThemeStore.getState().theme);
useThemeStore.subscribe((s) => applyTheme(s.theme));
