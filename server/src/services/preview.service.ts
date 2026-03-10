import ogs from "open-graph-scraper";

export interface PreviewData {
	title?: string;
	description?: string;
	image?: string;
}

export const previewService = {
	async fetch(url: string): Promise<PreviewData> {
		try {
			const { result } = await ogs({ url, timeout: 5000 });

			return {
				title: result.ogTitle,
				description: result.ogDescription,
				image: result.ogImage?.[0]?.url,
			};
		} catch {
			return {};
		}
	},
};
