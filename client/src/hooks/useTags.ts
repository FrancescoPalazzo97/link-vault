import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTags() {
	return useQuery({
		queryKey: ["tags"],
		queryFn: () => api.get<string[]>("/links/tags"),
		staleTime: 1000 * 60 * 10,
	});
}
