// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, BackHandler, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { calWidth } from 'src/utils/helpers';
import { dismissModal, screenIds, showModal } from 'src/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import FastImage from 'react-native-fast-image';
import ShareOrderSlider from 'src/components/ShareOrderSlider';
import Share from 'react-native-share'
import context from 'src/utils/context';
import translations from 'src/localization/Translations';


export default function ShareOrderScreen(props) {
  const dispatch = useDispatch()


  useEffect(() => {
    const backAction = () => {
      dispatch(showHideFooterAction(true))
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const merchant = useSelector(state => state.merchants.get('merchant'))
  const cart = useSelector(state => state.cart.get('cartDetails'))
  const user = useSelector(state => state.user.get('userData'))



  const onShare = () => {

    const options = {
      title: `${user.data?.full_name ? user.data?.full_name : merchant.name + " Guest"} ${translations.get('ask_share').val()} ${user.data?.gender == "femal" ? 'her' : 'him'} 
    ${translations.get('ask_share2').val()} ${user.data?.gender == "femal" ? 'her' : 'his'} ${translations.get('ask_share3').val()} ${`https://${merchant.subdomain}/${context.getCurrentLanguage()}/items?groupid=${cart.group_token}`}`,
      message:
        `${user.data?.full_name ? user.data?.full_name : merchant.name + " Guest"} ${translations.get('ask_share').val()} ${user.data?.gender == "femal" ? 'her' : 'him'} 
  ${translations.get('ask_share2').val()} ${user.data?.gender == "femal" ? 'her' : 'his'} ${translations.get('ask_share3').val()} ${`https://${merchant.subdomain}/${context.getCurrentLanguage()}/items?groupid=${cart.group_token}`}`,
      // url: `https://${merchant.subdomain}/${context.getCurrentLanguage()}/items?groupid=${cart.group_token}`
    }

    showModal(screenIds.SHARE_DIALOG, { options: options })

    // Share.open(options)
    //   .then((res) => {
    //     dispatch(showHideFooterAction(true))
    //     // dismissModal(props.componentId)
    //   })
    //   .catch((err) => {
    //     dispatch(showHideFooterAction(true))
    //     // dismissModal(props.componentId)
    //   });
  }
  return (
    <View
      onPress={() => {
        dispatch(showHideFooterAction(true))
        dismissModal(props.componentId)
      }}
      activeOpacity={1}
      style={{ backgroundColor: 'rgba(0,0,0,0.2)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          dispatch(showHideFooterAction(true))
          dismissModal(props.componentId)
        }}
        style={{ flex: 1, width: '100%' }}>

      </TouchableOpacity>
      <View
        onPress={null}
        activeOpacity={1}
        style={{ backgroundColor: '#EFEFEF', borderRadius: calWidth(28), padding: calWidth(16), alignItems: 'center', justifyContent: 'center', }}
      >
        <View style={{ width: calWidth(120), height: calWidth(40) }}>
          <FastImage source={require('assets/images/bobonly.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
        <View style={{ width: calWidth(280), marginBottom: calWidth(16) }}>
          <ShareOrderSlider />
        </View>
        <TouchableOpacity
          onPress={() => {
            onShare()
          }}
        >
          <View style={{ width: calWidth(120), height: calWidth(40) }}>
            <LottieView source={require('assets/shareOrderLoti/whatsapp.json')} style={{ width: '100%', height: '100%', }}
              loop
              autoPlay
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          dispatch(showHideFooterAction(true))
          dismissModal(props.componentId)
        }}
        activeOpacity={1}
        style={{ flex: 1, width: '100%' }}>

      </TouchableOpacity>
    </View>
  )
}
