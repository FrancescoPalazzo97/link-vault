import { expect, test } from "@playwright/test";

const PASSWORD = process.env.E2E_PASSWORD ?? "your-password-here";

let token: string;
let createdLinkIds: string[] = [];

test.beforeAll(async ({ request }) => {
    const res = await request.post("/api/auth/login", {
        data: { password: PASSWORD },
    });
    const body = await res.json();
    token = body.token;
});

test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("/");
});

test.afterEach(async ({ request }) => {
    for (const id of createdLinkIds) {
        await request.delete(`/api/links/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    createdLinkIds = [];
});

test("aggiunge un link e compare nella lista", async ({ page }) => {
    const responsePromise = page.waitForResponse(
        (r) => r.url().includes("/api/links") && r.request().method() === "POST" && r.status() === 201
    );
    await page.getByRole("button", { name: "Add Link" }).click();
    await page.getByLabel("URL").fill("https://example.com");
    await page.getByRole("button", { name: "Save Link" }).click();
    const response = await responsePromise;
    const body = await response.json();
    createdLinkIds.push(body._id);
    await expect(page.getByText("example.com", { exact: true })).toBeVisible();
});

test("ricerca filtra i link", async ({ page, request }) => {
    // Create a link via API for this test
    const res = await request.post("/api/links", {
        data: { url: "https://search-test-unique.com" },
        headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.ok()).toBeTruthy();
    const link = await res.json();
    createdLinkIds.push(link._id);

    await page.reload();
    // Wait for dashboard to fully load with link data
    await expect(page.getByText("search-test-unique.com", { exact: true })).toBeVisible({ timeout: 10_000 });

    // Now search and verify results are filtered
    const searchInput = page.getByPlaceholder("Search links...");
    const searchResponse = page.waitForResponse((r) =>
        r.url().includes("/api/links") && r.url().includes("search=") && r.request().method() === "GET"
    );
    await searchInput.pressSequentially("search-test", { delay: 50 });
    await searchResponse;
    await expect(page.getByText("search-test-unique.com", { exact: true })).toBeVisible();
});

test("logout reindirizza al login", async ({ page }) => {
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/login");
});