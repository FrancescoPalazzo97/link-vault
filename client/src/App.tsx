import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { LinkDetailPage } from "@/pages/LinkDetailPage";
import { LoginPage } from "@/pages/LoginPage";

export default function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route element={<AppLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path="/links/:id" element={<LinkDetailPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
