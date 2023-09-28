import { connect } from 'react-redux';
import VerticalItemsCarosel from './VerticalItemsCarosel';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    cartCount: cartDetailsSelector(state).items ? cartDetailsSelector(state).items.length : 0,
    merchant: merchantSelector(state),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VerticalItemsCarosel);