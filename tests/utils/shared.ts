import { expect, Page, Locator } from '@playwright/test';

/** Shared helper: a link with target=_blank opens a popup; assert its URL, then close it. */
export async function linkOpensInNewTab(page: Page, link: Locator, urlPattern: RegExp): Promise<void> {
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
  await expect(popup).toHaveURL(urlPattern);
  await popup.close();
}
