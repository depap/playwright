import { expect, Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly section: Locator;

  constructor(page: Page, sectionName: string) {
    this.page = page;
    this.section = page.getByRole('link', { name: sectionName });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async openSection(expectedPath: string): Promise<void> {
    await expect(this.section).toBeVisible();
    await this.section.click();
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }
}
