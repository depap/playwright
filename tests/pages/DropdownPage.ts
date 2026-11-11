import { Locator, Page } from "@playwright/test";

export class DropDownPage {
    readonly pageHeading: Locator;

    constructor(public readonly page: Page) {
        this.pageHeading = page.getByRole('heading', { name: 'Dropdown list'});
    }

    async open() {
        await this.page.goto('dropdown')
    }
}