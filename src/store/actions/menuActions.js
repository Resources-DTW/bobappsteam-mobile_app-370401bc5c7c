import C from '../constants';

const getMenuCategoriesAction = payload => {
  return {
    type: C.GET_MENU_CATEGORIES_REQUESTED,
    payload
  }
};

const getItemsByCategoryAction = payload => {
  return {
    type: C.GET_ITEMS_BY_CATEGORY_REQUESTED,
    payload
  }
};

const showHideFooterAction = payload => {
  return {
    type: C.SHOW_HIDE_FOOTER_REQUESTED,
    payload
  }
};

const goToCategoryAction = payload => {
  return {
    type: C.GO_TO_CATEGORY_REQUESTED,
    payload
  }
};


export {
  getMenuCategoriesAction,
  getItemsByCategoryAction,
  showHideFooterAction,
  goToCategoryAction,
};