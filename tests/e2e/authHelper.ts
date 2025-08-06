import { Page } from "@playwright/test";

export async function login(page: Page, username: string, password: string) {
  await page.goto("http://localhost:5173");
  await page.getByTestId("login-button").click();
  await page.getByText("Username or email").waitFor();
  await page.getByLabel("Username or email").fill(username);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL("http://localhost:5173");
}
