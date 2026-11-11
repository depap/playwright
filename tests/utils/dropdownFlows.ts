import { DropDownPage } from "../pages/DropdownPage";
import { expect } from "@playwright/test";

export async function dropDownPageIsLoaded(dr: DropDownPage) {
    await expect(dr.pageHeading).toBeVisible();
}