import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileHeader } from "./MobileHeader";

export function AppLayout() {
	const token = useAuthStore((s) => s.token);

	if (!token) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="flex min-h-screen">
			<DesktopSidebar />
			<div className="flex flex-1 flex-col">
				<MobileHeader />
				<main className="flex-1 p-4 md:p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
