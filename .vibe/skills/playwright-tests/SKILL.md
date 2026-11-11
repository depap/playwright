---
name: playwright-tests
description: Generate a Playwright test battery in this repo following the mandatory architecture (POM with constructor-parameterized locators in tests/pages, logic in tests/utils, legible specs). Invoke as /playwright-tests with a target page/section to scaffold plan + tests. Core rule: never use arbitrary waits; use auto-retrying web-first expect() assertions instead of waitFor*.
---

# Playwright testing skill

Applies to all tests in `tests/*.spec.ts`. Config lives in `playwright.config.ts` (`testDir: './tests'`, `baseURL` already set, `trace: 'on-first-retry'`, retries on CI).

## Architecture: POM + utils (mandatory)

```
tests/
├── example.spec.ts      # spec: only legible method calls — no locators, no raw expect/action logic
├── pages/               # full Page Objects: locators + navigation + actions + assertions
│   └── DocsPage.ts
└── utils/               # only shared/complex helpers reused by multiple page objects
    └── shared.ts
```

Three rules:

1. **Use the Page Object Model.** Every page/component used in a test gets a class in `tests/pages/`.
2. **Locators live in the constructor and are parameterized.** Constructor takes `page` plus any values the locators depend on; locators are assigned once as public `readonly` fields and used directly — no getters. Never build a locator inside a spec or a util.
3. **Specs contain only method calls.** A spec receives a page object from a fixture and calls its methods (`page.open()`, `page.addElements(3)`) — it reads like a story. The page object owns all page-specific logic, including `expect(...)` assertions; `tests/utils/` is reserved for shared or complex helpers reused by multiple page objects.

Page Object (`tests/pages/DocsPage.ts`):

```ts
import { expect, Page, Locator } from '@playwright/test';

export class DocsPage {
  readonly page: Page;
  readonly search: Locator;
  readonly results: Locator;
  readonly heading: Locator;

  constructor(page: Page, section: string) {
    this.page = page;
    this.search = page.getByPlaceholder('Search');
    this.results = page.getByRole('list').filter({ hasText: section });
    this.heading = page.getByRole('heading', { name: section });
  }

  async open(): Promise<void> {
    await this.page.goto('/'); // baseURL is set in config — relative URLs only
  }

  async searchShowsResults(term: string): Promise<void> {
    await this.search.fill(term);
    await expect(this.results).toContainText(term);
    await expect(this.heading).toBeVisible();
  }
}
```

Shared helper (`tests/utils/shared.ts`) — only for logic reused by multiple page objects:

```ts
import { expect, Page, Locator } from '@playwright/test';

export async function linkOpensInNewTab(page: Page, link: Locator, urlPattern: RegExp): Promise<void> {
  const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
  await expect(popup).toHaveURL(urlPattern);
  await popup.close();
}
```

Spec — legible, logic-free (`tests/example.spec.ts`):

```ts
import { test } from './fixtures';

test('search shows results for the current section', async ({ docsPage }) => {
  await docsPage.open();
  await docsPage.searchShowsResults('locators');
});
```

- The POM owns all page-specific logic: locators, `open()`, action methods, and assertion methods like `isLoaded()` — `expect(...)` calls included. Specs call them directly: `page.searchShowsResults(...)`.
- `tests/utils/` holds only shared or complex helpers reused by multiple page objects (popup handling, API login, ...). Keep them small and named as actions.
- Group specs with `test.describe`; use `test.beforeEach` for shared setup (e.g. opening a page); use `test.step` inside specs only for reporting phases, not for logic.
- Tests must be independent: `fullyParallel: true` is on. No shared state between tests; create unique data per test (e.g. suffix with `test.info().workerIndex` + timestamp).

## Golden rule: no arbitrary waits

- **Never `page.waitForTimeout(ms)`** — it is a sleep, not synchronization. It makes tests slow and still flaky.
- **Never `waitForSelector` / `waitFor*` to check UI state.** Use `expect(locator).toBeVisible()` etc. — these poll and auto-retry until the timeout.
- Avoid `page.waitForLoadState('networkidle')` — it is effectively an arbitrary wait. Wait for the specific element or assertion that tells you the page is ready.
- If you must synchronize on network, use `page.waitForResponse(urlOrPredicate)` with a narrow predicate, or better: stub the call with `page.route()` (see Determinism).

