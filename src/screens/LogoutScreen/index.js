import { connect } from 'react-redux';
import LogoutScreen from './LogoutScreen';
import { loginMerchantsAction, restoreMerchantAction } from '../../store/actions/merchantsActions';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
import { logoutAction } from 'src/store/actions/userActions';
const mapStateToProps = state => {
  return {
    merchant: merchantSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreMerchant: (payload) => dispatch(restoreMerchantAction(payload)),
    logout: (payload) => dispatch(logoutAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LogoutScreen);