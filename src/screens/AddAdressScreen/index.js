import { connect } from 'react-redux';
import AddAdressScreen from './AddAdressScreen';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { getAdressesAction, saveAddressAction } from 'src/store/actions/userActions';
import { addressesSelector, saveAddressSelector } from 'src/store/selectors/userSelectors';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    saveAddressSelector: saveAddressSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveAddress: (payload) => dispatch(saveAddressAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AddAdressScreen);