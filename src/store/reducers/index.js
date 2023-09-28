import { combineReducers } from 'redux';
import merchants from './merchantsReducer';
import item from './itemsReducer';
import menu from './menuReducer';
import cart from './cartReducer';
import user from './userReducer';

export default combineReducers({
  merchants,
  item,
  menu,
  cart,
  user,
});