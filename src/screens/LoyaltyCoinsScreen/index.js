import { connect } from 'react-redux';
import LoyaltyCoinsScreen from './LoyaltyCoinsScreen';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { indexingSelector } from 'src/store/selectors/userSelectors';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    cartCount: cartDetailsSelector(state).items.length,
    indexing: indexingSelector(state),
    token: tokenSelector(state),

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LoyaltyCoinsScreen);