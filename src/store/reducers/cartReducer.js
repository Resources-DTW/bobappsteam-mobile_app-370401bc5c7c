import C from '../constants';
import { fromJS } from 'immutable';
import store from '..';
const addToCartData = {
  pending: false,
  success: false,
  error: null,
}
const cartDetails = {
  pending: false,
  success: false,
  error: null,
  items: [],
  cart_total: 0
}
const myOrders = {
  pending: false,
  success: false,
  error: null,
  list: [],
  orders_total: 0
}

const defaultState = fromJS({
  addToCartData: { ...addToCartData },
  cartDetails: { ...cartDetails },
  myOrders: { ...myOrders }
});

const cart = (state = defaultState, action) => {
  switch (action.type) {

    case C.GET_MY_ORDERS_REQUESTED:
      return state.merge({
        myOrders: {
          ...myOrders,
          pending: true
        }
      })
    case C.GET_MY_ORDERS_SUCCEEDED:
      return state.merge({
        myOrders: {
          ...myOrders,
          ...action.payload,
          success: true
        }
      })
    case C.GET_MY_ORDERS_FAILED:
      return state.merge({
        myOrders: {
          ...myOrders,
          error: true
        }
      })


    case C.EDIT_CART_ITEM_REQUESTED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          items: state.get('cartDetails').items,
          pending: true
        }
      })
    case C.EDIT_CART_ITEM_SUCCEEDED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          ...action.payload.data,
          success: true
        }
      })
    case C.EDIT_CART_ITEM_FAILED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          error: true
        }
      })

    case C.GET_CART_REQUESTED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          pending: true
        }
      })
    case C.GET_CART_SUCCEEDED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          ...action.payload,
          success: true
        }
      })
    case C.GET_CART_FAILED:
      return state.merge({
        cartDetails: {
          ...cartDetails,
          error: true
        }
      })

    case C.ADD_TO_CART_REQUESTED:
      return state.merge({
        addToCartData: {
          ...addToCartData,
          pending: true
        }
      })
    case C.ADD_TO_CART_SUCCEEDED:
      return state.merge({
        addToCartData: {
          ...addToCartData,
          success: true,
        },
        cartDetails: {
          ...cartDetails,
          ...action.payload.data,
          success: true
        }

      })
    case C.ADD_TO_CART_FAILED:
      return state.merge({
        addToCartData: {
          ...addToCartData,
          error: action.payload
        }
      })
    case C.LOGOUT_SUCCEEDED:
      return state.merge({
        addToCartData: { ...addToCartData },
        cartDetails: { ...cartDetails },
        myOrders: { ...myOrders }
      })
    default:
      return state
  }
};

export default cart;