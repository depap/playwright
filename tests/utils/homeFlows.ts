import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

export async function openSectionFromHome(home: HomePage, expectedPath: string): Promise<void> {
  await expect(home.section).toBeVisible();
  await home.section.click();
  await expect(home.page).toHaveURL(new RegExp(expectedPath));
}
