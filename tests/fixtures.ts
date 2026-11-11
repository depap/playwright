import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ABTestPage } from './pages/ABTestPage';
import { AddRemovePage } from './pages/AddRemovePage';
import { BasicAuthPage } from './pages/BasicAuthPage';
import { DropDownPage } from './pages/DropdownPage';

type PageFixtures = {
  abTestPage: ABTestPage;
  addRemovePage: AddRemovePage;
  basicAuthPage: BasicAuthPage;
  dropDownPage: DropDownPage;
  homePageFor: (sectionName: string) => HomePage;
};

export const test = base.extend<PageFixtures>({
  abTestPage: async ({ page }, use) => use(new ABTestPage(page)),
  addRemovePage: async ({ page }, use) => use(new AddRemovePage(page)),
  basicAuthPage: async ({ page }, use) => use(new BasicAuthPage(page)),
  dropDownPage: async ({ page }, use) => use(new DropDownPage(page)),
  homePageFor: async ({ page }, use) => use((sectionName: string) => new HomePage(page, sectionName)),
});

export { expect } from '@playwright/test';
