// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import Favorite from 'src/components/Favorite';
import FullCarousel from 'src/components/FullCarousel';
import ShareIcon from 'src/components/ShareIcon';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import { pop } from 'src/navigation';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';

export default function Price(props) {
  const { price: localPrice = 0, is_offer = false, offer_amount = 0, offer_percentage = 0 } = props.item || {}
  if (is_offer) {
    const newPrice = offer_amount != 0 ? localPrice - offer_amount : localPrice - (localPrice * offer_percentage / 100)

    return (
      <View style={{ alignItems: 'center', }}>
        <PoppinsSemiBold style={{ textAlign: 'left', color: "#DC2028", fontSize: calWidth(12), textDecorationLine: 'line-through' }}>{localPrice.toFixed(2)} {translations.get('jd').val()}<PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
        <PoppinsSemiBold style={{ textAlign: 'left', color: '#000', fontSize: calWidth(14), marginLeft: calWidth(4) }}>{newPrice.toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
      </View>
    )
  }
  return (
    <View style={{}}>
      <PoppinsSemiBold style={{ textAlign: 'left', color: '#000', fontSize: calWidth(14) }}>{localPrice.toFixed(2)} {translations.get('jd').val()} <PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
    </View>
  )

}
