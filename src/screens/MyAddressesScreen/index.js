import { connect } from 'react-redux';
import MyAddressesScreen from './MyAddressesScreen';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { getAdressesAction } from 'src/store/actions/userActions';
import { addressesSelector } from 'src/store/selectors/userSelectors';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    addresses: addressesSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAdresses: (payload) => dispatch(getAdressesAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyAddressesScreen);