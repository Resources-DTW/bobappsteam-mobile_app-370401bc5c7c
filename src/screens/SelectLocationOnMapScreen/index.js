import { connect } from 'react-redux';
import SelectLocationOnMapScreen from './SelectLocationOnMapScreen';

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SelectLocationOnMapScreen);