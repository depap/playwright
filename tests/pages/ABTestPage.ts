import { Page, Locator } from '@playwright/test';

export class ABTestPage {
  readonly pageHeading: Locator;
  readonly elemental: Locator;

  constructor(public readonly page: Page) {
    // A/B-split heading: "A/B Test" or "No A/B Test" — both contain "A/B Test"
    this.pageHeading = page.locator('h3');
    this.elemental = page.getByRole('link', { name: 'Elemental Selenium' });
  }

  async open(): Promise<void> {
    await this.page.goto('/abtest');
  }
}
