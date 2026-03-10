import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface Props {
	page: number;
	totalPages: number;
	onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2">
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
			>
				<IconChevronLeft size={16} />
			</Button>
			<span className="text-sm text-muted-foreground">
				{page} / {totalPages}
			</span>
			<Button
				variant="outline"
				size="icon"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages}
			>
				<IconChevronRight size={16} />
			</Button>
		</div>
	);
}
