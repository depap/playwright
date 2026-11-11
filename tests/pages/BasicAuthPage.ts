import { expect, Page, Locator } from '@playwright/test';
import { linkOpensInNewTab } from '../utils/shared';

export class BasicAuthPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly congrats: Locator;
  readonly elemental: Locator;
  readonly sauceLabs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Basic Auth' });
    this.congrats = page.locator('p');
    this.elemental = page.getByRole('link', { name: 'Elemental Selenium' });
    this.sauceLabs = page.getByRole('link', { name: 'Sauce Labs' });
  }

  async open(): Promise<void> {
    await this.page.goto('/basic_auth');
  }

  async openWithCredentials(username: string, password: string): Promise<void> {
    await this.page.goto(`https://${username}:${password}@the-internet.herokuapp.com/basic_auth`);
  }

  async isLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/basic_auth/);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.pageHeading).toHaveText('Basic Auth');
    await expect(this.congrats).toContainText('Congratulations! You must have the proper credentials.');
  }

  async footerLinksPresent(): Promise<void> {
    await expect(this.elemental).toBeVisible();
    await expect(this.sauceLabs).toBeVisible();
  }

  async elementalSeleniumOpensInNewTab(): Promise<void> {
    await linkOpensInNewTab(this.page, this.elemental, /elementalselenium\.com/);
  }

  async rejectsWrongCredentials(): Promise<void> {
    await expect(this.pageHeading).not.toBeVisible();
    await expect(this.congrats).not.toBeVisible();
  }
}
