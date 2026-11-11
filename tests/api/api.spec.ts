import { test } from '../fixtures';
import { expectStatus, expectRedirect, expectUnauthorized } from './apiFlows';

test.describe('API: status codes', () => {
  test('200 endpoint returns 200', async ({ request }) => {
    await expectStatus(request, '/status_codes/200', 200);
  });

  test('404 endpoint returns 404', async ({ request }) => {
    await expectStatus(request, '/status_codes/404', 404);
  });

  test('500 endpoint returns 500', async ({ request }) => {
    await expectStatus(request, '/status_codes/500', 500);
  });
});

test.describe('API: redirect and auth', () => {
  test('redirect endpoint returns 302 with location header', async ({ request }) => {
    await expectRedirect(request, '/redirect');
  });

  test('basic auth without credentials returns 401 with Basic challenge', async ({ request }) => {
    await expectUnauthorized(request, '/basic_auth');
  });
});
