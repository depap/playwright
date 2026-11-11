import { test } from "./fixtures";
import { expect } from "@playwright/test";

test.describe('Dropdown', () => {
    test('Select first dropdown option', async ({ dropDownPage }) => {
        await dropDownPage.open();
        await expect(dropDownPage.pageHeading).toBeVisible();
    })
})