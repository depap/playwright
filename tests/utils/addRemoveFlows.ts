import { expect } from '@playwright/test';
import { AddRemovePage } from '../pages/AddRemovePage';

export async function addRemovePageIsLoaded(ar: AddRemovePage): Promise<void> {
  await expect(ar.page).toHaveURL(/\/add_remove_elements\//);
  await expect(ar.pageHeading).toBeVisible();
  await expect(ar.add).toBeVisible();
  await expect(ar.deletes).toHaveCount(0);
}

export async function addElements(ar: AddRemovePage, times: number): Promise<void> {
  await ar.add.click({ clickCount: times });
  await expect(ar.deletes).toHaveCount(times);
}

export async function removeElementAt(ar: AddRemovePage): Promise<void> {
  const before = await ar.deletes.count();
  await ar.deleteAt.click();
  await expect(ar.deletes).toHaveCount(before - 1);
}

export async function removeAllElements(ar: AddRemovePage): Promise<void> {
  const count = await ar.deletes.count();
  if (count > 0) {
    // each click removes the current first delete button, so n clicks remove n elements
    await ar.deletes.first().click({ clickCount: count });
  }
  await expect(ar.deletes).toHaveCount(0);
}
