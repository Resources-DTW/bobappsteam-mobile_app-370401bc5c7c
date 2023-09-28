import { call, put, takeLatest, takeEvery, all } from 'redux-saga/effects';
import C from '../constants';
import { Api } from '../../services';
import { startApp } from '../../navigation';

function* getItems(action) {
  try {
    const response = yield call(Api.getItemsCall, action.payload);
    if (response && response.data && response.data.data) {
      yield put({
        type: C.GET_ITEMS_SUCCEEDED,
        payload: {
          items: response.data.data || [],
        }
      });
    } else {
      yield put({
        type: C.GET_ITEMS_FAILED,
        payload: response.data.message
      });
    }

  } catch (e) {
    yield put({
      type: C.GET_ITEMS_FAILED,
      payload: e.message
    });
  }
}

function* itemSaga() {

  yield takeLatest(C.GET_ITEMS_REQUESTED, getItems);


}

export default itemSaga;