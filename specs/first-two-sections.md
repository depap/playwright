# Test plan: the-internet.herokuapp.com — first two sections

Target: https://the-internet.herokuapp.com/ (baseURL in playwright.config.ts)
Sections covered (first two on the home page):
1. **A/B Testing** — `/abtest`
2. **Add/Remove Elements** — `/add_remove_elements/`

## Section 1: A/B Testing (`/abtest`)

Notes from exploration: the `h3` heading is A/B-split between "A/B Test" and "No A/B Test",
so assertions must match both (use `toContainText('A/B Test')`). The footer link
"Elemental Selenium" (`https://elementalselenium.com/`) has `target="_blank"` — it opens a popup.

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1.1 | Direct load | `goto('/abtest')` | URL matches `/abtest`; h3 contains "A/B Test"; "Elemental Selenium" link visible |
| 1.2 | Reachable from home | home → click link "A/B Testing" | URL becomes `/abtest` |
| 1.3 | Footer link | click "Elemental Selenium" | new tab (popup) opens with URL matching `elementalselenium.com` |

## Section 2: Add/Remove Elements (`/add_remove_elements/`)

Notes from exploration: button "Add Element" appends `<button class="added-manually">Delete</button>`
into `#elements`. Page starts with zero Delete buttons.

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 2.1 | Direct load | `goto('/add_remove_elements/')` | heading "Add/Remove Elements" visible; "Add Element" visible; 0 Delete buttons |
| 2.2 | Reachable from home | home → click link "Add/Remove Elements" | URL becomes `/add_remove_elements/` |
| 2.3 | Add one | click "Add Element" once | exactly 1 Delete button |
| 2.4 | Add three | click "Add Element" 3 times | exactly 3 Delete buttons |
| 2.5 | Remove first | add 2, click Delete at index 0 | exactly 1 Delete button remains |
| 2.6 | Remove all | add 3, delete until none left | 0 Delete buttons |

## Conventions (from .vibe/skills/playwright-testing)

- POM in `tests/pages/` with constructor-parameterized locators; logic in `tests/utils/`; specs call only methods.
- No `waitForTimeout` / `waitForSelector`; assert with auto-retrying `expect(locator)`.
- Relative `goto()` only (baseURL in config).
