// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { addOrRemoveFavAction } from 'src/store/actions/userActions';
import { calWidth } from 'src/utils/helpers';

export default function Favorite(props) {

  const favList = useSelector(state => state.user.get('favList'))
  const token = useSelector(state => state.merchants.get('token'))
  const dispatch = useDispatch();

  const { _id } = props.item

  const handlAddOrRemoveFav = () => {
    if (favList[_id]) {
      dispatch(addOrRemoveFavAction({ id: _id, token: token }))
    } else {
      dispatch(addOrRemoveFavAction({ id: _id, add: true, token: token }))

    }

  }
  return (
    <TouchableOpacity
      onPress={handlAddOrRemoveFav}
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
      <View style={{ width: calWidth(20), height: calWidth(20) }}>
        <FastImage source={favList[_id] ? require('assets/icons/heart_fill.png') : require('assets/icons/heart.png')} style={{ width: '100%', height: '100%', }} resizeMode="contain" />
      </View>
    </TouchableOpacity>

  )
}
