import { connect } from 'react-redux';
import CardTypeThree from './CardTypeThree';
import { favListSelector } from 'src/store/selectors/userSelectors';
import { addOrRemoveFavAction } from 'src/store/actions/userActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { addToCartAction } from 'src/store/actions/cartActions';
import { addToCartDataSelector } from 'src/store/selectors/cartSelectors';
const mapStateToProps = state => {
  return {
    favList: favListSelector(state),
    token: tokenSelector(state),
    addToCartData: addToCartDataSelector(state),
    merchant: merchantSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    addOrRemoveFav: (payload) => dispatch(addOrRemoveFavAction(payload)),
    addToCart: (payload) => dispatch(addToCartAction(payload)),

  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CardTypeThree);