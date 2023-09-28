import { connect } from 'react-redux';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
import HorizontalCarosel from './HorizontalCarosel';
const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HorizontalCarosel);