## Assertions (web-first)

```ts
await expect(page.getByRole('heading', { name: 'Get started' })).toBeVisible();
await expect(page).toHaveURL(/docs/);
await expect(locator).toHaveText('Welcome, depap');
await expect(locator).toHaveCount(3);
```

- Prefer `expect(locator).to*` — auto-retrying, gives good error messages. In this repo these calls live in the POM's assertion methods.
- For non-DOM values (variables, API results): `expect.poll(() => value).toBe(...)`.
- For visual checks: `await expect(page).toHaveScreenshot()` (set `maxDiffPixelRatio` in config for stability).
- Tune timeout once globally (`expect.configure({ timeout: 5000 })`) rather than per-call sleeps.

## Locators

- Prefer user-facing locators: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByAltText`, `getByTitle`.
- `data-testid` only as a last resort (agree on the attribute with the team).
- Chain and filter: `page.locator('li').filter({ hasText: 'Submit' })`. Avoid `nth()` and raw CSS/XPath when a semantic locator exists.
- Use `locator.or(other)` for either/or states.
- All of the above are declared in the POM constructor (parameterized), never in specs or utils.

## Determinism

- Stub unstable/external APIs with `page.route('**/api/**', route => route.fulfill({ ... }))` instead of waiting for real responses.
- Don't rely on test execution order. If a group truly must run serially: `test.describe.configure({ mode: 'serial' })`.
- Use the `request` fixture for API setup/teardown instead of driving the UI.

## Fixtures (mandatory for shared setup)

- **All common setup lives in fixtures, never inline in specs.** Create `tests/fixtures.ts`, extend `test` from it, and expose page objects and prepared state as fixtures. A spec then just receives ready-made objects: `test('...', async ({ homePage }) => { ... })`.
- Use built-in fixtures: `page`, `context`, `request`, `browser`.

```ts
// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';

export const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page, 'A/B Testing'));
  },
});
```

- **Login via API, not UI** — unless the feature under test is the login itself. POST credentials with the `request` fixture and reuse the session via `storageState` (the `request` fixture shares cookies with the browser context), so tests start already authenticated:

```ts
// tests/fixtures.ts
export const test = base.extend({
  storageState: async ({ request }, use) => {
    await request.post('/api/login', { data: { username: 'admin', password: 'admin' } });
    await use(await request.storageState());
  },
});
```

  UI-driven login belongs only in the dedicated login spec file — never in `beforeEach` of unrelated suites.
- Avoid `page.evaluate()` to poke at app internals; interact through the UI like a user.

## TypeScript (strict is on in tsconfig.json)

- No `any`. Type page objects with `Page`/`Locator`, utils with explicit parameter and `Promise<void>` return types.

## Anti-pattern checklist (reject in review)

- `waitForTimeout`, `waitForSelector`, `waitForLoadState('networkidle')`
- locators, `expect(...)`, or action logic written directly in a `*.spec.ts` — specs only call page-object methods (`page.open()`, `page.addElements(3)`)
- locators not declared as public `readonly` fields in the POM constructor (built ad-hoc in methods, or hidden behind getters)
- `expect(await page.textContent(...)).toBe(...)` — assert on locators, not snapshots
- `page.$(...)` one-shot queries (no auto-wait) — use `page.locator(...)`
- `test.only` (CI fails on it via `forbidOnly`)
- leftover `console.log` debugging
- absolute URLs instead of `baseURL`
- shared setup (navigation, auth, seed data) written in `beforeEach` or inline in specs instead of fixtures
- login performed through the UI in every test — use API login via `request`/`storageState` unless the test covers the login flow itself

## Commands

```bash
npx playwright test                    # all projects
npx playwright test --project=chromium # one browser
npx playwright test --ui               # UI mode
npx playwright test tests/example.spec.ts -g "title"
npx playwright show-report             # open HTML report
npx playwright codegen                 # record selectors
```
