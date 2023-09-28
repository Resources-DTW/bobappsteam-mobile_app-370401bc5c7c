import { createSelector } from 'reselect';

const itemsState = state => state.item;

export const itemsSelector = createSelector(
  itemsState,
  item => item.get('items')
);
