import { connect } from 'react-redux';
import MyFavScreen from './MyFavScreen';
import { getMenuCategoriesAction, getItemsByCategoryAction } from '../../store/actions/menuActions';
import { menuCategoriesSelector } from 'src/store/selectors/menuSelectors';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { fullFavListSelector } from 'src/store/selectors/userSelectors';
import { getAllFavsAction } from 'src/store/actions/userActions';
const mapStateToProps = state => {
  return {
    fullFavList: fullFavListSelector(state),
    token: tokenSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMenuCategories: (payload) => dispatch(getMenuCategoriesAction(payload)),
    getItemsByCategory: (payload) => dispatch(getItemsByCategoryAction(payload)),
    getAllFav: (payload) => dispatch(getAllFavsAction(payload)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyFavScreen);