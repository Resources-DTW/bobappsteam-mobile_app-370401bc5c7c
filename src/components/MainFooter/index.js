import { connect } from 'react-redux';
import MainFooter from './MainFooter';
import { showHideSelector } from 'src/store/selectors/menuSelectors';
import { indexingSelector, notificationsSelector } from 'src/store/selectors/userSelectors';
import { changeSelectedMenuAction } from 'src/store/actions/userActions';
import { merchantSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    showHide: showHideSelector(state),
    indexing: indexingSelector(state),
    notifications: notificationsSelector(state),
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MainFooter);