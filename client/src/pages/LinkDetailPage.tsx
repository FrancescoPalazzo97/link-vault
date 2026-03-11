import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema } from "@link-vault/shared";
import { IconArrowLeft, IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { type Resolver, useController, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";
import { TagInput } from "@/components/shared/TagInput";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLink } from "@/hooks/useLink";
import { useDeleteLink, useUpdateLink } from "@/hooks/useLinkMutations";
import { useTags } from "@/hooks/useTags";

type LinkFormData = z.infer<typeof createLinkSchema>;

export function LinkDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { data: link, isLoading, isError } = useLink(id ?? "");
	const { data: existingTags = [] } = useTags();
	const { mutateAsync: updateLink, isPending: isSaving } = useUpdateLink(id ?? "");
	const { mutateAsync: deleteLink, isPending: isDeleting } = useDeleteLink();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<LinkFormData>({
		resolver: zodResolver(createLinkSchema) as Resolver<LinkFormData>,
	});

	const { field: tagsField } = useController({ name: "tags", control, defaultValue: [] });
	const { field: favField } = useController({ name: "isFavorite", control, defaultValue: false });

	const startEditing = () => {
		if (!link) return;
		reset({
			url: link.url,
			title: link.title,
			description: link.description,
			image: link.image,
			domain: link.domain,
			tags: link.tags,
			category: link.category,
			notes: link.notes,
			isFavorite: link.isFavorite,
		});
		setEditing(true);
	};

	const onSubmit = async (data: LinkFormData) => {
		setError(null);
		try {
			await updateLink(data);
			setEditing(false);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to save changes");
		}
	};

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
		<div className="max-w-2xl space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
					<IconArrowLeft size={16} className="mr-1" />
					Back
				</Button>
				<div className="flex gap-2">
					{!editing && (
						<Button variant="outline" size="sm" onClick={startEditing}>
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="url">URL *</FieldLabel>
							<Input id="url" {...register("url")} />
							{errors.url && <p className="text-destructive text-xs">{errors.url.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor="title">Title</FieldLabel>
							<Input id="title" {...register("title")} />
						</Field>
						<Field>
							<FieldLabel htmlFor="description">Description</FieldLabel>
							<Textarea id="description" {...register("description")} rows={2} />
						</Field>
						<Field>
							<FieldLabel>Tags</FieldLabel>
							<TagInput
								value={tagsField.value ?? []}
								onChange={tagsField.onChange}
								suggestions={existingTags}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="category">Category</FieldLabel>
							<Input id="category" {...register("category")} />
						</Field>
						<Field>
							<FieldLabel htmlFor="notes">Notes</FieldLabel>
							<Textarea id="notes" {...register("notes")} rows={3} />
						</Field>
						<Field>
							<div className="flex items-center gap-3">
								<Switch
									id="isFavorite"
									checked={favField.value ?? false}
									onCheckedChange={favField.onChange}
								/>
								<FieldLabel htmlFor="isFavorite">Favorite</FieldLabel>
							</div>
						</Field>
						<Field>
							<div className="flex gap-2">
								<Button type="submit" disabled={isSaving}>
									{isSaving ? "Saving..." : "Save"}
								</Button>
								<Button type="button" variant="outline" onClick={() => { setError(null); setEditing(false); }}>
									Cancel
								</Button>
							</div>
						</Field>
					</FieldGroup>
				</form>
			)}
		</div>
	);
}
