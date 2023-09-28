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
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import { pop } from 'src/navigation';
import { Api } from 'src/services';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';

export default function Reviews(props) {
  const [reviews, setReviews] = useState([]);
  const token = useSelector(state => state.merchants.get('token'))
  const merchant = useSelector(state => state.merchants.get('merchant'))

  useEffect(() => {
    getItemRates = async () => {
      const response = await Api.getItemRatesCall({ token: token, id: props?.item?._id });
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        setReviews(response.data.data)
      }
    }
    getItemRates()
  }, [props?.item?._id])

  const renderReview = (review) => {
    const { rater = {}, rate_value = 0, comment = "" } = review || {};
    const { avatar = "", full_name = "" } = rater || {};
    const { logo = "", splash_logo = "", name = "" } = merchant || {}

    var starts = []
    for (let i = 0; i < 5; i++) {
      if (i < rate_value) starts.push(<Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.mainColor1 }} />)
      else starts.push(<Image source={require('assets/icons/un_selected_star.png')} style={{ tintColor: Colors.mainColor2 }} />)
    }
    return (
      <View style={{ marginBottom: calWidth(16), backgroundColor: Colors.mainColor3, borderRadius: calWidth(8), padding: calWidth(8) }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: calWidth(45), height: calWidth(45), borderRadius: calWidth(10) }}>
              <FastImage source={avatar != "" ? { uri: avatar } : { uri: splash_logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(10) }} resizeMode={avatar != "" ? 'cover' : 'contain'} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#474C55', marginLeft: calWidth(8) }}>{full_name}</PoppinsRegular>
              <View style={{ flexDirection: 'row', }}>
                {starts}
              </View>
            </View>
            <View>
              <PoppinsRegular style={{ fontSize: calWidth(14), color: '#7B8495', marginLeft: calWidth(8) }}>{comment}</PoppinsRegular>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if (reviews.length) {
    <View style={{ padding: calWidth(16) }}>
      {reviews.map(review => renderReview(review))}
    </View>
  }
  return <View style={{ padding: calWidth(16), justifyContent: 'center', alignItems: 'center' }}>
    <PoppinsMediam style={{ fontSize: calWidth(14), color: '#474C55', marginBottom: calWidth(12) }}>{translations.get('no_Reviews').val()}</PoppinsMediam>

  </View>

}
