# Test plan: the-internet.herokuapp.com — Basic Auth

Target: https://the-internet.herokuapp.com/ (baseURL in playwright.config.ts)
Section: **Basic Auth** — `/basic_auth`

Notes from exploration: Basic Auth uses HTTP Basic Authentication with
credentials `admin` / `admin`. In Playwright this is handled via
`test.use({ httpCredentials: { username: 'admin', password: 'admin' } })`
or by embedding credentials in the URL (`https://admin:admin@host/basic_auth`).
With valid credentials the page shows heading "Basic Auth" and a
"Congratulations! You must have the proper credentials." message.
With wrong or missing credentials the browser returns a 401 auth error.
The home page lists this section as "Basic Auth (user and pass: admin)".

## Section 3: Basic Auth (`/basic_auth`)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 3.1 | Direct load with credentials in URL | `goto('https://admin:admin@the-internet.herokuapp.com/basic_auth')` | URL contains `/basic_auth`; h3 is "Basic Auth"; page contains "Congratulations! You must have the proper credentials." |
| 3.2 | Direct load with httpCredentials context option | set `httpCredentials: { username: 'admin', password: 'admin' }`, then `goto('/basic_auth')` | URL matches `/basic_auth`; h3 is "Basic Auth"; congratulations message visible |
| 3.3 | Reachable from home | home → click link "Basic Auth" (with httpCredentials set) | URL becomes `/basic_auth`; success page loads |
| 3.4 | Wrong credentials rejected | set `httpCredentials: { username: 'wrong', password: 'wrong' }`, then `goto('/basic_auth')` | navigation fails with 401 / auth error (ERR_INVALID_AUTH_CREDENTIALS) |
| 3.5 | Footer links present | on success page (with valid credentials) | "Elemental Selenium" link visible (opens popup to elementalselenium.com); "Sauce Labs" link visible (opens saucelabs.com) |

## Conventions (from .vibe/skills/playwright-testing)

- POM in `tests/pages/` with constructor-parameterized locators; logic in `tests/utils/`; specs call only methods.
- No `waitForTimeout` / `waitForSelector`; assert with auto-retrying `expect(locator)`.
- Relative `goto()` only (baseURL in config). For credential-in-URL test, use absolute URL with embedded credentials.
- Use `test.use({ httpCredentials: ... })` inside a `test.describe` block for credential-based tests.
