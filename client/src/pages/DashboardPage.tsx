import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { LinkCard } from "@/components/links/LinkCard";
import { Modal } from "@/components/shared/Modal";
import { Pagination } from "@/components/shared/Pagination";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useLinks } from "@/hooks/useLinks";
import { useTags } from "@/hooks/useTags";
import { useFiltersStore } from "@/stores/filtersStore";
import { useUiStore } from "@/stores/uiStore";

const LIMIT = 12;

export function DashboardPage() {
	const openAddLink = useUiStore((s) => s.openAddLink);
	const navigate = useNavigate();

	const search = useFiltersStore((s) => s.search);
	const setSearch = useFiltersStore((s) => s.setSearch);
	const selectedTag = useFiltersStore((s) => s.selectedTag);
	const setSelectedTag = useFiltersStore((s) => s.setSelectedTag);
	const selectedCategory = useFiltersStore((s) => s.selectedCategory);
	const isFavorite = useFiltersStore((s) => s.isFavorite);
	const page = useFiltersStore((s) => s.page);
	const setPage = useFiltersStore((s) => s.setPage);

	const debouncedSearch = useDebounce(search);
	const { data: tags = [] } = useTags();

	const { data, isLoading, isError } = useLinks({
		search: debouncedSearch || undefined,
		tags: selectedTag || undefined,
		category: selectedCategory || undefined,
		isFavorite: isFavorite || undefined,
		page,
		limit: LIMIT,
	});

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Links</h1>
				<Button size="sm" onClick={openAddLink}>
					<IconPlus size={16} className="mr-1" />
					Add Link
				</Button>
			</div>

			{/* Search + Tag filter */}
			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="flex-1">
					<SearchBar value={search} onChange={setSearch} />
				</div>
				<Select
					value={selectedTag || "__all__"}
					onValueChange={(v) => v && setSelectedTag(v === "__all__" ? "" : v)}
				>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="All tags" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="__all__">All tags</SelectItem>
						{tags.map((tag) => (
							<SelectItem key={tag} value={tag}>
								{tag}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Content */}
			{isLoading && (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{["a", "b", "c", "d", "e", "f"].map((k) => (
						<Skeleton key={k} className="h-40 rounded-lg" />
					))}
				</div>
			)}

			{isError && <p className="text-destructive text-sm">Failed to load links.</p>}

			{data && data.links.length === 0 && (
				<p className="text-muted-foreground text-sm text-center py-12">No links found.</p>
			)}

			{data && data.links.length > 0 && (
				<>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{data.links.map((link) => (
							<LinkCard key={link._id} link={link} onClick={() => navigate(`/links/${link._id}`)} />
						))}
					</div>
					<Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
				</>
			)}

			<Modal />
		</div>
	);
}
