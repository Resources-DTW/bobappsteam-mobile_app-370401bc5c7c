import { connect } from 'react-redux';
import CartScreen from './CartScreen';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { tokenSelector, merchantSelector } from 'src/store/selectors/merchantsSelectors';
import { userLoginSelector, indexingSelector, userDataSelector } from 'src/store/selectors/userSelectors';
import { changeSelectedMenuAction } from 'src/store/actions/userActions';
import { getCartAction } from 'src/store/actions/cartActions';
const mapStateToProps = state => {
  return {
    cart: cartDetailsSelector(state),
    token: tokenSelector(state),
    merchant: merchantSelector(state),
    userLogin: userLoginSelector(state),
    indexing: indexingSelector(state),
    user: userDataSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSelectedMenu: (payload) => dispatch(changeSelectedMenuAction(payload)),
    getCart: (payload) => dispatch(getCartAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CartScreen);