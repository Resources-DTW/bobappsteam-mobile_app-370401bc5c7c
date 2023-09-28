import C from '../constants';
import { fromJS } from 'immutable';
const addresses = {
  pending: false,
  success: false,
  error: null,
  list: []
}

const saveAddress = {
  pending: false,
  success: false,
  error: null,
  list: [],
  data: {}
}

const indexing = {
  pending: false,
  success: false,
  error: null,
  index: 0
}


const userData = {
  pending: false,
  success: false,
  error: null,
  data: {}
}

const favList = {
}


const fullFavList = {
  pending: false,
  success: false,
  error: null,
  list: []
}

const notifications = {
  pending: false,
  success: false,
  error: null,
  list: []
}


const defaultState = fromJS({
  userLogin: false,
  addresses: { ...addresses },
  saveAddress: { ...saveAddress },
  indexing: { ...indexing },
  userData: { ...userData },
  favList: { ...favList },
  fullFavList: { ...fullFavList },

});

const user = (state = defaultState, action) => {
  switch (action.type) {
    case C.GET_NOTIFICATION_REQUESTED:
      return state.merge({
        notifications: {
          ...notifications,
          pending: true
        },
      })
    case C.GET_NOTIFICATION_SUCCEEDED:
      return state.merge({
        notifications: {
          ...notifications,
          success: true,
          list: action.payload
        }
      })
    case C.GET_NOTIFICATION_FAILED:
      return state.merge({
        notifications: {
          ...notifications,
          error: true
        }
      })
    case C.GET_ALL_FAVS_REQUESTED:
      return state.merge({
        fullFavList: {
          ...fullFavList,
          pending: true
        },
      })
    case C.GET_ALL_FAVS_SUCCEEDED:
      return state.merge({
        favList: {
          ...action.payload.favs
        },
        fullFavList: {
          ...fullFavList,
          success: true,
          list: action.payload.list
        }
      })
    case C.GET_ALL_FAVS_FAILED:
      return state.merge({
        fullFavList: {
          ...fullFavList,
          error: true
        }
      })

    case C.ADD_OR_REMOVE_FAV_REQUESTED:
      const favs = state.get('favList')
      const fullFavs2 = state.get('fullFavList').list || []
      return state.merge({
        favList: {
          ...favs,
          [action.payload.id]: action.payload.add ? true : false,
        },
        fullFavList: {
          ...fullFavList,
          success: true,
          list: action.payload.add ? fullFavs2 : fullFavs2.filter(fav => fav._id != action.payload.id)
        }
      })
    case C.ADD_OR_REMOVE_FAV_SUCCEEDED:
      const fullFavs = state.get('fullFavList').list || []
      const favs2 = state.get('favList')
      return state.merge({
        favList: {
          ...favs2,
          ...action.payload.item
        },
        fullFavList: {
          ...fullFavList,
          success: true,
          list: action.payload.add ? [
            ...fullFavs,
            { ...action.payload.details }
          ] : fullFavs.filter(fav => fav._id != action.payload.id)
        }
      })
    case C.GET_PROFILE_DATA_REQUESTED:
      return state.merge({
        userData: {
          ...userData,
          pending: true,
          success: false,
        }
      })
    case C.GET_PROFILE_DATA_SUCCEEDED:
      return state.merge({
        userData: {
          ...userData,
          data: action.payload,
          success: true
        }
      })
    case C.GET_PROFILE_DATA_FAILED:
      return state.merge({
        userData: {
          ...userData,
          error: true
        }
      })

    case C.CHANGE_LANG_REQUESTED:
      return state.merge({
        indexing: {
          ...indexing
        }
      })
    case C.CHANGE_SELECTED_MENU_REQUESTED:
      return state.merge({
        indexing: {
          ...indexing,
          pending: true,
          success: false,
          sss: true
        }
      })
    case C.CHANGE_SELECTED_MENU_SUCCEEDED:
      return state.merge({
        indexing: {
          ...indexing,
          index: action.payload,
          success: true
        }
      })
    case C.CHANGE_SELECTED_MENU_FAILED:
      return state.merge({
        indexing: {
          ...indexing,
          error: true
        }
      })
    case C.SAVE_ADDRESS_REQUESTED:
      return state.merge({
        saveAddress: {
          ...saveAddress,
          pending: true
        }
      })
    case C.SAVE_ADDRESS_SUCCEEDED:
      return state.merge({
        saveAddress: {
          ...saveAddress,
          success: true,
          data: action.payload
        }
      })
    case C.SAVE_ADDRESS_FAILED:
      return state.merge({
        saveAddress: {
          ...saveAddress,
          error: true
        }
      })
    case C.GET_ADDRESSE_REQUESTED:
      const add = state.get('addresses')
      return state.merge({
        addresses: {
          ...addresses,
          ...add,
          success: false,
          pending: true
        }
      })
    case C.GET_ADDRESSE_SUCCEEDED:
      return state.merge({
        addresses: {
          ...addresses,
          success: true,
          list: action.payload
        }
      })
    case C.GET_ADDRESSE_FAILED:
      return state.merge({
        addresses: {
          ...addresses,
          error: true
        }
      })
    case C.LOGIN_MERCHANTS_SUCCEEDED:
      return state.merge({
        userLogin: action.payload.userLogin,
      })
    case C.LOGIN_REQUESTED:
      return state.merge({
        userLogin: false,
      })
    case C.LOGIN_SUCCEEDED:
      return state.merge({
        userLogin: true,
      })
    case C.LOGIN_FAILED:
      return state.merge({
        userLogin: false,
      })
    case C.LOGOUT_SUCCEEDED:
      return state.merge({
        userLogin: false,
        addresses: { ...addresses },
        saveAddress: { ...saveAddress },
        indexing: { ...indexing },
        userData: { ...userData },
        favList: {},
        fullFavList: { ...fullFavList },
      })
    default:
      return state
  }
};

export default user;