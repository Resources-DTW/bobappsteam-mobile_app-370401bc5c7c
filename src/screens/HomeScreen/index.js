import { connect } from 'react-redux';
import HomeScreen from './HomeScreen';
import { loginMerchantsAction } from '../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { changeSelectedMenuAction, getNotificationsAction } from 'src/store/actions/userActions';
import { menuCategoriesSelector } from 'src/store/selectors/menuSelectors';
import { goToCategoryAction, showHideFooterAction } from 'src/store/actions/menuActions';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    menuCategories: menuCategoriesSelector(state),
    merchant: merchantSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSelectedMenu: (payload) => dispatch(changeSelectedMenuAction(payload)),
    goToCategory: (payload) => dispatch(goToCategoryAction(payload)),
    showHideFooterAction: (payload) => dispatch(showHideFooterAction(payload)),
    getNotification: (payload) => dispatch(getNotificationsAction(payload)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(HomeScreen);