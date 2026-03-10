import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => api.get<string[]>("/links/categories"),
		staleTime: 1000 * 60 * 10,
	});
}
