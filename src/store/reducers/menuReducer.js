import C from '../constants';
import { fromJS } from 'immutable';
const categories = {
  pending: false,
  success: false,
  error: null,
  list: []
}
const items = {
  pending: false,
  success: false,
  error: null,
  list: []
}

const selectedCat = {
  pending: false,
  success: false,
  error: null,
  cat: {}
}

const defaultState = fromJS({
  categories: { ...categories },
  items: { ...items },
  showHide: true,
  selectedCat: { ...selectedCat }
});

const menu = (state = defaultState, action) => {
  switch (action.type) {
    case C.GO_TO_CATEGORY_REQUESTED:
      return state.merge({
        selectedCat: {
          ...selectedCat,
          pending: true
        }
      })
    case C.GO_TO_CATEGORY_SUCCEEDED:
      return state.merge({
        selectedCat: {
          ...selectedCat,
          success: true,
          cat: action.payload
        }
      })
    case C.GO_TO_CATEGORY_FAILED:
      return state.merge({
        selectedCat: {
          ...selectedCat,
          error: true
        }

      })

    case C.SHOW_HIDE_FOOTER_REQUESTED:
      return state.merge({
        showHide: action.payload
      })
    case C.GET_MENU_CATEGORIES_REQUESTED:
      return state.merge({
        categories: {
          ...categories,
          pending: true
        }
      })
    case C.GET_MENU_CATEGORIES_SUCCEEDED:
      return state.merge({
        categories: {
          ...categories,
          success: true,
          list: action.payload.categories
        }

      })
    case C.GET_MENU_CATEGORIES_FAILED:
      return state.merge({
        categories: { ...categories, error: action.payload }
      })

    case C.GET_ITEMS_BY_CATEGORY_REQUESTED:
      return state.merge({
        items: {
          ...state.get('items'),
          [action.payload.category_id]: {
            ...items,
            pending: true,
          }

        }
      })
    case C.GET_ITEMS_BY_CATEGORY_SUCCEEDED:
      return state.merge({
        items: {
          ...state.get('items'),
          [action.payload.category_id]: {
            ...items,
            success: true,
            list: action.payload.items,
          }
        }

      })
    case C.GET_ITEMS_BY_CATEGORY_FAILED:
      return state.merge({
        items: {
          ...state.get('items'),

          [action.payload.category_id]: {
            ...items,
            error: action.payload.error
          }
        }
      })

    default:
      return state
  }
};

export default menu;