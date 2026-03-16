import type { CreateLinkInput } from "@link-vault/shared";

export interface Link extends CreateLinkInput {
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface LinksResponse {
	links: Link[];
	total: number;
	page: number;
	totalPages: number;
}

export interface LinksQuery {
	search?: string;
	tags?: string;
	category?: string;
	isFavorite?: boolean;
	page?: number;
	limit?: number;
}
