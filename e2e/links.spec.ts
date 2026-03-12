import { expect, test } from "@playwright/test";
import { deleteLinkViaAPI, getAuthToken, loginViaUI } from "./helpers";

const TEST_DOMAIN = "linkvault-e2e-test.com";
const TEST_URL = `https://${TEST_DOMAIN}`;
const EDITED_TITLE = "E2E Edited Title";
const EDITED_NOTES = "E2E test notes";
const EDITED_TAG = "e2e-tag";

let token: string;
let createdLinkId: string;

test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
});

test.beforeEach(async ({ page }) => {
    await loginViaUI(page);
});

test.afterAll(async ({ request }) => {
    if (createdLinkId) {
        await deleteLinkViaAPI(request, token, createdLinkId);
    }
});

test("aggiunge un link e compare nella lista", async ({ page }) => {
    const responsePromise = page.waitForResponse(
        (r) => r.url().includes("/api/links") && r.request().method() === "POST" && r.status() === 201
    );
    await page.getByRole("button", { name: "Add Link" }).click();
    await page.getByLabel("URL").fill(TEST_URL);
    await page.getByRole("button", { name: "Save Link" }).click();
    const response = await responsePromise;
    const body = await response.json();
    createdLinkId = body._id;
    await expect(page.getByText(TEST_DOMAIN, { exact: true })).toBeVisible();
});

test("ricerca filtra i link", async ({ page }) => {
    await expect(page.getByText(TEST_DOMAIN, { exact: true })).toBeVisible({ timeout: 10_000 });

    const searchInput = page.getByPlaceholder("Search links...");
    const searchResponse = page.waitForResponse((r) =>
        r.url().includes("/api/links") && r.url().includes("search=") && r.request().method() === "GET"
    );
    await searchInput.pressSequentially("linkvault-e2e", { delay: 50 });
    await searchResponse;
    await expect(page.getByText(TEST_DOMAIN, { exact: true })).toBeVisible();
});

test("modifica un link dalla pagina dettaglio", async ({ page }) => {
    await expect(page.getByText(TEST_DOMAIN, { exact: true })).toBeVisible({ timeout: 10_000 });
    await page.getByText(TEST_DOMAIN, { exact: true }).click();
    await expect(page).toHaveURL(/\/links\//);

    await page.getByRole("button", { name: "Edit" }).click();

    const titleInput = page.getByLabel("Title");
    await titleInput.clear();
    await titleInput.fill(EDITED_TITLE);

    const notesInput = page.getByLabel("Notes");
    await notesInput.clear();
    await notesInput.fill(EDITED_NOTES);

    const tagInput = page.getByPlaceholder("Add tag, press Enter");
    await tagInput.fill(EDITED_TAG);
    await tagInput.press("Enter");

    const patchResponse = page.waitForResponse(
        (r) => r.url().includes("/api/links/") && r.request().method() === "PATCH" && r.status() === 200
    );
    await page.getByRole("button", { name: "Save" }).click();
    await patchResponse;

    await expect(page.getByText(EDITED_TITLE)).toBeVisible();
    await expect(page.getByText(EDITED_NOTES)).toBeVisible();
    await expect(page.getByText(EDITED_TAG)).toBeVisible();
});

test("elimina un link dalla pagina dettaglio", async ({ page }) => {
    await expect(page.getByText(EDITED_TITLE)).toBeVisible({ timeout: 10_000 });
    await page.getByText(EDITED_TITLE).click();
    await expect(page).toHaveURL(/\/links\//);

    await page.getByRole("button", { name: "Delete" }).first().click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText(EDITED_TITLE)).not.toBeVisible();
    createdLinkId = "";
});

test("logout reindirizza al login", async ({ page }) => {
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/login");
});
