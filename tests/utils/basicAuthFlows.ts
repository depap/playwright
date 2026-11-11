import { expect } from '@playwright/test';
import { BasicAuthPage } from '../pages/BasicAuthPage';

export async function basicAuthPageIsLoaded(auth: BasicAuthPage): Promise<void> {
  await expect(auth.page).toHaveURL(/\/basic_auth/);
  await expect(auth.pageHeading).toBeVisible();
  await expect(auth.pageHeading).toHaveText('Basic Auth');
  await expect(auth.congrats).toContainText('Congratulations! You must have the proper credentials.');
}

export async function basicAuthFooterLinksPresent(auth: BasicAuthPage): Promise<void> {
  await expect(auth.elemental).toBeVisible();
  await expect(auth.sauceLabs).toBeVisible();
}

export async function elementalSeleniumOpensInNewTab(auth: BasicAuthPage): Promise<void> {
  const [popup] = await Promise.all([
    auth.page.waitForEvent('popup'),
    auth.elemental.click(),
  ]);
  await expect(popup).toHaveURL(/elementalselenium\.com/);
  await popup.close();
}

export async function basicAuthRejectsWrongCredentials(auth: BasicAuthPage): Promise<void> {
  await auth.open();
  await expect(auth.pageHeading).not.toBeVisible();
  await expect(auth.congrats).not.toBeVisible();
}
