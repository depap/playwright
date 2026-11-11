import { expect, Page, Locator } from '@playwright/test';
import { linkOpensInNewTab } from '../utils/shared';

export class ABTestPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly elemental: Locator;

  constructor(page: Page) {
    this.page = page;
    // A/B-split heading: "A/B Test" or "No A/B Test" — both contain "A/B Test"
    this.pageHeading = page.locator('h3');
    this.elemental = page.getByRole('link', { name: 'Elemental Selenium' });
  }

  async open(): Promise<void> {
    await this.page.goto('/abtest');
  }

  async isLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/abtest/);
    await expect(this.pageHeading).toContainText('A/B Test');
    await expect(this.elemental).toBeVisible();
  }

  async elementalSeleniumOpensInNewTab(): Promise<void> {
    await linkOpensInNewTab(this.page, this.elemental, /elementalselenium\.com/);
  }
}
