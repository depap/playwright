import { test } from "./fixtures";
import { dropDownPageIsLoaded } from "./utils/dropdownFlows";

test.describe('Dropdown', () => {
    test('Select first dropdown option', async ({ dropDownPage }) => {
        await dropDownPage.open();
        await dropDownPageIsLoaded(dropDownPage)
    })
})