import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import C from '../constants';
import { Api } from '../../services';
import { startApp, showModal, screenIds } from '../../navigation';
import AsyncStorage from '@react-native-community/async-storage'
import Toast from 'react-native-simple-toast';
import { showToastError, showToastItemSuccess } from 'src/utils/helpers';
import { getCartAction } from '../actions/cartActions';
import translations from 'src/localization/Translations';
import store from '..';


const _storeData = async (name, payload) => {
  try {
    await AsyncStorage.setItem(name, payload);

  } catch (error) {
    // Error saving data
  }
};

function* addToCart(action) {
  try {
    const parsingFeature = store.getState().merchants.get('merchant')?.parsingFeature
    const response = yield call(Api.addToCartCall, action.payload);
    if (response && response.data && response.data.data) {
      if (response.data.jwtToken) {
        yield call(_storeData, 'merchantToken', response.data.jwtToken)
      }
      // showModal(screenIds.SUCCESS_ADD_ITEM_SCREEN,
      //   {
      //     item: action.payload.item
      //   }, {
      //   layout: {
      //     backgroundColor: 'rgba(0,0,0,0.8)',
      //   },
      // })
      showToastItemSuccess(parsingFeature?.['indoor_cta'] ?
        translations.get('added_to_order').val()
        : translations.get('item_added').val(), true, true,
        parsingFeature?.['indoor_cta'] ? translations.get('view_order').val() : translations.get('view_cart').val()
      )
      // showModal(screenIds.SUCCESS_ADD_ITEM_SCREEN, {
      //   item: action.payload,
      //   show: action.payload?.show,
      //   pop: action.payload.pop
      // }, {
      //   modalPresentationStyle: 'popover',
      //   modal: {
      //     swipeToDismiss: true
      //   }
      // })
      yield put({
        type: C.ADD_TO_CART_SUCCEEDED,
        payload: {
          data: response.data.data || {},
          jwtToken: response.data.jwtToken ? response.data.jwtToken : null
        },
      });
      // yield put(getCartAction({ token: response.data.jwtToken ? response.data.jwtToken : action.payload.token }))
    } else {
      showToastError(response.data.message)
      yield put({
        type: C.ADD_TO_CART_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.ADD_TO_CART_FAILED,
      payload: e.message
    });
  }
}

function* getCart(action) {
  try {
    const response = yield call(Api.getCartCall, action.payload);
    if (response && response.data && !response.data.status) {

      yield put({
        type: C.GET_CART_SUCCEEDED,
        payload: response.data || {},
      });
    } else {
      const response2 = yield call(Api.createEmptyCartCall, action.payload);
      if (response2 && response2.data && response2.data.group_token) {
        if (response2.data.jwtToken) {
          yield call(_storeData, 'merchantToken', response2.data.jwtToken)
        }
        yield put({
          type: C.GET_CART_SUCCEEDED,
          payload: response2.data || {},
        });
      } else {
        // console.warn({ response2, response });
        yield put({
          type: C.GET_CART_FAILED,
          payload: response.data.message
        });
      }
    }

  } catch (e) {
    yield put({
      type: C.GET_CART_FAILED,
      payload: e.message
    });
  }
}

function* removeFromCart(action) {
  try {
    const response = yield call(Api.removeFromCartCall, action.payload);
    if (response && response.data && !response.data.status) {

      yield put({
        type: C.GET_CART_SUCCEEDED,
        payload: response.data || {},
      });
    } else {
      // yield put({
      //   type: C.GET_CART_FAILED,
      //   payload: response.data.message
      // });
    }

  } catch (e) {
    // yield put({
    //   type: C.GET_CART_FAILED,
    //   payload: e.message
    // });
  }
}


function* getMyOrders(action) {
  try {
    const response = yield call(Api.getOrdersCall, action.payload);
    if (response && response.data && response.data.data) {

      yield put({
        type: C.GET_MY_ORDERS_SUCCEEDED,
        payload: response.data || {},
      });
    } else {
      yield put({
        type: C.GET_MY_ORDERS_FAILED,
        payload: {},
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_MY_ORDERS_FAILED,
      payload: {},
    });
  }
}


function* editCart(action) {
  try {
    const response = yield call(Api.editCartItemCall, action.payload);
    if (response && response.data && response.data._id) {
      // if (response.data.jwtToken) {
      //   yield call(_storeData, 'merchantToken', response.data.jwtToken)
      // }

      yield put({
        type: C.EDIT_CART_ITEM_SUCCEEDED,
        payload: {
          data: response.data || {},
        },
      });
    } else {
      yield put({
        type: C.EDIT_CART_ITEM_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.EDIT_CART_ITEM_FAILED,
      payload: e.message
    });
  }
}
function* cartSaga() {

  yield takeLatest(C.ADD_TO_CART_REQUESTED, addToCart);
  yield takeLatest(C.GET_CART_REQUESTED, getCart);
  yield takeLatest(C.REMOVE_FROM_CART_REQUESTED, removeFromCart);
  yield takeLatest(C.GET_MY_ORDERS_REQUESTED, getMyOrders);
  yield takeLatest(C.EDIT_CART_ITEM_REQUESTED, editCart);


}

export default cartSaga;