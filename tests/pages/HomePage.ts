import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly section: Locator;

  constructor(public readonly page: Page, sectionName: string) {
    this.section = page.getByRole('link', { name: sectionName });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }
}
