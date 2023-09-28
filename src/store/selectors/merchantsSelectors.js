import { createSelector } from 'reselect';

const merchantsState = state => state.merchants;

export const pendingSelector = createSelector(
  merchantsState,
  merchants => merchants.get('pending')
);

export const tokenSelector = createSelector(
  merchantsState,
  merchants => merchants.get('token')
);

export const merchantSelector = createSelector(
  merchantsState,
  merchants => merchants.get('merchant')
);

export const successSelector = createSelector(
  merchantsState,
  merchants => merchants.get('success')
);

export const errorSelector = createSelector(
  merchantsState,
  merchants => merchants.get('error')
);
