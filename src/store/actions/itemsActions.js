import C from '../constants';

const getItemsAction = payload => {
  return {
    type: C.GET_ITEMS_REQUESTED,
    payload
  }
};

export {
  getItemsAction,
};