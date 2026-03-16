import { SidebarContent } from "./SidebarContent";

export function DesktopSidebar() {
	return (
		<aside className="hidden w-56 shrink-0 flex-col border-r p-4 md:flex">
			<SidebarContent />
		</aside>
	);
}
