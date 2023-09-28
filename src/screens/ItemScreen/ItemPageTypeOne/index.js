import { connect } from 'react-redux';
import ItemPageTypeOne from './ItemPageTypeOne';
import { loginMerchantsAction } from '../../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { addToCartDataSelector, cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { addToCartAction } from 'src/store/actions/cartActions';
import { favListSelector } from 'src/store/selectors/userSelectors';
import { addOrRemoveFavAction } from 'src/store/actions/userActions';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    addToCartData: addToCartDataSelector(state),
    favList: favListSelector(state),
    merchant: merchantSelector(state),
    cart: cartDetailsSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (payload) => dispatch(addToCartAction(payload)),
    addOrRemoveFav: (payload) => dispatch(addOrRemoveFavAction(payload))

  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ItemPageTypeOne);