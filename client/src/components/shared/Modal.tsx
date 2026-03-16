import { useUiStore } from "@/stores/uiStore";
import { LinkForm } from "../links/LinkForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function Modal() {
	const isAddLinkOpen = useUiStore((s) => s.isAddLinkOpen);
	const closeAddLink = useUiStore((s) => s.closeAddLink);

	return (
		<Dialog open={isAddLinkOpen} onOpenChange={(open) => !open && closeAddLink()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Link</DialogTitle>
				</DialogHeader>
				<LinkForm mode="create" onSuccess={closeAddLink} />
			</DialogContent>
		</Dialog>
	);
}
