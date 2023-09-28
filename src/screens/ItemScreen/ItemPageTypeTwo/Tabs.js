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
import Options from './Options';
import Reviews from './Reviews';

export default function Tabs(props) {
  const [selectedTab, setSelectedTab] = useState(1)

  return (
    <>
      <View style={{
        flexDirection: 'row', backgroundColor: '#fff',
        shadowColor: "#727C8E",
        shadowOpacity: 0.06,
        shadowRadius: 15,
        shadowOffset: {
          height: 8,
          width: 0
        },
        elevation: 2,
      }}>
        {/* <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelectedTab(0)
          }}

          style={{ paddingVertical: calWidth(12), justifyContent: 'center', alignItems: 'center', flex: 1, borderBottomWidth: 1, borderBottomColor: selectedTab == 0 ? Colors.mainColor1 : '#fff' }}>
          <PoppinsRegular style={{ fontSize: calWidth(15), color: selectedTab == 0 ? Colors.mainColor1 : '#727C8E' }}>{translations.get('specifications').val()}</PoppinsRegular>
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelectedTab(1)
          }} style={{ paddingVertical: calWidth(12), justifyContent: 'center', alignItems: 'center', flex: 1, borderBottomWidth: 1, borderBottomColor: selectedTab == 1 ? Colors.mainColor1 : '#fff' }}>
          <PoppinsRegular style={{ fontSize: calWidth(15), color: selectedTab == 1 ? Colors.mainColor1 : '#727C8E' }}>{translations.get('options_1').val()}</PoppinsRegular>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelectedTab(2)
          }} style={{ paddingVertical: calWidth(12), justifyContent: 'center', alignItems: 'center', flex: 1, borderBottomWidth: 1, borderBottomColor: selectedTab == 2 ? Colors.mainColor1 : '#fff' }}>
          <PoppinsRegular style={{ fontSize: calWidth(15), color: selectedTab == 2 ? Colors.mainColor1 : '#727C8E' }}>{translations.get('rating').val()}</PoppinsRegular>
        </TouchableOpacity>
      </View>
      {selectedTab == 0 ? null : selectedTab == 1 ? <Options
        setSelectedOptions={props.setSelectedOptions}
        selectedOptions={props.selectedOptions}
        item={props.item}
        quantity={props.quantity}
        setQuantity={props.setQuantity}
        note={props.note}
        setNote={props.setNote}
      /> : <Reviews item={props.item} />}
    </>
  )
}
