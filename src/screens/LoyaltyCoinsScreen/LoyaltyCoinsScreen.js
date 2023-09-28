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


class LoyaltyCoinsScreen extends PureComponent {
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
      dismissModal(screenIds.LOYALTY_COINS_SCREEN)
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
            dismissModal(screenIds.LOYALTY_COINS_SCREEN, true);
          }} style={{ flex: 1, }}>
          <TouchableOpacity
            onPress={null}
            style={{ flex: 1, paddingHorizontal: calWidth(16), justifyContent: 'center', alignItems: 'center', paddingBottom: calWidth(60) }}
            activeOpacity={1}>

            <View style={{ backgroundColor: '#E2211C', paddingHorizontal: calWidth(32), paddingVertical: calWidth(12), borderRadius: calWidth(32) }}>
              <Image source={require('assets/images/barcode.png')} style={{ tintColor: '#F2F2F2', marginBottom: calWidth(4) }} />
              <Text style={{ textAlign: 'center', fontSize: calWidth(16), color: '#F2F2F2' }}>{translations.get('loyalty').val()}</Text>
            </View>
            <View style={{ width: '100%', backgroundColor: '#F2F2F2', marginTop: -calWidth(40), zIndex: -2, borderRadius: calWidth(56), paddingTop: calWidth(20), paddingBottom: calWidth(32) }}>
              <Image source={require('assets/images/barcode1.png')} style={{ alignSelf: 'center' }} />
              <View style={{ paddingHorizontal: calWidth(64), }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: calWidth(8) }}>
                  <Text style={{ fontSize: calWidth(16), color: '#747474' }}>{translations.get('points').val() + " :"}</Text>
                  <Text style={{ fontSize: calWidth(16), color: '#747474' }}>{100}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    dismissModal(screenIds.LOYALTY_COINS_SCREEN, true)
                  }}
                  style={{ backgroundColor: '#E2211C', borderRadius: calWidth(12), paddingVertical: calWidth(16), justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: calWidth(16), color: '#FFFFFF' }}>{translations.get('Continue').val()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

        </TouchableOpacity>

      </View>
    );
  }
}

export default LoyaltyCoinsScreen;
