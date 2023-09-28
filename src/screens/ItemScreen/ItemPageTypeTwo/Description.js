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

export default function Description(props) {
  const { description_ar = "", description = "" } = props.item || {}
  if (description && description != "")
    return (
      <View style={{ padding: calWidth(16), paddingTop: 0 }}>
        <PoppinsSemiBold style={{ textAlign: 'left', color: '#676870', fontSize: calWidth(13) }}>{context.isRTL() ? description_ar : description}</PoppinsSemiBold>
      </View>
    )

  return null

}
