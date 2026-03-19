import ogs from "open-graph-scraper";

export interface PreviewData {
	title?: string;
	description?: string;
	image?: string;
}

const YOUTUBE_HOSTS = [
	"www.youtube.com",
	"youtube.com",
	"youtu.be",
	"m.youtube.com",
	"music.youtube.com",
];

const EMBED_PATH_RE = /^\/embed\/([^/]+)/;

function resolveYouTubeUrl(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (!YOUTUBE_HOSTS.includes(parsed.hostname)) return null;
		const embedMatch = parsed.pathname.match(EMBED_PATH_RE);
		if (embedMatch) {
			return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
		}
		return url;
	} catch {
		return null;
	}
}

async function fetchYouTubePreview(youtubeUrl: string): Promise<PreviewData | null> {
	try {
		const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
		const response = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000) });
		if (!response.ok) return null;
		const data = (await response.json()) as {
			title?: string;
			thumbnail_url?: string;
			author_name?: string;
		};
		return {
			title: data.title,
			description: data.author_name ? `Video by ${data.author_name}` : undefined,
			image: data.thumbnail_url,
		};
	} catch {
		return null;
	}
}

export const previewService = {
	async fetch(url: string): Promise<PreviewData> {
		try {
			const youtubeUrl = resolveYouTubeUrl(url);
			if (youtubeUrl) {
				const preview = await fetchYouTubePreview(youtubeUrl);
				if (preview) return preview;
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
