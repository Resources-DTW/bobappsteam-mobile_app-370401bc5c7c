import C from '../constants';

const addToCartAction = payload => {
  return {
    type: C.ADD_TO_CART_REQUESTED,
    payload
  }
};

const getCartAction = payload => {
  return {
    type: C.GET_CART_REQUESTED,
    payload
  }
};


const removeFromCartAction = payload => {
  return {
    type: C.REMOVE_FROM_CART_REQUESTED,
    payload
  }
};

const getMyOrdersAction = payload => {
  return {
    type: C.GET_MY_ORDERS_REQUESTED,
    payload
  }
};

const editCartItemAction = payload => {
  return {
    type: C.EDIT_CART_ITEM_REQUESTED,
    payload
  }
};


export {
  addToCartAction,
  getCartAction,
  removeFromCartAction,
  getMyOrdersAction,
  editCartItemAction,
};