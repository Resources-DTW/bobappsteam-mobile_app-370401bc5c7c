// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissModal, screenIds, popToRoot, dismissAllModals, showModal } from '../../navigation';
import { Header, Container } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import CartScreen from '../CartScreen';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { OverLay } from 'src/components/OverLay';
import { Api } from 'src/services';


class RateAndReviewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeToCartScreen: false,
      rating: 1,
      loading: false,
      comment: ''
    }
  }
  componentDidMount() {

  }

  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }

  ratingCompleted = (rating) => {
    this.setState({
      rating: rating
    })
  }

  handleSubmit = async () => {
    this.setState({
      loading: true
    })
    const response = await Api.rateItemCall({
      id: this.props.item._id,
      comment: this.state.comment,
      rate_value: this.state.rating,
      token: this.props.token
    });
    if (response && response?.data?._id) {
      this.setState({
        loading: false
      })
      dismissModal(screenIds.RATE_AND_REVIEW_SCREEN)
    } else {
      this.setState({
        loading: false
      })
      alert(response?.data?.message ? response?.data?.message : translations.get('something_worng').val())
    }

  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            dismissModal(screenIds.RATE_AND_REVIEW_SCREEN);
            Keyboard.dismiss()
          }} style={{ flex: 1, paddingHorizontal: calWidth(16), justifyContent: 'center', alignItems: 'center', paddingBottom: calWidth(60) }}>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              borderRadius: calWidth(16),
              padding: calWidth(16),
              justifyContent: 'space-between',
            }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: calWidth(8) }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#1D2935' }}>{translations.get('Review').val()}</PoppinsRegular>
              <TouchableOpacity onPress={() => {
                dismissModal(screenIds.RATE_AND_REVIEW_SCREEN)
              }}>
                <Image source={require('assets/icons/close_btn.png')} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{ height: calWidth(80), borderRadius: calWidth(8), padding: calWidth(8), borderWidth: 1, borderColor: Colors.mainColor1, marginBottom: calWidth(8) }}
              multiline={true}
              placeholder={translations.get('review_text').val()}
              onChangeText={(text) => this.setState({ comment: text })}
              value={this.state.comment}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: calWidth(8) }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#1D2935' }}>{translations.get('Review').val()}</PoppinsRegular>
              <View />
            </View>

            <Rating
              type='custom'
              ratingColor={Colors.mainColor1}
              ratingBackgroundColor={Colors.mainColor2}
              ratingCount={5}
              tintColor="#fff"
              minValue={1}
              startingValue={1}
              onFinishRating={this.ratingCompleted}
            />

            <TouchableOpacity
              onPress={this.handleSubmit}
              style={{
                width: '100%', marginTop: calWidth(24), height: calWidth(40),
                backgroundColor: Colors.mainColor1,
                borderRadius: calWidth(8),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <PoppinsRegular style={{ fontSize: calWidth(15), color: '#fff' }}>
                {translations.get('submit').val()}
              </PoppinsRegular>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
        {this.state.loading ? <OverLay /> : null}

      </View>
    );
  }
}

export default RateAndReviewScreen;
