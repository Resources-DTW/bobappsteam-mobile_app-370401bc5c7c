import { connect } from 'react-redux';
import SearchScreen from './SearchScreen';
import { loginMerchantsAction } from '../../store/actions/merchantsActions';
import { merchantSelector, tokenSelector } from 'src/store/selectors/merchantsSelectors';
const mapStateToProps = state => {
  return {
    token: tokenSelector(state),
    merchant: merchantSelector(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SearchScreen);