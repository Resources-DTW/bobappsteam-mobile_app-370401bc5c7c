import { connect } from 'react-redux';
import MainCard from './MainCard';
import { favListSelector } from 'src/store/selectors/userSelectors';
import { addOrRemoveFavAction } from 'src/store/actions/userActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    favList: favListSelector(state),
    token: tokenSelector(state),
    merchant: merchantSelector(state),


  };
};

const mapDispatchToProps = dispatch => {
  return {
    addOrRemoveFav: (payload) => dispatch(addOrRemoveFavAction(payload))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MainCard);