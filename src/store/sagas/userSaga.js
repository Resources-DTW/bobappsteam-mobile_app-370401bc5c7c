import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import C from '../constants';
import { Api } from '../../services';
import { startApp, showModal, screenIds, dismissModal } from '../../navigation';
import AsyncStorage from '@react-native-community/async-storage'
import { getCartAction } from '../actions/cartActions';
import { getAdressesAction, getProfileDataAction } from '../actions/userActions';
import translations from 'src/localization/Translations';
import { calWidth, showToastError, showToastItemSuccess } from 'src/utils/helpers';
import { Platform } from 'react-native';
import { restoreMerchantAction } from '../actions/merchantsActions';
import Toast from 'react-native-simple-toast';


const _storeData = async (name, payload) => {
  try {
    await AsyncStorage.setItem(name, payload);

  } catch (error) {
    // Error saving data
  }
};


const _removeData = async (name, payload) => {
  try {
    await AsyncStorage.removeItem(name);

  } catch (error) {
    // Error saving data
  }
};


function* login(action) {
  try {
    yield call(_storeData, 'merchantToken', action.payload.token)
    yield call(_storeData, 'userToken', action.payload.token);
    yield put({
      type: C.LOGIN_SUCCEEDED,
      payload: action.payload.token
    });
    if (!action.payload.noDismiss)
      dismissModal(screenIds.LOGIN_SCREEN)
    // make sure to handle continue registeration
    if (action.payload.goToCheckoutPage) {
      action.payload.goToCheckoutPage()
    }
    yield put(getProfileDataAction({ token: action.payload.token }))
    yield put(getAdressesAction({ token: action.payload.token }))


  } catch (e) {
    console.warn(e)
    yield put({
      type: C.LOGIN_FAILED,
      payload: e.message
    });
  }
}

function* getAdresses(action) {
  try {
    const response = yield call(Api.getAdressesCall, action.payload)
    yield put({
      type: C.GET_ADDRESSE_SUCCEEDED,
      payload: response.data.data
    });
    // dismissModal(screenIds.LOGIN_SCREEN)

  } catch (e) {
    yield put({
      type: C.GET_ADDRESSE_FAILED,
      payload: []
    });
  }
}

function* saveAddress(action) {
  try {
    let response = {}
    if (action.payload.edit) {
      response = yield call(Api.editAdressesCall, action.payload)
    } else {
      response = yield call(Api.createAdressesCall, action.payload)
    }
    if (response && response.data && (response.data.data || response.data._id)) {

      yield put(getAdressesAction({ token: action.payload.token }))
      yield put({
        type: C.SAVE_ADDRESS_SUCCEEDED,
        payload: response.data.data
      });
      showToastItemSuccess(action.payload.edit ? translations.get('edit_address').val() : translations.get('add_address').val())
    } else {
      showToastError(response.data.message)
      // alert(response.data.message)
      yield put({
        type: C.SAVE_ADDRESS_FAILED,
        payload: []
      });
    }
    // dismissModal(screenIds.LOGIN_SCREEN)

  } catch (e) {
    yield put({
      type: C.SAVE_ADDRESS_FAILED,
      payload: []
    });
  }
}


function* changeSelectedMenu(action) {
  try {

    yield put({
      type: C.CHANGE_SELECTED_MENU_SUCCEEDED,
      payload: action.payload.index
    });

  } catch (e) {
    yield put({
      type: C.CHANGE_SELECTED_MENU_FAILED,
      payload: 0
    });
  }
}


function* getProfileData(action) {
  try {
    const response = yield call(Api.getUserDataCall, { token: action.payload.token });
    if (response && response.data) {
      yield put({
        type: C.GET_PROFILE_DATA_SUCCEEDED,
        payload: response.data ? response.data : {}
      });
    } else {
      yield put({
        type: C.GET_PROFILE_DATA_FAILED,
        payload: {}
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_PROFILE_DATA_FAILED,
      payload: {}
    });
  }
}


function* addOrRemoveFav(action) {
  try {
    let response = {}
    if (action.payload.add) {
      response = yield call(Api.addToFavCall, { id: action.payload.id, token: action.payload.token });
    } else {
      response = yield call(Api.removeFavCall, { id: action.payload.id, token: action.payload.token });

    }
    if (response && response.data && response.data.data || response.data.status == 200) {
      yield put({
        type: C.ADD_OR_REMOVE_FAV_SUCCEEDED,
        payload: {
          item: { [action.payload.id]: action.payload.add ? true : false },
          details: response.data.data ? response.data.data.referece_document || {} : {},
          id: action.payload.id,
          add: action.payload.add
        }
      });
    } else {
      yield put({
        type: C.ADD_OR_REMOVE_FAV_FAILED,
        payload: {}
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_PROFILE_DATA_FAILED,
      payload: {}
    });
  }
}



function* getAllFavs(action) {
  try {
    const response = yield call(Api.getAllFavCall, { token: action.payload.token });
    if (response && response.data && response.data.data) {
      let favs = {}
      const list = []
      response.data.data.map(fav => {
        if (fav.referece_document && fav.referece_document._id) {
          list.push(fav.referece_document)
          favs[fav.referece_document._id] = true
        }
      })
      yield put({
        type: C.GET_ALL_FAVS_SUCCEEDED,
        payload: {
          favs: favs,
          list: list
        }
      });
    } else {
      yield put({
        type: C.GET_ALL_FAVS_FAILED,
        payload: {}
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_ALL_FAVS_FAILED,
      payload: {}
    });
  }
}


function* logout(action) {
  try {
    yield call(_removeData, 'merchantToken')
    yield call(_removeData, 'userToken');
    yield put(restoreMerchantAction({}))
    yield put({
      type: C.LOGOUT_SUCCEEDED,
      payload: {}
    });
  } catch (e) {
    yield put({
      type: C.LOGOUT_FAILED,
      payload: {}
    });
  }
}


function* getNotification(action) {
  try {
    const response = yield call(Api.getNotificationCall, { token: action.payload.token });
    if (response && response.data && response.data.data) {
      yield put({
        type: C.GET_NOTIFICATION_SUCCEEDED,
        payload: response.data.data
      });
    } else {
      yield put({
        type: C.GET_NOTIFICATION_FAILED,
        payload: {}
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_NOTIFICATION_FAILED,
      payload: {}
    });
  }
}


function* userSaga() {
  yield takeLatest(C.LOGIN_REQUESTED, login);
  yield takeLatest(C.GET_ADDRESSE_REQUESTED, getAdresses);
  yield takeLatest(C.SAVE_ADDRESS_REQUESTED, saveAddress);
  yield takeLatest(C.CHANGE_SELECTED_MENU_REQUESTED, changeSelectedMenu);
  yield takeLatest(C.GET_PROFILE_DATA_REQUESTED, getProfileData);
  yield takeLatest(C.ADD_OR_REMOVE_FAV_REQUESTED, addOrRemoveFav);
  yield takeLatest(C.GET_ALL_FAVS_REQUESTED, getAllFavs);
  yield takeLatest(C.LOGOUT_REQUESTED, logout);
  yield takeLatest(C.GET_NOTIFICATION_REQUESTED, getNotification);


}

export default userSaga;