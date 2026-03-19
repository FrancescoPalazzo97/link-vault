import ogs from "open-graph-scraper";

export interface PreviewData {
	title?: string;
	description?: string;
	image?: string;
}

function isYouTubeUrl(url: string): boolean {
	try {
		const { hostname } = new URL(url);
		return ["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"].includes(hostname);
	} catch {
		return false;
	}
}

async function fetchYouTubePreview(url: string): Promise<PreviewData> {
	const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
	const response = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000) });
	if (!response.ok) return {};
	const data = (await response.json()) as {
		title?: string;
		thumbnail_url?: string;
		author_name?: string;
	};
	return {
		title: data.title,
		image: data.thumbnail_url,
	};
}

export const previewService = {
	async fetch(url: string): Promise<PreviewData> {
		try {
			if (isYouTubeUrl(url)) {
				return await fetchYouTubePreview(url);
			}

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
