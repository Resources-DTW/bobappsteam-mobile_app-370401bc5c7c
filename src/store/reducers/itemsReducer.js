import C from '../constants';
import { fromJS } from 'immutable';
const items = {
  pending: false,
  success: false,
  error: null,
  list: []
}
const defaultState = fromJS({
  items: { ...items }
});

const item = (state = defaultState, action) => {
  switch (action.type) {
    case C.GET_ITEMS_REQUESTED:
      return state.merge({
        items: { ...items, pending: true }
      })
    case C.GET_ITEMS_SUCCEEDED:
      return state.merge({
        items: {
          ...items,
          success: true,
          list: action.payload.items
        }

      })
    case C.GET_ITEMS_FAILED:
      return state.merge({
        items: { ...items, error: action.payload }
      })
    case C.LOGOUT_SUCCEEDED:
      return state.merge({
        items: { ...items }
      })
    default:
      return state
  }
};

export default item;