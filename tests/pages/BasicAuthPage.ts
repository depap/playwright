import { Page, Locator } from '@playwright/test';

export class BasicAuthPage {
  readonly pageHeading: Locator;
  readonly congrats: Locator;
  readonly elemental: Locator;
  readonly sauceLabs: Locator;

  constructor(public readonly page: Page) {
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
}
