import C from '../constants';

const loginMerchantsAction = payload => {
  return {
    type: C.LOGIN_MERCHANTS_REQUESTED,
    payload
  }
};

const restoreMerchantAction = payload => {
  return {
    type: C.RESTORE_MERCHANT_REQUESTED,
    payload
  }
};


const changeLangAction = payload => {
  return {
    type: C.CHANGE_LANG_REQUESTED,
    payload
  }
};


export {
  loginMerchantsAction,
  restoreMerchantAction,
  changeLangAction,
};