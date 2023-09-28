import { connect } from 'react-redux';
import OrderHome from './OrderHome';
import { changeSelectedMenuAction } from 'src/store/actions/userActions';
import { getMyOrdersAction } from 'src/store/actions/cartActions';
import { tokenSelector } from 'src/store/selectors/merchantsSelectors';
import { myOrdersSelector } from 'src/store/selectors/cartSelectors';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    myOrders: myOrdersSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeSelectedMenu: (payload) => dispatch(changeSelectedMenuAction(payload)),
    getMyOrders: (payload) => dispatch(getMyOrdersAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderHome);