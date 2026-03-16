import {
	IconCategory,
	IconHome,
	IconLogout,
	IconMoon,
	IconStar,
	IconSun,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/stores/authStore";
import { useFiltersStore } from "@/stores/filtersStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Logo } from "./Logo";

interface Props {
	onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: Props) {
	const logout = useAuthStore((s) => s.logout);
	const theme = useThemeStore((s) => s.theme);
	const toggle = useThemeStore((s) => s.toggle);
	const selectedCategory = useFiltersStore((s) => s.selectedCategory);
	const setSelectedCategory = useFiltersStore((s) => s.setSelectedCategory);
	const isFavorite = useFiltersStore((s) => s.isFavorite);
	const toggleFavorites = useFiltersStore((s) => s.toggleFavorites);
	const { data: categories, isLoading: categoriesLoading } = useCategories();

	const handleCategoryClick = (cat: string) => {
		setSelectedCategory(selectedCategory === cat ? "" : cat);
		onNavigate?.();
	};

	const handleFavoritesClick = () => {
		toggleFavorites();
		onNavigate?.();
	};

	return (
		<div className="flex h-full flex-col">
			{/* Logo */}
			<div className="flex items-center gap-2 px-3 py-2 mb-4">
				<Logo />
			</div>
			<Separator className="mb-4" />

			{/* Navigation */}
			<nav className="flex flex-col gap-1">
				<NavLink
					to="/"
					onClick={onNavigate}
					className={({ isActive }) =>
						`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
							isActive ? "bg-accent font-medium" : "text-muted-foreground"
						}`
					}
				>
					<IconHome size={18} />
					Dashboard
				</NavLink>
			</nav>

			<Separator className="my-4" />

			{/* Favorites */}
			<button
				type="button"
				onClick={handleFavoritesClick}
				className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
					isFavorite ? "bg-accent font-medium" : "text-muted-foreground"
				}`}
			>
				<IconStar size={18} className={isFavorite ? "text-yellow-500 fill-yellow-500" : ""} />
				Favorites
			</button>

			<Separator className="my-4" />

			{/* Categories */}
			<div className="flex-1 overflow-y-auto">
				<p className="px-3 mb-2 text-xs font-medium uppercase text-muted-foreground">Categories</p>
				{categoriesLoading && (
					<div className="space-y-2 px-3">
						<Skeleton className="h-6 w-full rounded" />
						<Skeleton className="h-6 w-full rounded" />
						<Skeleton className="h-6 w-full rounded" />
					</div>
				)}
				{categories && categories.length === 0 && (
					<p className="px-3 text-xs text-muted-foreground">No categories yet</p>
				)}
				{categories && categories.length > 0 && (
					<nav className="flex flex-col gap-1">
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => handleCategoryClick(cat)}
								className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent text-left ${
									selectedCategory === cat ? "bg-accent font-medium" : "text-muted-foreground"
								}`}
							>
								<IconCategory size={16} />
								{cat}
							</button>
						))}
					</nav>
				)}
			</div>

			{/* Footer */}
			<div className="mt-auto">
				<Button variant="ghost" size="icon" onClick={toggle} className="self-start ml-1">
					{theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
				</Button>
				<Separator className="my-4" />
				<Button
					variant="ghost"
					size="sm"
					className="justify-start gap-3 text-muted-foreground w-full"
					onClick={() => {
						onNavigate?.();
						logout();
					}}
				>
					<IconLogout size={18} />
					Logout
				</Button>
			</div>
		</div>
	);
}
