import { test } from './fixtures';

test.describe('A/B Testing', () => {
  test('page loads with heading and footer link', async ({ abTestPage }) => {
    await abTestPage.open();
    await abTestPage.isLoaded();
  });

  test('reachable from the home page', async ({ homePageFor }) => {
    const home = homePageFor('A/B Testing');
    await home.open();
    await home.openSection('/abtest');
  });

  test('Elemental Selenium link opens in a new tab', async ({ abTestPage }) => {
    await abTestPage.open();
    await abTestPage.elementalSeleniumOpensInNewTab();
  });
});
