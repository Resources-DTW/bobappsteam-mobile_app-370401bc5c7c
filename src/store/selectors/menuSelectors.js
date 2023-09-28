import { createSelector } from 'reselect';

const menuState = state => state.menu;

export const menuCategoriesSelector = createSelector(
  menuState,
  menu => menu.get('categories')
);


export const categoryItemsSelector = createSelector(
  menuState,
  menu => menu.get('items')
);

export const showHideSelector = createSelector(
  menuState,
  menu => menu.get('showHide')
);

export const selectedCatSelector = createSelector(
  menuState,
  menu => menu.get('selectedCat')
);
