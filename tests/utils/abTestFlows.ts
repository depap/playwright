import { expect } from '@playwright/test';
import { ABTestPage } from '../pages/ABTestPage';

export async function abTestPageIsLoaded(ab: ABTestPage): Promise<void> {
  await expect(ab.page).toHaveURL(/\/abtest/);
  await expect(ab.pageHeading).toContainText('A/B Test');
  await expect(ab.elemental).toBeVisible();
}

export async function elementalSeleniumOpensInNewTab(ab: ABTestPage): Promise<void> {
  const [popup] = await Promise.all([
    ab.page.waitForEvent('popup'),
    ab.elemental.click(),
  ]);
  await expect(popup).toHaveURL(/elementalselenium\.com/);
  await popup.close();
}
