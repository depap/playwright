import { Page, Locator } from '@playwright/test';

export class AddRemovePage {
  readonly pageHeading: Locator;
  readonly add: Locator;
  readonly deletes: Locator;
  readonly deleteAt: Locator;

  constructor(public readonly page: Page, deleteIndex = 0) {
    this.pageHeading = page.getByRole('heading', { name: 'Add/Remove Elements' });
    this.add = page.getByRole('button', { name: 'Add Element' });
    this.deletes = page.locator('#elements button.added-manually');
    this.deleteAt = this.deletes.nth(deleteIndex);
  }

  async open(): Promise<void> {
    await this.page.goto('/add_remove_elements/');
  }
}
