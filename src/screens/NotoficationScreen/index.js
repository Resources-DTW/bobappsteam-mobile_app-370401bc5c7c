import { connect } from 'react-redux';
import NotoficationScreen from './NotoficationScreen';
import { tokenSelector, merchantSelector } from 'src/store/selectors/merchantsSelectors';
import { getAdressesAction, getNotificationsAction } from 'src/store/actions/userActions';
import { addressesSelector } from 'src/store/selectors/userSelectors';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    addresses: addressesSelector(state),
    merchant: merchantSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAdresses: (payload) => dispatch(getAdressesAction(payload)),
    getNotifications: (payload) => dispatch(getNotificationsAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NotoficationScreen);