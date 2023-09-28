import { connect } from 'react-redux';
import CartCard from './CartCard';
import { editCartItemAction, getCartAction, removeFromCartAction } from 'src/store/actions/cartActions';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    cart: cartDetailsSelector(state),
    token: tokenSelector(state),
    merchant: merchantSelector(state),


  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeFromCart: (payload) => dispatch(removeFromCartAction(payload)),
    getCart: (payload) => dispatch(getCartAction(payload)),
    editCartItem: (payload) => dispatch(editCartItemAction(payload)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CartCard);