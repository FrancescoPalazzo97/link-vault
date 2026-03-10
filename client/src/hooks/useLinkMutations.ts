import type { CreateLinkInput, UpdateLinkInput } from "@link-vault/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Link } from "@/lib/types";

export function useCreateLink() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateLinkInput) => api.post<Link>("/links", data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["links"] });
			qc.invalidateQueries({ queryKey: ["tags"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

export function useUpdateLink(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: UpdateLinkInput) => api.patch<Link>(`/links/${id}`, data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["links"] });
			qc.invalidateQueries({ queryKey: ["link", id] });
			qc.invalidateQueries({ queryKey: ["tags"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}

export function useDeleteLink() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => api.del<void>(`/links/${id}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["links"] });
			qc.invalidateQueries({ queryKey: ["tags"] });
			qc.invalidateQueries({ queryKey: ["categories"] });
		},
	});
}
