import { connect } from 'react-redux';
import OrderDetailsScreen from './OrderDetailsScreen';
import { loginMerchantsAction, restoreMerchantAction } from '../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { indexingSelector } from 'src/store/selectors/userSelectors';
const mapStateToProps = state => {
  return {
    merchant: merchantSelector(state),
    token: tokenSelector(state),
    indexing: indexingSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    restoreMerchant: (payload) => dispatch(restoreMerchantAction(payload)),

  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderDetailsScreen);