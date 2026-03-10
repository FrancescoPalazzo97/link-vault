import { IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

interface Props {
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search links..." }: Props) {
	return (
		<div className="relative">
			<IconSearch
				size={16}
				className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
			/>
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="pl-9 pr-9"
			/>
			{value && (
				<button
					type="button"
					onClick={() => onChange("")}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<IconX size={16} />
				</button>
			)}
		</div>
	);
}
