import { test, expect, type Page } from "@playwright/test"

const TEST_KEYCLOAK_USERNAME = "asd";
const TEST_KEYCLOAK_PASSWORD = "asd";

test("Basic auth", async ({ page, browser }) => {
  await test.step("should login", async () => {
    await page.goto("http://localhost:5173")
    await page.getByTestId("login-button").click();

    //await page.getByText("Keycloak").click()
    await page.getByText("Username or email").waitFor()
    await page
      .getByLabel("Username or email")
      .fill(TEST_KEYCLOAK_USERNAME)
    await page.locator("#password").fill(TEST_KEYCLOAK_PASSWORD)
    await page.getByRole("button", { name: "Sign In" }).click()
    await page.waitForURL("http://localhost:5173")
 
    expect(page.url()).toBe("http://localhost:5173/");

    //const session = await page.locator("pre").textContent()
 //
    //expect(JSON.parse(session ?? "{}")).toEqual({
    //  user: {
    //    email: "bob@alice.com",
    //    name: "Bob Alice",
    //    image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
    //  },
    //  expires: expect.any(String),
    //})
  })
 
  //await test.step("should logout", async () => {
  //  await page.getByText("Sign out").click()
  //  await page
  //    .locator("header")
  //    .getByRole("button", { name: "Sign in", exact: true })
  //    .waitFor()
  //  await page.goto("http://localhost:3000/auth/session")
 //
  //  expect(await page.locator("html").textContent()).toBe("null")
  //})
})