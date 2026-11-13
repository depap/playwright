import { test as setup, expect } from '@playwright/test';

// Runs once before the browser projects (see the "setup" project in
// playwright.config.ts). Logs in via the UI and saves cookies/localStorage
// so every test starts already authenticated.
setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area')).toBeVisible();
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
