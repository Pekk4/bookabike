import { test, expect } from "@playwright/test";
import { login } from "../authHelper";

const TEST_KEYCLOAK_USERNAME = "asd";
const TEST_KEYCLOAK_PASSWORD = "asd";

const getStartDateString = (formatted: boolean = false) => {
  const today = new Date();

  if (!formatted) return today.toLocaleDateString('fi-FI');

  return today.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }); // e.g. "2. elokuuta 2025"
}
const getEndDateString = (daysAhead: number, formatted: boolean = false) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  if (!formatted) return date.toLocaleDateString('fi-FI');

  return date.toLocaleDateString('fi-FI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

test.describe("Calendar booking flows", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_KEYCLOAK_USERNAME, TEST_KEYCLOAK_PASSWORD);
    await page.goto("http://localhost:5173/calendar");
  });

  test("allows 4-day booking", async ({ page }) => {
    await test.step("should display calendar booking prompt after login", async () => {
      await page.goto("http://localhost:5173/calendar");
      await expect(page.getByText("Aloita varauksen tekeminen valitsemalla kalenterista vapaa aloituspäivä")).toBeVisible();
    });

    await test.step("should allow selecting a start date for booking", async () => {
      const todayLabel = getStartDateString(true);

      await page.getByRole('button', { name: todayLabel })
        .filter({ hasNot: page.locator('[disabled]') })
        .filter({ has: page.locator('abbr[aria-label="' + todayLabel + '"]') })
        .first()
        .click();

      await expect(page.locator('button.start-date')).toBeVisible();
      await expect(page.locator('button.end-date')).not.toBeVisible();
    });

    await test.step("should allow selecting a start date for booking", async () => {
      const endDateLabel = getEndDateString(3, true);

      await page.getByRole('button', { name: endDateLabel })
        .filter({ hasNot: page.locator('[disabled]') })
        .filter({ has: page.locator('abbr[aria-label="' + endDateLabel + '"]') })
        .first()
        .click();

      await expect(page.locator('button.end-date')).toBeVisible();
    });

    await test.step("should show booking confirmation modal with correct dates", async () => {
      const todayLabel = getStartDateString(true);
      const endDateLabel = getEndDateString(3, true);

      await expect(page.getByText(`Varataanko: ${getStartDateString()} - ${getEndDateString(3)}?`)).toBeVisible();
    });

    await test.step("should confirm booking and display success message", async () => {
      await page.getByRole('button', { name: 'Kyllä' }).first().click();

      await expect(page.getByText("Varaus onnistui!")).toBeVisible();
    });

    await test.step("should redirect to 'My Bookings' page after confirming booking", async () => {
      await page.getByRole('button', { name: 'OK' }).first().click();
      await page.waitForURL("http://localhost:5173/my-bookings");

      await expect(page).toHaveURL("http://localhost:5173/my-bookings");
      // There should be one result row with the status "pending"
      await expect(page.getByText("Odottaa")).toBeVisible();
    });
  });
});
