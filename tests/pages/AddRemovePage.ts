import { expect, Page, Locator } from '@playwright/test';

export class AddRemovePage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly add: Locator;
  readonly deletes: Locator;
  readonly deleteAt: Locator;

  constructor(page: Page, deleteIndex = 0) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: 'Add/Remove Elements' });
    this.add = page.getByRole('button', { name: 'Add Element' });
    this.deletes = page.locator('#elements button.added-manually');
    this.deleteAt = this.deletes.nth(deleteIndex);
  }

  async open(): Promise<void> {
    await this.page.goto('/add_remove_elements/');
  }

  async isLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/add_remove_elements\//);
    await expect(this.pageHeading).toBeVisible();
    await expect(this.add).toBeVisible();
    await expect(this.deletes).toHaveCount(0);
  }

  async addElements(times: number): Promise<void> {
    await this.add.click({ clickCount: times });
    await expect(this.deletes).toHaveCount(times);
  }

  async removeElementAt(): Promise<void> {
    const before = await this.deletes.count();
    await this.deleteAt.click();
    await expect(this.deletes).toHaveCount(before - 1);
  }

  async removeAllElements(): Promise<void> {
    const count = await this.deletes.count();
    if (count > 0) {
      // each click removes the current first delete button, so n clicks remove n elements
      await this.deletes.first().click({ clickCount: count });
    }
    await expect(this.deletes).toHaveCount(0);
  }
}
