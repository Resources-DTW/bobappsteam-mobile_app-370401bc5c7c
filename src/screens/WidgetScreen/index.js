import { connect } from 'react-redux';
import WidgetScreen from './WidgetScreen';
const mapStateToProps = state => {
  return {


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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(WidgetScreen);