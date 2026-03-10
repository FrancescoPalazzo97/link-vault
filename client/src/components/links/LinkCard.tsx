import { IconExternalLink, IconStar, IconTag } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Link } from "@/lib/types";

interface Props {
	link: Link;
	onClick: () => void;
}

export function LinkCard({ link, onClick }: Props) {
	return (
		<Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
			{link.image && (
				<img
					src={link.image}
					alt={link.title ?? link.url}
					className="h-36 w-full rounded-t-lg object-cover"
				/>
			)}
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<p className="font-medium text-sm leading-snug line-clamp-2">
							{link.title ?? link.url}
						</p>
						<p className="text-muted-foreground text-xs mt-1 truncate">
							{link.domain ?? new URL(link.url).hostname}
						</p>
					</div>
					<div className="flex shrink-0 gap-1">
						{link.isFavorite && <IconStar size={16} className="text-yellow-500 fill-yellow-500" />}
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => e.stopPropagation()}
						>
							<IconExternalLink size={16} className="text-muted-foreground hover:text-foreground" />
						</a>
					</div>
				</div>
			</CardHeader>
			{(link.tags.length > 0 || link.category) && (
				<CardContent className="pt-0">
					<div className="flex flex-wrap gap-1">
						{link.category && (
							<Badge variant="secondary" className="text-xs">
								{link.category}
							</Badge>
						)}
						{link.tags.map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs gap-1">
								<IconTag size={10} />
								{tag}
							</Badge>
						))}
					</div>
				</CardContent>
			)}
		</Card>
	);
}
