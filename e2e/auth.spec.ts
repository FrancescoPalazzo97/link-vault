import { expect, test } from "@playwright/test";
import { PASSWORD } from "./helpers";

test("login con password errata mostra errore", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText(/Unauthorized/i)).toBeVisible();
});

test("login con password corretta porta alla dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Links" })).toBeVisible();
});

test("utente non autenticato viene reindirizzato al login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
});
