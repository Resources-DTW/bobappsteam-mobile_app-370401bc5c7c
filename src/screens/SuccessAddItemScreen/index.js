import { connect } from 'react-redux';
import SuccessAddItemScreen from './SuccessAddItemScreen';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { indexingSelector } from 'src/store/selectors/userSelectors';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    cartCount: cartDetailsSelector(state).items.length,
    indexing: indexingSelector(state),
    merchant: merchantSelector(state),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SuccessAddItemScreen);