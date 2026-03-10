import {
	IconHome,
	IconLink,
	IconLogout,
	IconMenu2,
	IconMoon,
	IconSun,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [{ to: "/", label: "Dashboard", icon: IconHome }];

export function AppLayout() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const logout = useAuthStore((s) => s.logout);
	const location = useLocation();
	const token = useAuthStore((s) => s.token);
	const { theme, toggle } = useTheme();

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	const isActive = (to: string) => location.pathname === to;

	const navLinks = (
		<nav className="flex flex-col gap-1">
			{NAV_ITEMS.map(({ to, label, icon: Icon }) => (
				<Link
					key={to}
					to={to}
					onClick={() => setMobileOpen(false)}
					className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
						isActive(to) ? "bg-accent font-medium" : "text-muted-foreground"
					}`}
				>
					<Icon size={18} />
					{label}
				</Link>
			))}
		</nav>
	);

	return (
		<div className="flex min-h-screen">
			{/* Desktop sidebar */}
			<aside className="hidden w-56 shrink-0 flex-col border-r p-4 md:flex">
				<div className="flex items-center gap-2 px-3 py-2 mb-4">
					<IconLink size={20} />
					<span className="font-semibold text-sm">LinkVault</span>
				</div>
				<Separator className="mb-4" />
				<div className="flex-1">{navLinks}</div>
				<Button variant="ghost" size="icon" onClick={toggle} className="self-start ml-1">
					{theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
				</Button>
				<Separator className="my-4" />
				<Button
					variant="ghost"
					size="sm"
					className="justify-start gap-3 text-muted-foreground"
					onClick={logout}
				>
					<IconLogout size={18} />
					Logout
				</Button>
			</aside>

			{/* Mobile header */}
			<div className="flex flex-1 flex-col">
				<header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
					<div className="flex items-center gap-2">
						<IconLink size={20} />
						<span className="font-semibold text-sm">LinkVault</span>
					</div>
					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon" onClick={toggle}>
							{theme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
						</Button>
						<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
							<SheetTrigger>
								{mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
							</SheetTrigger>
							<SheetContent side="left" className="w-56 p-4">
								<div className="flex items-center gap-2 px-3 py-2 mb-4">
									<IconLink size={20} />
									<span className="font-semibold text-sm">LinkVault</span>
								</div>
								<Separator className="mb-4" />
								<div className="flex-1">{navLinks}</div>
								<Separator className="my-4" />
								<Button
									variant="ghost"
									size="sm"
									className="justify-start gap-3 text-muted-foreground w-full"
									onClick={() => {
										setMobileOpen(false);
										logout();
									}}
								>
									<IconLogout size={18} />
									Logout
								</Button>
							</SheetContent>
						</Sheet>
					</div>
				</header>

				{/* Main content */}
				<main className="flex-1 p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
