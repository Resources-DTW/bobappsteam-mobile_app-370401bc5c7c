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
import { pop } from 'src/navigation';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';

export default function ItemPageTypeTwo(props) {
  const { name = "", name_ar = "", rate = 0 } = props.item || {}
  const starts = []
  for (let i = 0; i < 5; i++) {
    if (i < rate) starts.push(<Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.mainColor1 }} />)
    else starts.push(<Image source={require('assets/icons/un_selected_star.png')} style={{ tintColor: Colors.mainColor2 }} />)
  }
  return (
    <View style={{ flex: 1 }}>
      <PoppinsRegular style={{ fontSize: calWidth(17), color: '#000000', marginBottom: calWidth(4) }}>{context.isRTL() ? name_ar : name}</PoppinsRegular>
      <View style={{ flexDirection: 'row' }}>
        {starts}
      </View>
    </View>
  )
}
