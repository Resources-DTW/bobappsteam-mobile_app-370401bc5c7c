import { connect } from 'react-redux';
import FilterScreen from './FilterScreen';
import { cartDetailsSelector } from 'src/store/selectors/cartSelectors';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import { menuCategoriesSelector } from 'src/store/selectors/menuSelectors';
const mapStateToProps = state => {
  return {
    menuCategories: menuCategoriesSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showHideFooter: (payload) => dispatch(showHideFooterAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(FilterScreen);