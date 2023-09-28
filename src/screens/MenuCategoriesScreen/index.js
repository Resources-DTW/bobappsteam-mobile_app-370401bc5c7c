import { connect } from 'react-redux';
import MenuCategoriesScreen from './MenuCategoriesScreen';
import { loginMerchantsAction, restoreMerchantAction } from '../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { getMenuCategoriesAction, showHideFooterAction } from 'src/store/actions/menuActions';
import { menuCategoriesSelector } from 'src/store/selectors/menuSelectors';
const mapStateToProps = state => {
  return {
    merchant: merchantSelector(state),
    menuCategories: menuCategoriesSelector(state),
    token: tokenSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreMerchant: (payload) => dispatch(restoreMerchantAction(payload)),
    getMenuCategories: (payload) => dispatch(getMenuCategoriesAction(payload)),
    showHideFooterAction: (payload) => dispatch(showHideFooterAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MenuCategoriesScreen);