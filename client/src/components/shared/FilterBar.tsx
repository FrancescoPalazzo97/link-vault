import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useTags } from "@/hooks/useTags";

interface Props {
	selectedTag: string;
	selectedCategory: string;
	onTagChange: (v: string) => void;
	onCategoryChange: (v: string) => void;
}

const ALL = "__all__";

export function FilterBar({ selectedTag, selectedCategory, onTagChange, onCategoryChange }: Props) {
	const { data: tags = [] } = useTags();
	const { data: categories = [] } = useCategories();

	return (
		<div className="flex gap-2 flex-wrap">
			<Select
				value={selectedTag || ALL}
				onValueChange={(v) => onTagChange(v === ALL || !v ? "" : v)}
			>
				<SelectTrigger className="w-40">
					<SelectValue placeholder="All tags" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>All tags</SelectItem>
					{tags.map((tag) => (
						<SelectItem key={tag} value={tag}>
							{tag}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={selectedCategory || ALL}
				onValueChange={(v) => onTagChange(v === ALL || !v ? "" : v)}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="All categories" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>All categories</SelectItem>
					{categories.map((cat) => (
						<SelectItem key={cat} value={cat}>
							{cat}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
