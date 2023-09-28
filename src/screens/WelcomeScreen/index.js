import { connect } from 'react-redux';
import WelcomeScreen from './WelcomeScreen';
import { changeLangAction, loginMerchantsAction, restoreMerchantAction } from '../../store/actions/merchantsActions';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    merchant: merchantSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreMerchant: (payload) => dispatch(restoreMerchantAction(payload)),
    changeLang: (payload) => dispatch(changeLangAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WelcomeScreen);