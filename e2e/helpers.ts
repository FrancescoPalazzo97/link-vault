import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const PASSWORD = process.env.E2E_PASSWORD ?? "your-password-here";

export async function loginViaUI(page: Page) {
    await page.goto("/login");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("/");
}

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const res = await request.post("/api/auth/login", {
        data: { password: PASSWORD },
    });
    const body = await res.json();
    return body.token;
}

export async function deleteLinkViaAPI(request: APIRequestContext, token: string, id: string) {
    await request.delete(`/api/links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}
