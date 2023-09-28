import { createSelector } from 'reselect';

const cartState = state => state.cart;

export const addToCartDataSelector = createSelector(
  cartState,
  cart => cart.get('addToCartData')
);

export const cartDetailsSelector = createSelector(
  cartState,
  cart => cart.get('cartDetails')
);

export const myOrdersSelector = createSelector(
  cartState,
  cart => cart.get('myOrders')
);
