// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { dimensionsCalculation } from 'src/screens/ImageViewScreen/ImageViewScreen';
import { calWidth } from 'src/utils/helpers';
import { screenIds, showModal } from 'src/navigation';


export default function ShareOrder(props) {

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        showModal(screenIds.SHARE_ORDER_SCREEN)
      }}
    >

      <View
        style={{
          width: calWidth(52), height: calWidth(52), backgroundColor: '#fff',
          shadowColor: "#80828B",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: {
            height: 2,
            width: 0
          },
          elevation: 2,
          borderRadius: calWidth(16),
          borderWidth: 1,
          borderColor: '#39B54A'
        }}>
        <LottieView source={require('assets/shareOrderLoti/group.json')} style={{ width: '100%', height: '100%', }}
          loop
          autoPlay
        />
      </View>
    </TouchableOpacity>

  )
}
