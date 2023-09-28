import { connect } from 'react-redux';
import MyOrdersScreen from './MyOrdersScreen';
import { changeLangAction } from 'src/store/actions/merchantsActions';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { myOrdersSelector } from 'src/store/selectors/cartSelectors';
import { getMyOrdersAction } from 'src/store/actions/cartActions';
import { changeSelectedMenuAction } from 'src/store/actions/userActions';
import { showHideFooterAction } from 'src/store/actions/menuActions';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    myOrders: myOrdersSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeLang: (payload) => dispatch(changeLangAction(payload)),
    getMyOrders: (payload) => dispatch(getMyOrdersAction(payload)),
    changeSelectedMenu: (payload) => dispatch(changeSelectedMenuAction(payload)),
    showHideFooterAction: (payload) => dispatch(showHideFooterAction(payload)),
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MyOrdersScreen);