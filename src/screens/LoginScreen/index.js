import { connect } from 'react-redux';
import LoginScreen from './LoginScreen';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { loginAction, getProfileDataAction } from 'src/store/actions/userActions';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state)

  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (payload) => dispatch(loginAction(payload)),
    getProfileDataAction: (payload) => dispatch(getProfileDataAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(LoginScreen);