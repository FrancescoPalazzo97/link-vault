import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinkForm } from "@/components/links/LinkForm";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLink } from "@/hooks/useLink";
import { useDeleteLink } from "@/hooks/useLinkMutations";

export function LinkDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data: link, isLoading, isError } = useLink(id ?? "");
	const { mutateAsync: deleteLink, isPending: isDeleting } = useDeleteLink();

	const handleDelete = async () => {
		setError(null);
		try {
			await deleteLink(id ?? "");
			navigate("/");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to delete link");
		}
	};

	if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
	if (isError || !link) return <p className="text-destructive text-sm">Link not found.</p>;

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					<IconArrowLeft size={16} className="mr-1" />
					Back
				</Button>
				<div className="flex gap-2">
					{!editing && (
						<Button variant="outline" size="sm" onClick={() => setEditing(true)}>
							<IconPencil size={16} className="mr-1" />
							Edit
						</Button>
					)}
					<AlertDialog>
						<AlertDialogTrigger>
							<Button variant="destructive" size="sm" disabled={isDeleting}>
								<IconTrash size={16} className="mr-1" />
								Delete
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete link?</AlertDialogTitle>
								<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{error && <p className="text-destructive text-sm">{error}</p>}

			{/* View mode */}
			{!editing && (
				<div className="space-y-4">
					{link.image && (
						<img
							src={link.image}
							alt={link.title ?? link.url}
							className="w-full rounded-lg object-cover max-h-64"
						/>
					)}
					<div>
						<h1 className="text-xl font-semibold">{link.title ?? link.url}</h1>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-muted-foreground hover:underline break-all"
						>
							{link.url}
						</a>
					</div>
					{link.description && <p className="text-sm text-muted-foreground">{link.description}</p>}
					{link.notes && (
						<div>
							<p className="text-xs font-medium uppercase text-muted-foreground mb-1">Notes</p>
							<p className="text-sm">{link.notes}</p>
						</div>
					)}
					<div className="flex flex-wrap gap-1">
						{link.category && <Badge variant="secondary">{link.category}</Badge>}
						{link.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
						{link.isFavorite && <Badge variant="secondary">★ Favorite</Badge>}
					</div>
				</div>
			)}

			{/* Edit mode */}
			{editing && (
				<LinkForm
					mode="edit"
					linkId={id ?? ""}
					initialData={{
						url: link.url,
						title: link.title,
						description: link.description,
						image: link.image,
						domain: link.domain,
						tags: link.tags,
						category: link.category,
						notes: link.notes,
						isFavorite: link.isFavorite,
					}}
					onSuccess={() => setEditing(false)}
					onCancel={() => {
						setError(null);
						setEditing(false);
					}}
				/>
			)}
		</div>
	);
}
