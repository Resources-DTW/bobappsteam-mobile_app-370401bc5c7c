import { connect } from 'react-redux';
import CheckoutScreen from './CheckoutScreen';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { tokenSelector, merchantSelector } from 'src/store/selectors/merchantsSelectors';
import { userLoginSelector, addressesSelector, indexingSelector } from 'src/store/selectors/userSelectors';
import { getAdressesAction } from 'src/store/actions/userActions';
import { getCartAction, getMyOrdersAction } from 'src/store/actions/cartActions';
const mapStateToProps = state => {
  return {
    cart: cartDetailsSelector(state),
    token: tokenSelector(state),
    merchant: merchantSelector(state),
    userLogin: userLoginSelector(state),
    addresses: addressesSelector(state),
    indexing: indexingSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAdresses: (payload) => dispatch(getAdressesAction(payload)),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CheckoutScreen);