import { connect } from 'react-redux';
import MenuSubCategoriesScreen from './MenuSubCategoriesScreen';
import { loginMerchantsAction, restoreMerchantAction } from '../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { showHideFooterAction } from 'src/store/actions/menuActions';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    merchant: merchantSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreMerchant: (payload) => dispatch(restoreMerchantAction(payload)),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MenuSubCategoriesScreen);