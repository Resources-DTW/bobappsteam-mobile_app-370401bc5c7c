// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, pop, push } from '../../navigation';
import { Header, Container } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import CartCard from 'src/components/CartCard';
import store from 'src/store';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import translations from 'src/localization/Translations';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { Api } from 'src/services';
import context from 'src/utils/context';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';


class NotoficationScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing: false
    }

  }
  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const response = await Api.getNotificationCall({ token: this.props.token })
    if (response && response.data && response.data.data) {
      this.setState({
        list: response.data.data,
        refreshing: false
      })
    } else {
      this.setState({
        list: [],
        refreshing: false
      })
    }
    const response2 = await Api.markAllAsReadCall({ token: this.props.token })
    this.props.getNotifications({ token: this.props.token })
  }


  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }
  renderNoti = ({ item }) => {
    const { logo = "", splash_logo = "" } = this.props.merchant || {}
    const { notification = {} } = item || {};
    const { body = "", body_ar = "", title = "", title_ar = "", data = {} } = notification || {}
    const { status = 'normal', _id: id } = data || {}
    let image = { uri: splash_logo, }
    let color = '"#000000'
    if (status == 'pending') {
      color = '#919191';
      image = require('assets/icons/pending.png')
    }
    else if (status == 'processing') {
      color = '#D6551B'
      image = require('assets/icons/processing.png')

    }
    else if (status == 'delivering') {
      color = "#25430E";
      image = require('assets/icons/delivering.png')

    }
    else if (status == 'delivered') {
      color = "#000000";
      image = require('assets/icons/delivered.png')

    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (status != 'normal')
            push(this.props.componentId, screenIds.ORDER_DETAILS_SCREEN, { id: id })
        }}
        style={{
          padding: calWidth(16),
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          borderRadius: calWidth(12),
          shadowColor: "#000000",
          shadowOpacity: 0.16,
          shadowRadius: 6,
          shadowOffset: {
            height: 3,
            width: 0
          },
          elevation: 2,
          marginHorizontal: calWidth(24),
          marginTop: calWidth(20)
        }}>
        <View style={{ width: calWidth(38), height: calWidth(38) }}>
          {status == 'normal' ? <FastImage source={image} style={{ width: '100%', height: '100%', }} resizeMode="contain" /> :
            <Image source={image} style={{ width: '100%', height: '100%', tintColor: color }} resizeMode="contain" />}
        </View>
        <View style={{ flex: 1, paddingLeft: calWidth(8) }}>
          <PoppinsBold style={{ flex: 1, color: "#000", fontSize: calWidth(14) }}>{context.isRTL() ? title_ar != "" ? title_ar : title : title}</PoppinsBold>
          <PoppinsMediam style={{ color: '#777777', fontSize: calWidth(14) }}>{context.isRTL() ? body_ar != "" ? body_ar : body : body}</PoppinsMediam>
        </View>
      </TouchableOpacity>
    )
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      list: []
    })
    this.fetchData()
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
        <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('notifications').val()}</PoppinsSemiBold>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          data={this.state.list}
          renderItem={this.renderNoti}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id}
          removeClippedSubviews={true}
          ListFooterComponent={() => {
            return (
              <View style={{ height: calWidth(60) }}></View>
            )
          }}
        />

      </View >

    );
  }
}

export default NotoficationScreen;
