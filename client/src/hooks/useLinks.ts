import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LinksQuery, LinksResponse } from "@/lib/types";

export function useLinks(query: LinksQuery = {}) {
	const params = new URLSearchParams();
	if (query.search) params.set("search", query.search);
	if (query.tags) params.set("tags", query.tags);
	if (query.category) params.set("category", query.category);
	if (query.page) params.set("page", String(query.page));
	if (query.limit) params.set("limit", String(query.limit));

	const qs = params.toString();

	return useQuery({
		queryKey: ["links", query],
		queryFn: () => api.get<LinksResponse>(`/links${qs ? `?${qs}` : ""}`),
	});
}
