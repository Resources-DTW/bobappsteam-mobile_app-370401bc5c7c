import { connect } from 'react-redux';
import { getCartAction, getMyOrdersAction } from 'src/store/actions/cartActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { indexingSelector } from 'src/store/selectors/userSelectors';
import OnlinePaymentScreen from './OnlinePaymentScreen';

const mapStateToProps = state => {
  return {
    // token: checkCodeLoginSelector(state).token,
    token: tokenSelector(state),
    indexing: indexingSelector(state),
    merchant: merchantSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {

    getCart: (payload) => dispatch(getCartAction(payload)),
    getMyOrders: (payload) => dispatch(getMyOrdersAction(payload))

  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OnlinePaymentScreen);