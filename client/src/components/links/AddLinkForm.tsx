import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema } from "@link-vault/shared";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { z } from "zod";
import { TagInput } from "@/components/shared/TagInput";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLink } from "@/hooks/useLinkMutations";
import { useTags } from "@/hooks/useTags";
import { api } from "@/lib/api";
import type { Link } from "@/lib/types";

type LinkFormData = z.infer<typeof createLinkSchema>;

interface Props {
	onSuccess: () => void;
}

export function AddLinkForm({ onSuccess }: Props) {
	const { mutateAsync: createLink } = useCreateLink();
	const { data: existingTags = [] } = useTags();
	const [previewLoading, setPreviewLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors, isSubmitting },
	} = useForm<LinkFormData>({
		resolver: zodResolver(createLinkSchema) as Resolver<LinkFormData>,
		defaultValues: { url: "", tags: [], isFavorite: false },
	});

	const url = watch("url");

	useEffect(() => {
		if (!url) return;
		let valid = false;
		try {
			new URL(url);
			valid = true;
		} catch {
			/* invalid url */
		}
		if (!valid) return;

		const t = setTimeout(async () => {
			setPreviewLoading(true);
			try {
				const preview = await api.post<Partial<Link>>("/links/preview", { url });
				if (preview.title && !getValues("title")) setValue("title", preview.title);
				if (preview.description && !getValues("description"))
					setValue("description", preview.description);
				if (preview.image && !getValues("image")) setValue("image", preview.image);
				if (preview.domain && !getValues("domain")) setValue("domain", preview.domain);
			} catch {
				/* silently fail */
			} finally {
				setPreviewLoading(false);
			}
		}, 800);
		return () => clearTimeout(t);
	}, [url, setValue, getValues]);

	const onSubmit = async (data: LinkFormData) => {
		await createLink(data);
		onSuccess();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field>
					<div className="flex items-center gap-2">
						<FieldLabel htmlFor="url">URL *</FieldLabel>
						{previewLoading && (
							<IconLoader size={14} className="animate-spin text-muted-foreground" />
						)}
					</div>
					<Input id="url" {...register("url")} placeholder="https://..." />
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
						value={watch("tags")}
						onChange={(tags) => setValue("tags", tags)}
						suggestions={existingTags}
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="category">Category</FieldLabel>
					<Input id="category" {...register("category")} placeholder="e.g. dev, design..." />
				</Field>

				<Field>
					<FieldLabel htmlFor="notes">Notes</FieldLabel>
					<Textarea id="notes" {...register("notes")} rows={2} />
				</Field>

				<Field>
					<div className="flex items-center gap-3">
						<Switch
							id="isFavorite"
							checked={watch("isFavorite")}
							onCheckedChange={(v) => setValue("isFavorite", v)}
						/>
						<FieldLabel htmlFor="isFavorite">Favorite</FieldLabel>
					</div>
				</Field>

				<Field>
					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : "Save Link"}
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
