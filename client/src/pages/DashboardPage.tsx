import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddLinkForm } from "@/components/links/AddLinkForm";
import { LinkCard } from "@/components/links/LinkCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Pagination } from "@/components/shared/Pagination";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useLinks } from "@/hooks/useLinks";
import { useUiStore } from "@/stores/uiStore";

const LIMIT = 12;

export function DashboardPage() {
	const isAddLinkOpen = useUiStore((s) => s.isAddLinkOpen);
	const closeAddLink = useUiStore((s) => s.closeAddLink);
	const navigate = useNavigate();
	const openAddLink = useUiStore((s) => s.openAddLink);

	const [search, setSearch] = useState("");
	const [selectedTag, setSelectedTag] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [page, setPage] = useState(1);

	const debouncedSearch = useDebounce(search);

	const { data, isLoading, isError } = useLinks({
		search: debouncedSearch || undefined,
		tags: selectedTag || undefined,
		category: selectedCategory || undefined,
		page,
		limit: LIMIT,
	});

	const resetPage = () => setPage(1);

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

			{/* Search + Filters */}
			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="flex-1">
					<SearchBar
						value={search}
						onChange={(v) => {
							setSearch(v);
							resetPage();
						}}
					/>
				</div>
				<FilterBar
					selectedTag={selectedTag}
					selectedCategory={selectedCategory}
					onTagChange={(v) => {
						setSelectedTag(v);
						resetPage();
					}}
					onCategoryChange={(v) => {
						setSelectedCategory(v);
						resetPage();
					}}
				/>
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

			<Dialog open={isAddLinkOpen} onOpenChange={(open) => !open && closeAddLink()}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Link</DialogTitle>
					</DialogHeader>
					<AddLinkForm onSuccess={closeAddLink} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
