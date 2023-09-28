import C from '../constants';

const loginAction = payload => {
  return {
    type: C.LOGIN_REQUESTED,
    payload
  }

};

const getAdressesAction = payload => {
  return {
    type: C.GET_ADDRESSE_REQUESTED,
    payload
  }
};

const saveAddressAction = payload => {
  return {
    type: C.SAVE_ADDRESS_REQUESTED,
    payload
  }
};


const changeSelectedMenuAction = payload => {
  return {
    type: C.CHANGE_SELECTED_MENU_REQUESTED,
    payload
  }
};



const getProfileDataAction = payload => {
  return {
    type: C.GET_PROFILE_DATA_REQUESTED,
    payload
  }
};


const addOrRemoveFavAction = payload => {
  return {
    type: C.ADD_OR_REMOVE_FAV_REQUESTED,
    payload
  }
};


const getAllFavsAction = payload => {
  return {
    type: C.GET_ALL_FAVS_REQUESTED,
    payload
  }
};

const logoutAction = payload => {
  return {
    type: C.LOGOUT_REQUESTED,
    payload
  }
};
const getNotificationsAction = payload => {
  return {
    type: C.GET_NOTIFICATION_REQUESTED,
    payload
  }
};


export {
  loginAction,
  getAdressesAction,
  saveAddressAction,
  changeSelectedMenuAction,
  getProfileDataAction,
  addOrRemoveFavAction,
  getAllFavsAction,
  logoutAction,
  getNotificationsAction,
};