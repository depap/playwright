import { test } from './fixtures';

test.describe('Add/Remove Elements', () => {
  test('page loads empty with add button', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePage.isLoaded();
  });

  test('reachable from the home page', async ({ homePageFor }) => {
    const home = homePageFor('Add/Remove Elements');
    await home.open();
    await home.openSection('/add_remove_elements/');
  });

  test('adds a single element', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePage.addElements(1);
  });

  test('adds three elements', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePage.addElements(3);
  });

  test('removes the first element', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePage.addElements(2);
    await addRemovePage.removeElementAt();
  });

  test('removes all elements', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePage.addElements(3);
    await addRemovePage.removeAllElements();
  });
});
