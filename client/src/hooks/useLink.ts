import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Link } from "@/lib/types";

export function useLink(id: string) {
	return useQuery({
		queryKey: ["link", id],
		queryFn: () => api.get<Link>(`/links/${id}`),
		enabled: !!id,
	});
}
