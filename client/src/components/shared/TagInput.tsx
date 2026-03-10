import { IconTag, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Props {
	value: string[];
	onChange: (tags: string[]) => void;
	suggestions?: string[];
}

export function TagInput({ value, onChange, suggestions = [] }: Props) {
	const [input, setInput] = useState("");

	const addTag = (tag: string) => {
		const t = tag.trim().toLowerCase();
		if (t && !value.includes(t)) onChange([...value, t]);
		setInput("");
	};

	const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

	const filtered = suggestions.filter((s) => s.includes(input.toLowerCase()) && !value.includes(s));

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-1">
				{value.map((tag) => (
					<Badge key={tag} variant="secondary" className="gap-1">
						<IconTag size={10} />
						{tag}
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="ml-1 hover:text-destructive"
						>
							<IconX size={10} />
						</button>
					</Badge>
				))}
			</div>
			<div className="relative">
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === ",") {
							e.preventDefault();
							addTag(input);
						}
					}}
					placeholder="Add tag, press Enter"
				/>
				{input && filtered.length > 0 && (
					<div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
						{filtered.slice(0, 5).map((s) => (
							<button
								key={s}
								type="button"
								onClick={() => addTag(s)}
								className="w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
							>
								{s}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
