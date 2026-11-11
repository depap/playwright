import { test } from './fixtures';
import { openSectionFromHome } from './utils/homeFlows';
import {
  addRemovePageIsLoaded,
  addElements,
  removeElementAt,
  removeAllElements,
} from './utils/addRemoveFlows';

test.describe('Add/Remove Elements', () => {
  test('page loads empty with add button', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addRemovePageIsLoaded(addRemovePage);
  });

  test('reachable from the home page', async ({ homePageFor }) => {
    const home = homePageFor('Add/Remove Elements');
    await home.open();
    await openSectionFromHome(home, '/add_remove_elements/');
  });

  test('adds a single element', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addElements(addRemovePage, 1);
  });

  test('adds three elements', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addElements(addRemovePage, 3);
  });

  test('removes the first element', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addElements(addRemovePage, 2);
    await removeElementAt(addRemovePage);
  });

  test('removes all elements', async ({ addRemovePage }) => {
    await addRemovePage.open();
    await addElements(addRemovePage, 3);
    await removeAllElements(addRemovePage);
  });
});
