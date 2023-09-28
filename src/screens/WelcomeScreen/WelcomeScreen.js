// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground, TextInput, TouchableOpacity, Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import { dimensionsCalculation } from '../ImageViewScreen/ImageViewScreen';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { Api } from 'src/services';
import { OverLay } from 'src/components/OverLay';
import AsyncStorage from '@react-native-community/async-storage'
import translations from 'src/localization/Translations';
import context from 'src/utils/context';
import config from 'src/config';

class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstTime: null,
      password: '',
      email: '',
      loading: true,
      checkLang: false,
      image: ''
    }
  }

  componentDidMount() {
    this.getImage()
    setTimeout(() => {
      if (config.testing) {
        this.getMerchantToken();
      } else {
        this.checkLang();
      }
      // this.props.restoreMerchant({});
    }, 2000);

  }
  getImage = () => {
    AsyncStorage.getItem('splash_logo' + config.GooglePackageName).then(result => {
      if (result) {
        this.setState({ image: result })
      }
    })
  }
  getMerchantToken = async () => {
    const data = await AsyncStorage.getItem('merchantToken');
    if (data) {
      this.props.restoreMerchant({})
    } else {
      this.setState({
        firstTime: true,
        loading: false
      })
    }
  }

  checkLang = async () => {
    const language = await AsyncStorage.getItem('language');
    if (language) {
      this.props.restoreMerchant({})
    } else {
      this.setState({
        checkLang: true,
      })
    }
  }


  handleCall = async () => {
    this.setState({
      loading: true
    })
    const response = await Api.merchantsLoginCall({
      email: this.state.email,
      password: this.state.password
    })
    if (response && response.data && response.data.token) {
      const res = await Api.merchantsMainInfoCall({ _id: response.data?.merchant_info?._id, token: response.data.token });
      await AsyncStorage.setItem('merchantToken', res.data.token);
      this.props.restoreMerchant({})
    } else {
      alert(response.data.message ? response.data.message : 'something went wrong')
      this.setState({
        loading: false
      })
    }
  }
  render() {
    if (this.state.firstTime) {
      return (
        <View style={{ width: '100%', height: '100%', backgroundColor: '#fff', justifyContent: 'center', padding: calHeight(16) }} >

          <PoppinsMediam style={{ fontSize: calHeight(16), textAlign: 'center' }}>Welcome to Bob Demo</PoppinsMediam>
          <PoppinsRegular style={{ fontSize: calHeight(14), textAlign: 'center', marginBottom: calHeight(16) }}>Please Enter demo email and password</PoppinsRegular>
          <TextInput
            style={{ height: calHeight(50), borderRadius: calHeight(5), borderWidth: 1, borderColor: '#ccc', paddingHorizontal: calHeight(10), fontSize: calHeight(14), marginBottom: 16 }}
            placeholder="email"
            value={this.state.email}
            onChangeText={(text) => {
              this.setState({
                email: text
              })
            }}
          />
          <TextInput
            style={{ height: calHeight(50), borderRadius: calHeight(5), borderWidth: 1, borderColor: '#ccc', paddingHorizontal: calHeight(10), fontSize: calHeight(14), marginBottom: 16 }}
            placeholder="password"
            value={this.state.password}
            onChangeText={(text) => {
              this.setState({
                password: text
              })
            }}
          />

          <TouchableOpacity
            onPress={this.handleCall}
            style={{
              width: calHeight(120),
              height: calHeight(50),
              backgroundColor: config.color,
              // borderWidth: calHeight(5),
              // borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: calHeight(5),
              alignSelf: 'center',
              marginBottom: calHeight(8)
            }}>
            <PoppinsBold style={{ fontSize: calHeight(16), textAlign: 'center', color: '#fff', }}>Go!</PoppinsBold>

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.restoreMerchant({})}
            style={{
              width: calHeight(120),
              height: calHeight(50),
              borderColor: config.color,
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: calHeight(5),
              alignSelf: 'center',
              marginBottom: calHeight(32)
            }}>
            <PoppinsBold style={{ fontSize: calHeight(16), textAlign: 'center', color: config.color, }}>Skip</PoppinsBold>

          </TouchableOpacity>
          <Image source={require('assets/images/bob.png')} style={{ alignSelf: 'center' }} />
          {/* <View style={{ zIndex: 2, position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
            <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(240), height: calHeight(65), marginBottom: calWidth(24) }}>
                <FastImage source={{ uri: 'https://api.thebobapps.com/.uploads/1588106038968_Group 169.png' }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
              <PoppinsBold style={{ fontSize: calWidth(24), color: Colors.mainColor2 }}>{'BOB'}</PoppinsBold>
            </View>
            <View style={{ opacity: 1, marginBottom: calHeight(56), zIndex: 2 }}>
              <View style={{ width: calWidth(82), height: calHeight(64) }}>
                <FastImage source={require('assets/images/bob.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
            </View>
          </View> */}
          {this.state.loading ? <OverLay /> : null}
        </View>
      );
    }
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: config.backgroundColor, }} >
        <View style={{ width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, height: 200 }}>
            <FastImage key={this.state.image} source={this.state?.image != "" ? { uri: this.state.image } : config.icon} style={{ alignSelf: 'center', width: '100%', height: '100%', }} resizeMode='contain' />
          </View>
        </View>
        {this.state.checkLang ? <View style={{ width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: dimensionsCalculation(32) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <TouchableOpacity
              onPress={() => {
                this.props.changeLang({ lang: 'ar' })
              }}
              style={{
                width: calHeight(80),
                height: calHeight(50),
                borderColor: config.color,
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: calHeight(5),
                alignSelf: 'center',

              }}>
              <PoppinsBold style={{ fontSize: calHeight(16), textAlign: 'center', color: config.color, }}>عربي</PoppinsBold>

            </TouchableOpacity>
            <PoppinsBold style={{ fontSize: calWidth(16), marginHorizontal: calWidth(16) }}></PoppinsBold>
            <TouchableOpacity
              onPress={() => {
                this.props.changeLang({ lang: 'en' })
              }}
              style={{
                width: calHeight(80),
                height: calHeight(50),
                borderColor: config.color,
                borderWidth: 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: calHeight(5),
                alignSelf: 'center',

              }}>
              <PoppinsBold style={{ fontSize: calHeight(16), textAlign: 'center', color: config.color, }}>English</PoppinsBold>

            </TouchableOpacity>
          </View>
        </View> : null}
      </View>
    );
  }
}

export default WelcomeScreen;
