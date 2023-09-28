import { createSelector } from 'reselect';

const userState = state => state.user;

export const userLoginSelector = createSelector(
  userState,
  user => user.get('userLogin')
);
export const addressesSelector = createSelector(
  userState,
  user => user.get('addresses')
);

export const saveAddressSelector = createSelector(
  userState,
  user => user.get('saveAddress')
);
export const indexingSelector = createSelector(
  userState,
  user => user.get('indexing')
);


export const userDataSelector = createSelector(
  userState,
  user => user.get('userData')
);

export const favListSelector = createSelector(
  userState,
  user => user.get('favList')
);

export const fullFavListSelector = createSelector(
  userState,
  user => user.get('fullFavList')
);

export const notificationsSelector = createSelector(
  userState,
  user => user.get('notifications')
);
