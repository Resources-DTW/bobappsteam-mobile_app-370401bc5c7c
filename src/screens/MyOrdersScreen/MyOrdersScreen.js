// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { push, screenIds, showModal } from 'src/navigation';
import { Container, Header } from 'native-base';
import { Api } from 'src/services';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';
import { Navigation } from 'react-native-navigation';
import MainContainer from 'src/components/MainContainer';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import moment from 'moment';
import { dimensionsCalculation } from '../ImageViewScreen/ImageViewScreen';
import colors from 'src/theme/colors';

class MyOrdersScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      dilevery_orders: [],
      total_count: 0,
      refreshing: false
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }
  componentDidAppear() {
    this.props.showHideFooterAction(true)
  }
  componentDidMount() {
    this.props.getMyOrders({ token: this.props.token })
  }

  componentDidUpdate(prevProps) {
    if (this.props.myOrders.success != prevProps.myOrders.success && this.props.myOrders.success) {
      const dilevery_orders = [];
      const orders = [];
      this.props.myOrders.data.map(item => {
        if (item.status == 'delivered' || item.status == 'rejected') dilevery_orders.push(item)
        else orders.push(item)
      })
      this.setState({
        orders: orders,
        total_count: this.props.myOrders.total_count,
        dilevery_orders: dilevery_orders,
        refreshing: false
      })
    }
  }

  renderTrackOrders = () => {
    if (this.props.myOrders.pending)
      return (
        <View><ActivityIndicator /></View>
      )
    if (this.state.total_count == 0) {
      return (
        <View style={{ padding: calWidth(24) }}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C', marginBottom: calWidth(16) }}>{translations.get('track_order').val()}</PoppinsSemiBold>
          <View style={{ flex: 1, height: calHeight(190), backgroundColor: '#F2F2F2', borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: calWidth(70), height: calWidth(70), marginBottom: calHeight(8) }}>
              <FastImage source={require('assets/icons/cart.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
            <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191', marginBottom: calHeight(20) }}>{translations.get('no_orders').val()}</PoppinsRegular>
            <PoppinsRegular onPress={() => {
              this.props.changeSelectedMenu({ index: 2 })
              // Navigation.mergeOptions('bottomTabs', {
              //   bottomTabs: {
              //     currentTabIndex: 2
              //   }
              // })
            }}
              style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('start_order').val()}</PoppinsRegular>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <PoppinsSemiBold style={{ margin: calWidth(24), fontSize: calWidth(16), color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C', marginBottom: calWidth(16) }}>{translations.get('track_order').val()}</PoppinsSemiBold>

          <FlatList
            data={this.state.orders}
            renderItem={this.renderOrder}
            horizontal
            snapToAlignment={"start"}
            snapToInterval={calWidth(218 + 24)}
            decelerationRate={"fast"}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            // onViewableItemsChanged={this.onViewableItemsChanged}
            // viewabilityConfig={{
            //   itemVisiblePercentThreshold: 50
            // }}
            keyExtractor={(item, index) => item._id}
          />
          {this.renderHistory()}

        </View>
      )
    }
  }
  renderHistory = () => {
    if (this.state.dilevery_orders.length) {
      return (
        <>
          <PoppinsSemiBold style={{ margin: calWidth(24), fontSize: calWidth(16), color: colors.shadeColor3 != "" ? colors.shadeColor3 : '#5C5C5C', marginBottom: calWidth(16) }}>{translations.get('order_history').val()}</PoppinsSemiBold>
          <FlatList
            data={this.state.dilevery_orders}
            renderItem={this.renderDileveryOrder}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item._id}
            ListFooterComponent={() => {
              return (
                <View style={{ height: calHeight(60), width: '100%' }}></View>
              )
            }}
          />
        </>
      )
    }
    else {
      return null;
    }
  }
  renderDileveryOrder = ({ item, index }) => {
    const { status = "", items = [], shipping_address = {}, payment_details = {}, shipment_details = {}, updated_at = "" } = item || {}
    return (
      <TouchableOpacity
        onPress={() => push(this.props.componentId, screenIds.ORDER_DETAILS_SCREEN, { item })}
        style={{
          backgroundColor: '#fff', flex: 1, margin: calHeight(24), marginVertical: calHeight(16), flexDirection: 'row', borderRadius: calHeight(10),
          shadowColor: "#000",
          shadowOpacity: 0.07,
          shadowRadius: 46,
          shadowOffset: {
            height: 0,
            width: 0
          },
          elevation: 2,
          paddingHorizontal: calWidth(8)
        }}>
        <View style={{ width: calHeight(60), height: calHeight(60), borderRadius: calHeight(8), margin: calHeight(4) }}>
          <FastImage source={{ uri: items[0].item ? items[0].item.images ? items[0].item.images[0] : '' : '' }} style={{ width: '100%', height: '100%', borderRadius: calHeight(8) }} />
        </View>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingLeft: calHeight(8), justifyContent: 'space-between' }} >
          <View>
            <PoppinsSemiBold style={{ fontSize: calHeight(16), color: '#5C5C5C' }}>ID:{item._id}</PoppinsSemiBold>
            <PoppinsRegular style={{ fontSize: calHeight(12), color: '#919191' }}>{moment(updated_at).format('YYYY-MM-DD')}</PoppinsRegular>
            <PoppinsRegular style={{ fontSize: calHeight(12), color: '#5A5858' }}>{translations.get(status).val()}</PoppinsRegular>
          </View>
          <View style={{ justifyContent: 'flex-end' }}>
            <PoppinsSemiBold style={{ fontSize: calHeight(16), color: '#000' }}>{parseFloat(payment_details.total_paid || 0) + parseFloat(shipment_details.amount || 0)} JD</PoppinsSemiBold>
            {true ?
              null
              : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.mainColor2, marginRight: calHeight(4) }} />
                <PoppinsRegular style={{ fontSize: calHeight(14), color: '#777777' }}>5.0</PoppinsRegular>
              </View>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderOrder = ({ item, index }) => {
    const { status = "", items = [], shipping_address = {} } = item || {}
    const { name = "" } = shipping_address || {}
    const images = [];
    for (let i = 0; i < 3; i++) {
      if (items[i])
        images.push(
          <View key={i + "SSS" + index} style={{ height: calWidth(60), width: calWidth(60), borderRadius: calWidth(8), }}>
            <FastImage source={{ uri: items[i].item ? items[i].item.images ? items[i].item.images[0] : '' : '' }} style={{ width: '100%', height: '100%', borderRadius: calWidth(8) }} />
          </View>
        )
    }
    if (images.length == 2) images.push(<View style={{ height: calWidth(60), width: calWidth(60), }}></View>)
    return (<TouchableOpacity
      onPress={() => push(this.props.componentId, screenIds.ORDER_DETAILS_SCREEN, { item })}
      style={{
        width: calWidth(230),
        backgroundColor: status == 'pending' ? Colors.tintColor1 : status == 'processing' ? Colors.tintColor2 : Colors.tintColor3,
        margin: calWidth(16),
        marginLeft: calWidth(24),
        marginRight: 0,
        borderRadius: calWidth(10),
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 6,
        shadowOffset: {
          height: 10,
          width: 10
        },
        elevation: 2,
        padding: calWidth(13)
      }}>
      <PoppinsMediam style={{ color: '#fff', fontSize: calWidth(20), marginVertical: calWidth(12) }}>{translations.get(status).val()}</PoppinsMediam>
      {images.length != 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: calWidth(12) }}>
        {images}
      </View> : null}
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#fff' }}>ID: {item._id}</PoppinsSemiBold>
      {(name || "") != "" ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('assets/icons/share_order.png')} />
        <PoppinsRegular style={{ marginLeft: calWidth(4), color: '#fff', fontSize: calWidth(12) }}>{name}</PoppinsRegular>
      </View> : null}
      {/* <View style={{ marginTop: calWidth(8) }}>
        <PoppinsRegular style={{ fontSize: calWidth(12), color: '#fff', marginBottom: calWidth(6) }}>Shared With:</PoppinsRegular>
        <Image source={require('assets/icons/men.png')} />
      </View> */}
    </TouchableOpacity>)
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      orders: [],
      dilevery_orders: []
    })
    this.props.getMyOrders({ token: this.props.token })
  }

  render() {
    return (
      <MainContainer componentId={this.props.componentId} search={true} cutHeader={true}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          style={{ backgroundColor: Colors.mainColor3 }}>
          {this.renderTrackOrders()}
          <View style={{ height: calWidth(80) }} />
        </ScrollView>
      </MainContainer>
    );
  }
}

export default MyOrdersScreen;
