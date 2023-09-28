import { all, fork } from 'redux-saga/effects';
import merchantsSaga from './merchantsSaga';
import itemSaga from './itemSaga';
import menuSaga from './menuSaga';
import cartSaga from './cartSaga';
import userSaga from './userSaga';

function* rootSaga() {
  yield all([
    fork(merchantsSaga),
    fork(itemSaga),
    fork(menuSaga),
    fork(cartSaga),
    fork(userSaga),
  ]);
}
export default rootSaga;