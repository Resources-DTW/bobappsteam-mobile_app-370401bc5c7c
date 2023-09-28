import { connect } from 'react-redux';
import CategoryScreen from './CategoryScreen';
import { getMenuCategoriesAction, getItemsByCategoryAction } from '../../store/actions/menuActions';
import { menuCategoriesSelector } from 'src/store/selectors/menuSelectors';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    menuCategories: menuCategoriesSelector(state),
    token: tokenSelector(state),
    merchant: merchantSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMenuCategories: (payload) => dispatch(getMenuCategoriesAction(payload)),
    getItemsByCategory: (payload) => dispatch(getItemsByCategoryAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CategoryScreen);