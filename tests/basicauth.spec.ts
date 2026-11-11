import { test } from './fixtures';
import { openSectionFromHome } from './utils/homeFlows';
import {
  basicAuthPageIsLoaded,
  basicAuthFooterLinksPresent,
  elementalSeleniumOpensInNewTab,
  basicAuthRejectsWrongCredentials,
} from './utils/basicAuthFlows';

test.describe('Basic Auth', () => {
  test.describe('with valid credentials (admin/admin)', () => {
    test.use({
      httpCredentials: { username: 'admin', password: 'admin' },
    });

    test('page loads with heading and congratulations message', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthPageIsLoaded(basicAuthPage);
    });

    test('reachable from the home page', async ({ homePageFor }) => {
      const home = homePageFor('Basic Auth');
      await home.open();
      await openSectionFromHome(home, '/basic_auth');
    });

    test('footer links are present', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthFooterLinksPresent(basicAuthPage);
    });

    test('Elemental Selenium link opens in a new tab', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await elementalSeleniumOpensInNewTab(basicAuthPage);
    });
  });

  test('direct load with credentials embedded in URL', async ({ basicAuthPage }) => {
    await basicAuthPage.openWithCredentials('admin', 'admin');
    await basicAuthPageIsLoaded(basicAuthPage);
  });

  test.describe('with wrong credentials', () => {
    test.use({
      httpCredentials: { username: 'wrong', password: 'wrong' },
    });

    test('navigation is rejected with 401', async ({ basicAuthPage }) => {
      await basicAuthRejectsWrongCredentials(basicAuthPage);
    });
  });
});
