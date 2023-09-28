import C from '../constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  token: '',
  merchant: {
    parsingFeature: {}
  },
  pending: false,
  success: false,
  error: null,
  userLogin: false
});

const merchants = (state = defaultState, action) => {
  switch (action.type) {
    case C.GET_CART_SUCCEEDED:
      if (action.payload.jwtToken) {
        return state.merge({
          token: action.payload.jwtToken
        })
      } else {
        return state;
      }
    case C.ADD_TO_CART_SUCCEEDED:
      if (action.payload.jwtToken) {
        return state.merge({
          token: action.payload.jwtToken
        })
      } else {
        return state;
      }
    case C.LOGIN_MERCHANTS_REQUESTED:
      return state.merge({
        token: '',
        merchant: {
          parsingFeature: {}
        },
        pending: true,
        success: false,
        error: null
      })
    case C.LOGIN_MERCHANTS_SUCCEEDED:
      return state.merge({
        token: action.payload.token,
        merchant: action.payload.merchant,
        pending: false,
        success: true,
        error: null
      })
    case C.LOGIN_MERCHANTS_FAILED:
      return state.merge({
        token: '',
        merchant: {
          parsingFeature: {}
        },
        pending: false,
        success: false,
        error: action.payload
      })
    case C.LOGIN_SUCCEEDED:
      return state.merge({
        token: action.payload,
      })
    case C.LOGOUT_SUCCEEDED:
      return state.merge({
        token: '',
        merchant: {
          parsingFeature: {}
        },
        pending: false,
        success: false,
        error: null,
        userLogin: false
      })
    default:
      return state
  }
};

export default merchants;