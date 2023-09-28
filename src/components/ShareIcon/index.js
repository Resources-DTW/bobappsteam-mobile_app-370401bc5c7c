// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { addOrRemoveFavAction } from 'src/store/actions/userActions';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';
import Share from 'react-native-share'
export default function ShareIcon(props) {

  const favList = useSelector(state => state.user.get('favList'))
  const token = useSelector(state => state.merchants.get('token'))
  const dispatch = useDispatch();
  const merchant = useSelector(state => state.merchants.get('merchant'))

  const { _id, name = "", name_ar = "", images = [] } = props.item

  const onShare = () => {
    const options = {
      title: context.isRTL() ? name_ar != "" ? name_ar : name : name,
      message: context.isRTL() ? name_ar != "" ? name_ar : name : name,
      url: `${`https://${merchant?.subdomain}/${context.getCurrentLanguage()}/item/${_id}`}`
    }
    Share.open(options)
      .then((res) => { console.log(res) })
      .catch((err) => { err && console.log(err); });
  }
  return (
    <TouchableOpacity
      onPress={onShare}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.17,
        shadowRadius: 10,
        shadowOffset: {
          height: 0,
          width: 0
        },
        elevation: 2,
        zIndex: 22,
        backgroundColor: '#fff',
        width: calWidth(34),
        height: calWidth(34),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: calWidth(7)
      }}>
      <View style={{ width: calWidth(24), height: calWidth(24) }}>
        <FastImage source={require('assets/icons/share-ios.png')} style={{ width: '100%', height: '100%', }} tintColor={Colors.mainColor1} resizeMode="contain" />
      </View>
    </TouchableOpacity>

  )
}
