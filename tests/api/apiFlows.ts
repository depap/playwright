import { expect, APIRequestContext } from '@playwright/test';

export async function expectStatus(request: APIRequestContext, path: string, status: number): Promise<void> {
  const response = await request.get(path);
  expect(response.status()).toBe(status);
}

export async function expectRedirect(request: APIRequestContext, path: string): Promise<void> {
  const response = await request.get(path, { maxRedirects: 0 });
  expect(response.status()).toBe(302);
  expect(response.headers()['location']).toContain('the-internet.herokuapp.com');
}

export async function expectUnauthorized(request: APIRequestContext, path: string): Promise<void> {
  const response = await request.get(path);
  expect(response.status()).toBe(401);
  expect(response.headers()['www-authenticate']).toContain('Basic');
}
