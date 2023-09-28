import { connect } from 'react-redux';
import Header from './Header';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    cartCount: cartDetailsSelector(state).items ? cartDetailsSelector(state).items.length : 0,
    cart: cartDetailsSelector(state),
    merchant: merchantSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Header);