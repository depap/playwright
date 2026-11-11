import { test } from './fixtures';

test.describe('Basic Auth', () => {
  test.describe('with valid credentials (admin/admin)', () => {
    test.use({
      httpCredentials: { username: 'admin', password: 'admin' },
    });

    test('page loads with heading and congratulations message', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthPage.isLoaded();
    });

    test('reachable from the home page', async ({ homePageFor }) => {
      const home = homePageFor('Basic Auth');
      await home.open();
      await home.openSection('/basic_auth');
    });

    test('footer links are present', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthPage.footerLinksPresent();
    });

    test('Elemental Selenium link opens in a new tab', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthPage.elementalSeleniumOpensInNewTab();
    });
  });

  test('direct load with credentials embedded in URL', async ({ basicAuthPage }) => {
    await basicAuthPage.openWithCredentials('admin', 'admin');
    await basicAuthPage.isLoaded();
  });

  test.describe('with wrong credentials', () => {
    test.use({
      httpCredentials: { username: 'wrong', password: 'wrong' },
    });

    test('navigation is rejected with 401', async ({ basicAuthPage }) => {
      await basicAuthPage.open();
      await basicAuthPage.rejectsWrongCredentials();
    });
  });
});
