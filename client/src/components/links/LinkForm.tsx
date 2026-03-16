import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema } from "@link-vault/shared";
import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { type Resolver, useController, useForm } from "react-hook-form";
import type { z } from "zod";
import { useCreateLink, useUpdateLink } from "@/hooks/useLinkMutations";
import { useTags } from "@/hooks/useTags";
import { api } from "@/lib/api";
import type { Link } from "@/lib/types";
import { TagInput } from "../shared/TagInput";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

type LinkFormData = z.infer<typeof createLinkSchema>;

type LinkFormProps =
	| { mode: "create"; onSuccess: () => void }
	| {
			mode: "edit";
			linkId: string;
			initialData: LinkFormData;
			onSuccess: () => void;
			onCancel: () => void;
	  };

export function LinkForm(props: LinkFormProps) {
	const { mode, onSuccess } = props;
	const { mutateAsync: createLink } = useCreateLink();
	const { mutateAsync: updateLink } = useUpdateLink(mode === "edit" ? props.linkId : "");
	const { data: existingTags = [] } = useTags();
	const [previewLoading, setPreviewLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		control,
		formState: { errors, isSubmitting },
	} = useForm<LinkFormData>({
		resolver: zodResolver(createLinkSchema) as Resolver<LinkFormData>,
		defaultValues: mode === "create" ? { url: "", tags: [], isFavorite: false } : props.initialData,
	});

	const { field: tagsField } = useController({ name: "tags", control, defaultValue: [] });
	const { field: favField } = useController({ name: "isFavorite", control, defaultValue: false });

	const url = watch("url");

	useEffect(() => {
		if (mode !== "create") return;
		if (!url) return;
		let valid = false;
		try {
			new URL(url);
			valid = true;
		} catch {
			// invalid url
		}
		if (!valid) return;

		const t = setTimeout(async () => {
			setPreviewLoading(true);
			try {
				const preview = await api.post<Partial<Link>>("/links/preview", { url });
				if (preview.title && !getValues("title")) {
					setValue("title", preview.title);
				}
				if (preview.description && !getValues("description")) {
					setValue("description", preview.description);
				}
				if (preview.image && !getValues("image")) {
					setValue("image", preview.image);
				}
				if (preview.domain && !getValues("domain")) {
					setValue("domain", preview.domain);
				}
			} catch {
				// Silent fail
			} finally {
				setPreviewLoading(false);
			}
		}, 800);
		return () => clearTimeout(t);
	}, [url, mode, setValue, getValues]);

	async function onSubmit(data: LinkFormData) {
		setError(null);
		try {
			if (mode === "create") {
				await createLink(data);
			} else {
				await updateLink(data);
			}
			onSuccess();
		} catch (e) {
			setError(
				e instanceof Error ? e.message : `Failed to save ${mode === "create" ? "link" : "changes"}`
			);
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field>
					<div className="flex items-center gap-2">
						<FieldLabel htmlFor="url">URL *</FieldLabel>
						{mode === "create" && previewLoading && (
							<IconLoader size={14} className="animate-spin text-muted-foreground" />
						)}
					</div>
					<Input
						id="url"
						{...register("url")}
						placeholder={mode === "create" ? "https://..." : undefined}
					/>
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
					<Input
						id="category"
						{...register("category")}
						placeholder={mode === "create" ? "e.g. dev, design..." : undefined}
					/>
				</Field>

				<Field>
					<FieldLabel htmlFor="notes">Notes</FieldLabel>
					<Textarea id="notes" {...register("notes")} rows={mode === "create" ? 2 : 3} />
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
					{error && <p className="text-destructive text-xs mb-2">{error}</p>}
					{mode === "create" ? (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : "Save Link"}
						</Button>
					) : (
						<div className="flex gap-2">
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : "Save"}
							</Button>
							<Button type="button" variant="outline" onClick={props.onCancel}>
								Cancel
							</Button>
						</div>
					)}
				</Field>
			</FieldGroup>
		</form>
	);
}
