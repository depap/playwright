import { test } from './fixtures';
import { openSectionFromHome } from './utils/homeFlows';
import { abTestPageIsLoaded, elementalSeleniumOpensInNewTab } from './utils/abTestFlows';

test.describe('A/B Testing', () => {
  test('page loads with heading and footer link', async ({ abTestPage }) => {
    await abTestPage.open();
    await abTestPageIsLoaded(abTestPage);
  });

  test('reachable from the home page', async ({ homePageFor }) => {
    const home = homePageFor('A/B Testing');
    await home.open();
    await openSectionFromHome(home, '/abtest');
  });

  test('Elemental Selenium link opens in a new tab', async ({ abTestPage }) => {
    await abTestPage.open();
    await elementalSeleniumOpensInNewTab(abTestPage);
  });
});
