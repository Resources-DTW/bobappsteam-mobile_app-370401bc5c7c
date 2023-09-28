import { connect } from 'react-redux';
import EditProfileScreen from './EditProfileScreen';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { getProfileDataAction } from 'src/store/actions/userActions';

const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    merchant: merchantSelector(state),


  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfileData: (payload) => dispatch(getProfileDataAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EditProfileScreen);