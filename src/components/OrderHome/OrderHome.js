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
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { Header, Root, Footer, Container } from 'native-base';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { Navigation } from 'react-native-navigation'
import translations from 'src/localization/Translations';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import { push, screenIds } from 'src/navigation';
const { width } = Dimensions.get('window');
class OrderHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      dilevery_orders: [],
      total_count: 0,
      refreshing: false
    }
  }


  componentDidUpdate(prevProps) {
    if (this.props.myOrders.success != prevProps.myOrders.success && this.props.myOrders.success) {
      const dilevery_orders = [];
      const orders = [];
      this.props.myOrders.data.map(item => {
        if (item.status == 'delivered') dilevery_orders.push(item)
        else orders.push(item)
      })
      this.setState({
        orders: orders.length == 1 ? [...orders, { empty: true }] : orders,
        total_count: this.props.myOrders.total_count,
        dilevery_orders: dilevery_orders,
        refreshing: false
      })
    }
  }

  componentDidMount() {
    if (this.props.myOrders.success) {
      const dilevery_orders = [];
      const orders = [];
      this.props.myOrders.data.map(item => {
        if (item.status == 'delivered') dilevery_orders.push(item)
        else orders.push(item)
      })
      this.setState({
        orders: orders.length == 1 ? [...orders, { empty: true }] : orders,
        total_count: this.props.myOrders.total_count,
        dilevery_orders: dilevery_orders,
        refreshing: false
      })
    }
    // this.props.getMyOrders({ token: this.props.token })
  }


  renderOrder = ({ item, index }) => {
    if (item.empty) {
      return (
        <View style={{ width: calWidth(width - 230), }}>

        </View>
      )
    }
    const { status = "", items = [], shipping_address = {} } = item || {}
    const { name = "" } = shipping_address || {}
    const images = [];
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
        paddingHorizontal: calWidth(13),
        paddingBottom: calWidth(8)
      }}>
      <PoppinsMediam style={{ color: '#fff', fontSize: calWidth(20), marginVertical: calWidth(12) }}>{translations.get(status).val()}</PoppinsMediam>
      {/* {images.length != 0 ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: calWidth(12) }}>
        {images}
      </View> : null} */}
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#fff' }}>ID: {item._id}</PoppinsSemiBold>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('assets/icons/share_order.png')} />
        <PoppinsRegular style={{ marginLeft: calWidth(4), color: '#fff', fontSize: calWidth(12) }}>{name}</PoppinsRegular>
      </View>
      {/* <View style={{ marginTop: calWidth(8) }}>
        <PoppinsRegular style={{ fontSize: calWidth(12), color: '#fff', marginBottom: calWidth(6) }}>Shared With:</PoppinsRegular>
        <Image source={require('assets/icons/men.png')} />
      </View> */}
    </TouchableOpacity>)
  }

  render() {
    return (
      <View style={{}}>
        <View style={{ paddingHorizontal: calWidth(24) }}>

          <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16), marginBottom: calHeight(10) }}>{translations.get('recent_orders').val()}</PoppinsSemiBold>
        </View>
        {/* <View style={{ flex: 1, height: calHeight(190), borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center' }}> */}
        {this.state.orders.length != 0 ? <FlatList
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
        /> :
          <View style={{ paddingHorizontal: calWidth(24) }}>
            <View style={{ flex: 1, height: calHeight(190), backgroundColor: '#F2F2F2', borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(70), height: calWidth(70), marginBottom: calHeight(8) }}>
                <FastImage source={require('assets/icons/cart.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191', marginBottom: calHeight(20) }}>{translations.get('no_orders').val()}</PoppinsRegular>
              <PoppinsRegular onPress={() => {
                this.props.changeSelectedMenu({ index: 2 })

              }} style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('start_order').val()}</PoppinsRegular>
            </View>
          </View>
        }

        {/* </View> */}
      </View>
    );
  }
}

export default OrderHome;
