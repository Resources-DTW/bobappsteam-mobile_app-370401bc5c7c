import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import C from '../constants';
import { Api } from '../../services';
import { startApp, popToRoot, screenIds } from '../../navigation';
import { Navigation } from 'react-native-navigation';
import { changeSelectedMenuAction } from '../actions/userActions';

function* getMenuCategories(action) {
  try {
    const response = yield call(Api.getCateogriesCall, action.payload);
    if (response && response.data && response.data.data) {
      yield put({
        type: C.GET_MENU_CATEGORIES_SUCCEEDED,
        payload: {
          categories: response.data.data || [],
        }
      });
    } else {
      yield put({
        type: C.GET_MENU_CATEGORIES_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_MENU_CATEGORIES_FAILED,
      payload: e.message
    });
  }
}

function* getItemsByCategory(action) {
  try {
    const response = yield call(Api.getItemsByCategoryCall, action.payload);
    if (response && response.data && response.data.data) {
      yield put({
        type: C.GET_ITEMS_BY_CATEGORY_SUCCEEDED,
        payload: {
          items: response.data.data || [],
          category_id: action.payload.category_id
        }
      });
    } else {
      yield put({
        type: C.GET_ITEMS_BY_CATEGORY_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_ITEMS_BY_CATEGORY_FAILED,
      payload: e.message
    });
  }
}

function* goToCategory(action) {
  try {
    // popToRoot(screenIds.MENU_SCREEN)
    yield put(changeSelectedMenuAction({ index: 2 }))
    yield put({
      type: C.GO_TO_CATEGORY_SUCCEEDED,
      payload: action.payload.cat
    });

  } catch (e) {
    yield put({
      type: C.GO_TO_CATEGORY_FAILED,
      payload: {}
    });
  }
}


function* itemSaga() {

  yield takeLatest(C.GET_MENU_CATEGORIES_REQUESTED, getMenuCategories);
  yield takeLatest(C.GET_ITEMS_BY_CATEGORY_REQUESTED, getItemsByCategory);
  yield takeLatest(C.GO_TO_CATEGORY_REQUESTED, goToCategory);


}

export default itemSaga;