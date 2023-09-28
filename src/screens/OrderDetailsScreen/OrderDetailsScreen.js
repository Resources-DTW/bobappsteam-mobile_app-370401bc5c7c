// @flow

import React, { PureComponent } from 'react';
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
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { Root, Container } from 'native-base';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';
import CartCard from 'src/components/CartCard/CartCard';
import { pop } from 'src/navigation';
import { Api } from 'src/services';
import context from 'src/utils/context';
import { OverLay } from 'src/components/OverLay';
import moment from 'moment';

class OrderDetailsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      selectedAdress: null,
      addresses: {
        list: []
      },
      fees: 0,
      tax: 0,
      showSuccess: false,
      loading: false,
      shipping_address: null,
      table_number: null,
      users: {}
    }
    // this.navigationEvents = Navigation.events().bindComponent(this);

  }
  componentDidDisappear() {
    // store.dispatch(showHideFooterAction(true))
  }


  componentDidMount() {
    // this.onLayout()
    if (this.props.id) {
      this.fetchData(this.props.id)
    } else {
      this.setState({
        cart: this.props.item,
        shipping_address: this.props.item.shipping_address ? this.props.item.shipping_address : null,
        table_number: this.props.item?.table_number ? this.props.item?.table_number : null
      })
      setTimeout(() => {
        this.parsingCart(this.props.item)
      }, 350);
    }
  }

  parsingCart = (cart) => {
    this.setState({ loading: true })
    let users = {}
    cart?.items?.map((item, index) => {
      if (item.user) {
        if (users[item.user?._id]) {
          users[item.user?._id] = [
            ...users[item.user?._id],
            { ...item, index }
          ]
        } else {
          users[item.user?._id] = [{ ...item, index }]
        }
      } else {
        if (users['me']) {
          users['me'] = [
            ...users['me'],
            { ...item, index }
          ]
        } else {
          users['me'] = [{ ...item, index }]
        }
      }
    })

    this.setState({
      cart: cart,
      users: users,
      loading: false
    })
  }
  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }
  componentDidUpdate(prevProps) {

  }
  renderCartCard = ({ item, index }) => {
    return <CartCard item={item} index={index} disable={true} canRate={this.state?.cart?.status == "delivered"} />
  }

  renderItems = () => {

    return Object.keys(this.state.users).map((key, index) => {
      return this.renderGroup(this.state.users?.[key])
    })
  }
  renderGroup = (items) => {
    let total = 0;
    if (items?.length)
      return <View key={items[0].user?._id || "jkjjjj"} style={{ backgroundColor: '#fff', marginTop: calWidth(20), paddingHorizontal: calWidth(20), paddingBottom: calWidth(20) }}>
        {<PoppinsRegular style={{ fontSize: calWidth(16), paddingTop: calWidth(8) }}>{items[0]?.user ? (items[0]?.user?.full_name || "") != "" ? items[0]?.user?.full_name : this.props.merchant?.name + " Guest" : context.isRTL() ? "قمت بإضافتها" : 'From You'}</PoppinsRegular>}
        {items?.map((item, index) => {
          let optionsPrice = 0;
          item.options.map(op => {
            if (op.price != 0) {
              optionsPrice = parseFloat(optionsPrice) + parseFloat(op.price)
            } else if (op.sub_option) {
              if (op?.sub_option?.price) {
                optionsPrice = parseFloat(optionsPrice) + parseFloat(op.sub_option?.price)
              }
            }
          })
          total = total + ((item.price + optionsPrice) * item.quantity);
          return <CartCard item={item} index={item.index} onlyShow={true} />
        })}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: calWidth(4) }}>
          <PoppinsSemiBold style={{ color: '#000000', fontSize: calWidth(14) }}>{translations.get('total').val()}</PoppinsSemiBold>
          <View style={{ alignItems: 'flex-end' }}>
            <PoppinsSemiBold style={{ color: '#000000', fontSize: calWidth(14) }}>{parseFloat(total)?.toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
            {this.props.merchant.parsingFeature['tax_note'] ? <PoppinsRegular style={{ color: '#000000', fontSize: calWidth(8) }}>{translations.get('tax_note').val()}</PoppinsRegular> : null}
          </View>
        </View>
      </View>
    return null
  }

  renderSelectedAddress = () => {
    if (this.state.shipping_address) {
      const { name = "", area = "", street = "", } = this.state.shipping_address
      return (
        <>
          {name ? <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{name}</PoppinsRegular> : null}
          <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{area}</PoppinsRegular>
          <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{street}</PoppinsRegular>

        </>
      )
    } else {
      return (null)
    }
  }

  fetchData = async (id = "") => {
    const response = await Api.getCartDetailsCall({ order_id: id != "" ? id : this.props.item._id, token: this.props.token })
    if (response && response.data) {
      this.setState({
        cart: response.data,
        refreshing: false,
        shipping_address: response.data.shipping_address ? response.data.shipping_address : null
      })
      this.parsingCart(response.data)
    } else {
      this.setState({
        refreshing: false
      })
    }
  }
  onRefresh = () => {
    this.setState({
      refreshing: true,
      list: []
    })
    this.fetchData()
  }

  renderStatus = () => {
    let img = require('assets/icons/pending.png')
    let color = '#919191';
    let mainText = context.isRTL() ? "طلبك قيد الانتظار" : "Your Order is Pending";
    let second = 'Order ID : ' + this.state.cart._id;
    if (this.state.cart.status == 'pending') {
      color = '#919191';
      img = require('assets/icons/pending.png')
      mainText = context.isRTL() ? "طلبك قيد الانتظار" : "Your Order is Pending";
      second = 'Order ID : ' + this.state.cart._id;
    }
    else if (this.state.cart.status == 'processing') {
      color = '#D6551B'
      img = require('assets/icons/processing.png')
      mainText = context.isRTL() ? "طلبك قيد التحضير" : "Your Order is Being Processed";
      second = 'Order ID : ' + this.state.cart._id;
    }
    else if (this.state.cart.status == 'delivering') {
      color = "#25430E";
      img = require('assets/icons/delivering.png')
      mainText = this.props.merchant?.parsingFeature['indoor_cta'] ?
        context.isRTL() ? 'طلبك جاهز' : 'Your Order is Ready'
        : context.isRTL() ? "طلبك قيد التوصيل" : "Your Order is Being Delivered";
      second = "";
    }
    else if (this.state.cart.status == 'delivered') {
      color = "#000000";
      img = require('assets/icons/delivered.png')
      mainText = context.isRTL() ? "تم توصيل الطلب بنجاح" : "Your Order Has Been Delivered";
      second = context.isRTL() ? "قيم الطلب" : 'Rate Your Order >';
    } else if (this.state.cart.status == 'rejected') {
      color = "#000000";
      img = require('assets/icons/pending.png')
      mainText = context.isRTL() ? "تم الغاء الطلب" : "Your Order Has Been Canceled";
      second = "";
    }

    return (
      <View style={{
        marginVertical: calHeight(8),
        flex: 1,
        padding: calHeight(16),
        paddingVertical: calWidth(36),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        flex: 1,
        borderRadius: calHeight(10),
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 23,
        shadowOffset: {
          height: 3,
          width: 0
        },
        elevation: 2,
      }}>
        <Image source={img} style={{ marginBottom: calHeight(12) }} />
        <PoppinsRegular style={{ fontSize: calHeight(16), color: color, marginBottom: calHeight(2) }}>{mainText}</PoppinsRegular>
        {second != "" ? <PoppinsRegular style={{ fontSize: calHeight(16), color: color, }}>{second}</PoppinsRegular> : null}

      </View>
    )
  }

  renderOrderDetails = () => {
    if (this.props?.merchant?.parsingFeature['hide_totalprice_checkout'])
      return null

    const { images = [], name = "", price = "", quantity = "", items = [], cart_total = 0, payment_details = {}, shipment_details = {}, order_flow = "" } = this.state.cart || {}
    const { total_paid = 0, discount = 0 } = payment_details || {}
    const { amount = 0 } = shipment_details || {}

    return (
      <View style={{ backgroundColor: '#fff', paddingHorizontal: calWidth(16), marginTop: calWidth(12) }}>
        {this.state.order_flow != "indoor" ? <View style={{
          flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
          borderBottomWidth: 0.5,
          paddingVertical: calWidth(12)
        }}>
          <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('deliveryFees').val()}</PoppinsRegular>
          <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{amount?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>

        </View> : null}
        {this.props.merchant?.parsingFeature['Show_Tax'] ? <View style={{
          flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
          borderBottomWidth: 0.5,
          paddingVertical: calWidth(12)
        }}>
          <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('tax').val()}</PoppinsRegular>
          <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{this.state.cart.tax?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>

        </View> : null}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
          borderBottomWidth: 0.5,
          paddingVertical: calWidth(12)
        }}>
          <PoppinsRegular style={{ color: "#D92626", fontSize: calWidth(16) }}>{translations.get('discount').val()}</PoppinsRegular>
          <PoppinsRegular style={{ color: "#D92626", fontSize: calWidth(16) }}>- {discount?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>

        </View>

        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          paddingVertical: calWidth(12)
        }}>
          <PoppinsSemiBold style={{ color: '#000000', fontSize: calWidth(16) }}>{translations.get('total').val()}</PoppinsSemiBold>
          <View style={{ alignItems: 'flex-end' }}>
            <PoppinsSemiBold style={{ color: '#000000', fontSize: calWidth(16) }}>{parseFloat(total_paid)?.toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
            {this.props.merchant.parsingFeature['tax_note'] ? <PoppinsRegular style={{ color: '#000000', fontSize: calWidth(8) }}>{translations.get('tax_note').val()}</PoppinsRegular> : null}
          </View>

        </View>
      </View>
    )
  }
  render() {
    const { created_at = "", images = [], name = "", price = "", quantity = "", items = [], cart_total = 0, payment_details = {}, shipment_details = {}, order_flow = "" } = this.state.cart || {}
    const { total_paid = 0, discount = 0 } = payment_details || {}
    const { amount = 0 } = shipment_details || {}
    const { logo = "", splash_logo = "" } = this.props.merchant || {}
    return (
      <Root>

        <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
          <View style={{ height: calHeight(120), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: calHeight(16) }}>

            <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center', }}>

              <View style={{ height: calWidth(100), width: calWidth(180), }}>
                <FastImage source={{ uri: (logo || "") != '' ? logo : splash_logo || "" }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
            </View>
            <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
            </TouchableOpacity>
            {/* <PoppinsSemiBold style={{ fontSize: calWidth(26), color: '#fff' }}>{translations.get('checkout').val()}</PoppinsSemiBold> */}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
          >
            <View style={{ padding: calHeight(24), paddingBottom: 0 }}>
              <PoppinsBold style={{ fontSize: calHeight(16), color: '#000' }}>{translations.get('OrderSummary').val()}</PoppinsBold>
              {this.renderStatus()}
            </View>
            {/* {items} */}
            {Object.keys(this.state.users).map(key => {
              return this.renderGroup(this.state.users[key])
            })}
            <>
              <View style={{ backgroundColor: '#fff', paddingHorizontal: calWidth(16), marginTop: calWidth(12) }}>
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
                  borderBottomWidth: 0.5,
                  paddingVertical: calWidth(12)
                }}>
                  <PoppinsRegular style={{ fontSize: calWidth(16) }}>{translations.get('date').val()}</PoppinsRegular>
                  <PoppinsRegular style={{ fontSize: calWidth(16) }}>{moment(created_at).format('YYYY-MM-DD')}</PoppinsRegular>

                </View>
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between',
                  paddingVertical: calWidth(12)
                }}>
                  <PoppinsRegular style={{ fontSize: calWidth(16) }}>{translations.get('time').val()}</PoppinsRegular>
                  <PoppinsRegular style={{ fontSize: calWidth(16) }}>{moment(created_at).format('LT')}</PoppinsRegular>
                </View>
              </View>
              {this.renderOrderDetails()}

              {this.state.shipping_address ?

                <View style={{ backgroundColor: '#fff', paddingHorizontal: calWidth(16), marginTop: calWidth(12) }}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
                    borderBottomWidth: 0.5,
                    paddingVertical: calWidth(12)
                  }}>
                    <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('deliveryAddress').val()}</PoppinsSemiBold>
                  </View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    paddingVertical: calWidth(12)
                  }}>
                    {this.state.shipping_address ?
                      <View style={{}}>
                        {this.renderSelectedAddress()}

                      </View>
                      : null}

                  </View>
                </View>
                : null}
              {this.state.table_number ?

                <View style={{ backgroundColor: '#fff', paddingHorizontal: calWidth(16), marginTop: calWidth(12) }}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: '#E2E2E2',
                    borderBottomWidth: 0.5,
                    paddingVertical: calWidth(12)
                  }}>
                    <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('table_number').val()}</PoppinsSemiBold>
                  </View>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    paddingVertical: calWidth(12)
                  }}>
                    {this.state.table_number ?
                      <View style={{}} >
                        <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{this.state.table_number}</PoppinsRegular>
                      </View>
                      : null}

                  </View>
                </View>

                : null}
              <View style={{ height: calHeight(60), width: '100%' }} />
            </>

          </ScrollView>

          {/* {this.state.loading ? <OverLay showSuccess={this.state.showSuccess} indexing={this.props.indexing} /> : null} */}

        </View >
      </Root >

    );
  }
}
export default OrderDetailsScreen;
