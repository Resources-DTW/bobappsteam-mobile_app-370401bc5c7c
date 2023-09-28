import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import C from '../constants';
import { Api } from '../../services';
import { startApp, setDefaultOptions, screenIds, dismissOverlay } from '../../navigation';
import AsyncStorage from '@react-native-community/async-storage'
import { getCartAction } from '../actions/cartActions';
import colors from 'src/theme'
import context from 'src/utils/context';
import { Navigation } from 'react-native-navigation';
import { getProfileDataAction, getAllFavsAction } from '../actions/userActions';
import config from 'src/config';
import { NativeModules } from 'react-native';
const OppwaCore = NativeModules.RNOppwa;

const _storeData = async (name, payload) => {
  try {
    await AsyncStorage.setItem(name, payload);

  } catch (error) {
    // Error saving data
  }
};

const _retrieve = async (name, payload) => {
  try {
    const data = await AsyncStorage.getItem(name);
    if (data) {
      return data
    }
    return null;

  } catch (error) {
    // Error saving data
  }
};


function* loginMercahnts(action) {
  try {
    const response = yield call(Api.loginMerchantsCall, action.payload);
    if (response && response.data && response.data.token) {

      yield put({
        type: C.LOGIN_MERCHANTS_SUCCEEDED,
        payload: {
          token: response.data.token,
          merchant: response.data.user
        }
      });

      startApp();
    } else {
      yield put({
        type: C.LOGIN_MERCHANTS_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.LOGIN_MERCHANTS_FAILED,
      payload: e.message
    });
  }
}


function* restoreToken(action) {
  try {
    let token = yield call(_retrieve, 'merchantToken');
    let userToken = yield call(_retrieve, 'userToken');
    if (!token) {
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJYa2hBTGU2MHY4ZTJSWFhuVCIsImVtYWlsIjoiYm9iQGJvYi5jb20iLCJsb2dpbiI6dHJ1ZSwiaWF0IjoxNjAyNjIyOTY0LCJleHAiOjE2NjU3MzgxNjR9.2Ze9Zk8TlBzAy1xXdWZcyEVreMs_IhXANv8WQJ-5-LY" // bob demo old
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ5TTJiaFRRbmRxbGxQZEhnNyIsImVtYWlsIjoidm9sdW1lQGdtYWlsLmNvbSIsImxvZ2luIjp0cnVlLCJpYXQiOjE1OTc2ODM5MjgsImV4cCI6MTY2MDc5OTEyOH0.PFn3u2ju5PEWgeQEsiaYkDVlp0uHp09V8dad4QBE-Po"
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJxQlN6Z1VoVWpSUkljTFAyeiIsImVtYWlsIjoiYWxvb3NoYWxzaGV5YWIyMUBnbWFpbC5jb20iLCJsb2dpbiI6dHJ1ZSwiaWF0IjoxNjA0MDc4MzI2LCJleHAiOjE2NjcxOTM1MjZ9.j9fbN8Wkxlw1Y0tWnI7bObeJ9zBK9beRVUJbL7fl4Tc"
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJYa2hBTGU2MHY4ZTJSWFhuVCIsImVtYWlsIjoiYm9iQGJvYi5jb20iLCJsb2dpbiI6dHJ1ZSwiaWF0IjoxNjA2MTI3NjA1LCJleHAiOjE2NjkyNDI4MDV9._DNFkuB_Yv1oLX_kAnDSMtPTudYyL9BdbER0KATJF3s" // bob demo new
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJ5TTJiaFRRbmRxbGxQZEhnNyIsImVtYWlsIjoidm9sdW1lQGdtYWlsLmNvbSIsImxvZ2luIjp0cnVlLCJpYXQiOjE2MDYxMjc1ODYsImV4cCI6MTY2OTI0Mjc4Nn0.8S5jwJYakAYcElSdpSvrlVQB3PePdIKqybHhhITO69s" //volume new
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJxQlN6Z1VoVWpSUkljTFAyeiIsImVtYWlsIjoiYWxvb3NoYWxzaGV5YWIyMUBnbWFpbC5jb20iLCJsb2dpbiI6dHJ1ZSwiaWF0IjoxNjA2MTI3NjQ0LCJleHAiOjE2NjkyNDI4NDR9.hmuei-rJYUhV_dK13s7v0UZJ8YUUmhBO3rlNVTKGWoY" // zawaki new
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJDR1dLcXFwcVphTW9rZnRpdSIsImVtYWlsIjoidHVxYS5raGFzaGFybWVoQHNhbWVoZ3JvdXAuY29tIiwibG9naW4iOnRydWUsImlhdCI6MTYwNjE0NzkzMiwiZXhwIjoxNjY5MjYzMTMyfQ.HTCFVGKO1W8L9m8sbGZuecFarGKhqJT51pWyX5ghzug" // sameh
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJDR1dLcXFwcVphTW9rZnRpdSIsImVtYWlsIjoidHVxYS5raGFzaGFybWVoQHNhbWVoZ3JvdXAuY29tIiwibG9naW4iOnRydWUsImlhdCI6MTYwOTE3MTQzMSwiZXhwIjoxNjcyMjg2NjMxfQ.1j9s0yZ1MAQ6sYMmYjNN0er_q2Gub5b_5dO46SWi6W8" // sameh new
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJmVXNZNWhybU54OEFzWHluWCIsImVtYWlsIjoiSW5Cb3hAZ21haWwuY29tIiwibG9naW4iOnRydWUsImlhdCI6MTYwNzk1MzI0NSwiZXhwIjoxNjcxMDY4NDQ1fQ.mUlvNWjEnHkCbIffQ3r3-yJWB5Jrd4F_WR8wobyu8Lo" //inbox 
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4cFJkNzNMcmZjek1QWlJYNyIsImVtYWlsIjoiZnJpZXNAZ21haWwuY29tIiwibG9naW4iOnRydWUsImlhdCI6MTYwOTYwNzg5NiwiZXhwIjoxNjcyNzIzMDk2fQ.Nn_3vQXHYA6XtaEfWxwo7ljbDASWT4B1vxK6x38B1hE"
      token = config.token
    }
    if (userToken) {
      yield put(getProfileDataAction({ token: userToken }))
      token = userToken;
    }
    yield put(getCartAction({ token: token }))
    yield put(getAllFavsAction({ token: token }))
    const response = yield call(Api.configMerchantsCall, { token: token });
    if (response && response.data) {
      try {
        const storesplash_logo = yield call(_storeData, ('splash_logo' + config.GooglePackageName), response.data?.splash_logo)

      } catch (error) {

      }
      colors.init(response.data.colors)
      const parsingFeature = {}
      response.data.features.map(fet => {
        parsingFeature[fet.name] = true
      })
      if (parsingFeature?.['hyperpay_live']) {
        try {
          OppwaCore.initProd(true);
        } catch (error) {
          console.warn(error, "===")
        }

      }
      yield put({
        type: C.LOGIN_MERCHANTS_SUCCEEDED,
        payload: {
          token: token,
          merchant: {
            ...response.data,
            parsingFeature: parsingFeature
          },
          userLogin: userToken ? true : false
        }
      });
      startApp(parsingFeature);
    } else {
      yield put({
        type: C.LOGIN_MERCHANTS_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.LOGIN_MERCHANTS_FAILED,
      payload: e.message
    });
  }
}


function* changeLang(action) {
  try {
    context.changeCurrentLanguage(action.payload.lang)
    yield put({ type: C.CHANGE_LANG_SUCCEEDED, payload: {} })
    dismissOverlay(screenIds.CUSTOM_FOOTER)
    setDefaultOptions(action.payload.lang)
    Navigation.setRoot({
      root: {
        component: {
          name: screenIds.WELCOME_SCREEN,
          options: {
            topBar: {
              visible: false,
              drawBehind: true,
            },
            statusBar: {
              drawBehind: false,
              style: 'light',
            }
          }
        }
      },
    });

  } catch (e) {
    console.warn(e)
  }
}


function* merchantsSaga() {

  yield takeLatest(C.LOGIN_MERCHANTS_REQUESTED, loginMercahnts);
  yield takeLatest(C.RESTORE_MERCHANT_REQUESTED, restoreToken);
  yield takeLatest(C.CHANGE_LANG_REQUESTED, changeLang);


}

export default merchantsSaga;