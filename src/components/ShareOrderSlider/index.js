import { connect } from 'react-redux';
import { changeSelectedMenuAction } from 'src/store/actions/userActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import ShareOrderSlider from './ShareOrderSlider';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    merchant: merchantSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSelectedMenu: (payload) => dispatch(changeSelectedMenuAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ShareOrderSlider);