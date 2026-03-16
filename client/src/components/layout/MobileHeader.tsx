import { IconMenu2, IconX } from "@tabler/icons-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUiStore } from "@/stores/uiStore";
import { Logo } from "./Logo";
import { SidebarContent } from "./SidebarContent";

export function MobileHeader() {
	const mobileOpen = useUiStore((s) => s.mobileOpen);
	const setMobileOpen = useUiStore((s) => s.setMobileOpen);

	return (
		<header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
			<div className="flex items-center gap-2">
				<Logo />
			</div>
			<div className="flex items-center gap-1">
				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetTrigger>{mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}</SheetTrigger>
					<SheetContent side="left" className="w-56 p-4">
						<SidebarContent onNavigate={() => setMobileOpen(false)} />
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
