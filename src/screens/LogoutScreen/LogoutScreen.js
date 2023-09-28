// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';

class LogoutScreen extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.logout({})
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
        <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('wait_logout').val()}</PoppinsRegular>
        <ActivityIndicator />
      </View>
    );
  }
}

export default LogoutScreen;
