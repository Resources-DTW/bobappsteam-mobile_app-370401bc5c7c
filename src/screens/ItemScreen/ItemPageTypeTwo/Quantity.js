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
import { calWidth, showToastError } from 'src/utils/helpers';
import Toast from 'react-native-simple-toast';

export default function Quantity(props) {
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}
  const { selectedOptions } = props;
  const [optionQuantity, setoptionQuantity] = useState(-1);

  useEffect(() => {
    if (parsingFeature['quantity_required']) {
      Object.keys(selectedOptions).map(key => {
        Object.keys(selectedOptions[key]).map(skey => {
          if (selectedOptions[key][skey] && selectedOptions[key][skey].quantity) {
            if (optionQuantity < selectedOptions[key][skey].quantity) {
              setoptionQuantity(selectedOptions[key][skey].quantity);
            }
          }
        })
      })
    }
  }, [selectedOptions, optionQuantity, parsingFeature]);

  return (<View style={{
    // padding: calWidth(16), paddingTop: 0,
    marginBottom: calWidth(12)
  }}>
    <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', opacity: 0.43, marginBottom: calWidth(12) }}>{translations.get('quantity_1').val()}</PoppinsSemiBold>

    <View style={{
      backgroundColor: '#fff', width: calWidth(180), borderRadius: calWidth(20), height: calWidth(40), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0.5, borderColor: Colors.mainColor1, paddingHorizontal: calWidth(8),
      shadowColor: Colors.mainColor1,
      shadowOpacity: 0.16,
      shadowRadius: 16,
      shadowOffset: {
        height: 4,
        width: 0
      },
      elevation: 2,
      alignSelf: 'center'
    }}>
      <TouchableOpacity
        onPress={() => {
          if (props.quantity > 1) {
            props.setQuantity(props.quantity - 1)
          } else {
            props.setQuantity(1)
          }
        }}
        activeOpacity={1}
        style={{ width: calWidth(32), height: calWidth(32), borderRadius: calWidth(16), backgroundColor: Colors.mainColor1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('assets/icons/minus.png')} style={{ tintColor: '#fff' }} />

      </TouchableOpacity>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <PoppinsRegular style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{props.quantity}</PoppinsRegular>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (parsingFeature['quantity_required']) {
            if (optionQuantity != -1) {
              if (props.quantity < optionQuantity) {
                props.setQuantity(props.quantity + 1)
              } else {
                showToastError(translations.get('StockOut').val())
              }
            } else {
              if (props.quantity < props.realQuantity) {
                props.setQuantity(props.quantity + 1)
              } else {
                showToastError(translations.get('StockOut').val())
              }
            }
          } else {
            props.setQuantity(props.quantity + 1)
          }
        }}
        activeOpacity={1}
        style={{ width: calWidth(32), height: calWidth(32), borderRadius: calWidth(16), backgroundColor: Colors.mainColor1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('assets/icons/plus.png')} style={{ tintColor: '#fff' }} />
      </TouchableOpacity>

    </View>
  </View>)
}
