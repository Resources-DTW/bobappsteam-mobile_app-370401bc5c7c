import { connect } from 'react-redux';
import AccountScreen from './AccountScreen';
import { changeLangAction } from 'src/store/actions/merchantsActions';
import { notificationsSelector, userDataSelector } from 'src/store/selectors/userSelectors';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    userData: userDataSelector(state),
    merchant: merchantSelector(state),
    notifications: notificationsSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeLang: (payload) => dispatch(changeLangAction(payload)),
    showHideFooterAction: (payload) => dispatch(showHideFooterAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AccountScreen);