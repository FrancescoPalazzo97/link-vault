import { queryClient } from "./queryClient";
import { useAuthStore } from "../stores/authStore";

const BASE_URL = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const { token, logout } = useAuthStore.getState();

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!res.ok) {
		if (res.status === 401) {
			logout();
			queryClient.clear();
			throw new Error("Unauthorized");
		}
		const body = await res.json().catch(() => ({}));
		throw new Error((body as { error?: string }).error ?? res.statusText);
	}

	if (res.status === 204) {
		return undefined as T;
	}

	return res.json() as Promise<T>;
}

export const api = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "POST", body: JSON.stringify(body) }),
	patch: <T>(path: string, body: unknown) =>
		request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
	del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
