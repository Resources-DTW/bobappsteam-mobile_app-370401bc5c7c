
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
  Platform,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, push, popToRoot } from '../../navigation';
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
import context from 'src/utils/context';
import { ScrollView } from 'react-native-gesture-handler';
import { OverLay } from 'src/components/OverLay';
import Share from 'react-native-share'
import LottieView from 'lottie-react-native';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';


class CartScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      selectTab: 'you',
      users: {},
      loading: false,
      refreshing: false
    }
    this.navigationEvents = Navigation.events().bindComponent(this);

  }
  componentWillUnmount() {
    store.dispatch(showHideFooterAction(!this.props.dontShow))
    this.navigationEvents && this.navigationEvents.remove();
  }

  componentDidMount() {
    this.onLayout();
    this.parsingCart();
    setTimeout(() => {
      this.props.getCart({ token: this.props.token })
    }, 0);
  }
  parsingCart = () => {
    this.setState({ loading: true })
    let users = {}
    this.props.cart?.items?.map((item, index) => {
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
      cart: this.props.cart,
      users: users,
      loading: false,
      refreshing: false
    })
  }

  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  componentDidUpdate(prevProps) {
    if (prevProps.cart.success != this.props.cart.success && this.props.cart.success) {
      this.onLayout()
      this.parsingCart()
    }
    if (this.props.cart.items.length != prevProps.cart.items.length && this.props.cart.success) {
      this.onLayout()
      this.parsingCart()
    }
  }
  renderCartCard = ({ item, index }) => {
    return <CartCard item={item} index={index} />
  }

  goToShop = () => {
    if (this.state.selectTab == 'you')
      return (<TouchableOpacity
        onPress={() => {
          dismissAllModals(!this.props.dontShow)
          if (this.props.indexing.index == 0) {
            popToRoot(screenIds.HOME_SCREEN);
          } else if (this.props.indexing.index == 1) {
            popToRoot(screenIds.OFFERS_SCREEN);
          } else if (this.props.indexing.index == 2) {
            popToRoot(screenIds.MENU_SCREEN);
          }
          // popToRoot(this.props.componentId)
        }}
        style={{ flexDirection: 'row', backgroundColor: '#fff', padding: calWidth(16), marginTop: calWidth(8), justifyContent: 'space-between', alignItems: 'center', }} activeOpacity={1}>
        <PoppinsRegular style={{ fontSize: calWidth(16), color: "#1D2935" }}>{translations.get('go_to_shop').val()}</PoppinsRegular>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: "#1D2935", marginRight: calWidth(4) }}>{translations.get('Add').val()}</PoppinsRegular>
          <Image source={require('assets/icons/arrow-right.png')} style={[!context.isRTL() ? {} : { transform: [{ rotate: "180deg" }] }]} />
        </View>
      </TouchableOpacity>)
    return null
  }
  renderTabs = () => {
    return (<View style={{ flexDirection: 'row', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
      <TouchableOpacity
        onPress={() => {
          this.setState({ selectTab: 'you' })
        }}
        style={{ flex: 1, paddingVertical: calWidth(16), justifyContent: 'center', alignItems: 'center', borderBottomColor: this.state.selectTab == 'you' ? "#1D2935" : '#F0F0F0', borderBottomWidth: 2 }}>
        <PoppinsRegular style={{ fontSize: calWidth(16) }} >{translations.get('from_you').val()}</PoppinsRegular>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          this.setState({ selectTab: 'other' })
        }}
        style={{ flex: 1, paddingVertical: calWidth(16), justifyContent: 'center', alignItems: 'center', borderBottomColor: this.state.selectTab == 'other' ? "#1D2935" : '#F0F0F0', borderBottomWidth: 2 }}>
        <PoppinsRegular style={{ fontSize: calWidth(16) }} >{translations.get('From_Others').val()}</PoppinsRegular>
      </TouchableOpacity>
    </View>)
  }

  onShare = () => {

    const options = {
      title: `${this.props.user?.data?.full_name ? this.props.user?.data?.full_name : this.props.merchant?.name + " Guest"} ${translations.get('ask_share').val()} ${this.props.user?.data?.gender == "femal" ? 'her' : 'him'} 
      ${translations.get('ask_share2').val()} ${this.props.user?.data?.gender == "femal" ? 'her' : 'his'} ${translations.get('ask_share3').val()} ${`https://${this.props.merchant?.subdomain}/${context.getCurrentLanguage()}/items?groupid=${this.state.cart?.group_token}`}`,
      message:
        `${this.props.user?.data?.full_name ? this.props.user?.data?.full_name : this.props.merchant?.name + " Guest"} ${translations.get('ask_share').val()} ${this.props.user?.data?.gender == "femal" ? 'her' : 'him'} 
      ${translations.get('ask_share2').val()} ${this.props.user?.data?.gender == "femal" ? 'her' : 'his'} ${translations.get('ask_share3').val()} ${`https://${this.props.merchant?.subdomain}/${context.getCurrentLanguage()}/items?groupid=${this.state.cart?.group_token}`}`,
    }
    showModal(screenIds.SHARE_DIALOG, { options: options })

  }


  renderItems = () => {
    if (this.state.selectTab == 'you') {
      return this.renderGroup(this.state.users?.['me'])
    } else {
      if (Object.keys(this.state.users).length <= 1 && this.state.users?.['me'] || Object.keys(this.state.users).length == 0) {
        return (<View >
          <FastImage source={require('assets/images/noShare.png')} style={{ width: '100%', height: calWidth(270), paddingTop: calWidth(16) }} >
            <PoppinsRegular style={{ fontSize: calWidth(21), color: '#000000', textAlign: 'center' }}>{translations.get('no_item_share').val()}</PoppinsRegular>
            <PoppinsRegular style={{ fontSize: calWidth(18), color: '#000000', textAlign: 'center' }}>{translations.get('share_with_others').val()}</PoppinsRegular>

          </FastImage>
          <TouchableOpacity
            onPress={() => {
              this.onShare()
            }}
            style={{ alignSelf: 'center', marginTop: calWidth(32) }}
          >
            <View style={{ width: calWidth(120), height: calWidth(40) }}>
              <LottieView source={require('assets/shareOrderLoti/whatsapp.json')} style={{ width: '100%', height: '100%', }}
                loop
                autoPlay
              />
            </View>
          </TouchableOpacity>
        </View>)
      } else {

        return Object.keys(this.state.users).map((key, index) => {
          if (key != 'me')
            return this.renderGroup(this.state.users?.[key])
        })
      }
    }
  }
  renderGroup = (items) => {
    let total = 0
    if (items?.length)
      return <View style={{ backgroundColor: '#fff', marginTop: calWidth(20), paddingHorizontal: calWidth(20), paddingBottom: calWidth(20) }}>
        {items[0].user ? <PoppinsRegular style={{ fontSize: calWidth(16), paddingTop: calWidth(8) }}>{items[0]?.user ? (items[0]?.user?.full_name || "") != "" ? items[0]?.user?.full_name : this.props.merchant?.name + " Guest" : ' '}</PoppinsRegular> : null}
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
          return <CartCard item={item} index={item.index} />
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


  onRefresh = () => {
    this.setState({
      refreshing: true,
    })
    this.props.getCart({ token: this.props.token })
  }
  render() {
    const { images = [], name = "", price = "", quantity = "", items = [], cart_total = 0 } = this.state.cart || {}
    return (<View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
      <SafeAreaView />
      <View style={{ paddingHorizontal: calWidth(24), width: '100%', height: calWidth(57), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
        <View style={{ flex: 1, }} >
          <TouchableOpacity
            style={{ height: '100%', justifyContent: 'center' }}
            onPress={() => {
              dismissAllModals(!this.props.dontShow)
            }}>
            <Image source={require('assets/icons/close-icon.png')} />
          </TouchableOpacity>
        </View>
        <View style={{ width: calWidth(28), height: calWidth(28) }}>
          {this.props.merchant.parsingFeature['cart_icon_2'] ? <Image source={require('assets/icons/cart_2.png')} style={{ tintColor: "#1D2935", width: '100%', height: '100%' }} resizeMode="contain" /> : <Image source={require('assets/icons/cart_shopping.png')} style={{ tintColor: "#1D2935", width: '100%', height: '100%' }} resizeMode="contain" />}
        </View>
        <PoppinsRegular style={{ fontSize: calWidth(19), color: "#1D2935", marginLeft: calWidth(8) }}>{this.props.merchant?.parsingFeature['indoor_cta'] ? translations.get('order_items').val() : translations.get('cart_items').val()} {items.length}</PoppinsRegular>
        <View style={{ flex: 1, }}></View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }
      >
        {this.renderTabs()}
        {this.goToShop()}
        {this.renderItems()}
      </ScrollView>
      <View style={{ padding: calWidth(24) }}>
        <TouchableOpacity
          disabled={this.props.cart?.items?.length == 0}
          onPress={() => {
            if (this.props.userLogin) {
              push(this.props.componentId, screenIds.CHECKOUT_SCREEN, {}, {
                // modalPresentationStyle: 'popover',
                // modal: {
                //   swipeToDismiss: true
                // },
              })
            } else {
              showModal(screenIds.LOGIN_SCREEN, {
                goToCheckoutPage: () => {
                  push(this.props.componentId, screenIds.CHECKOUT_SCREEN, {}, {
                    // modalPresentationStyle: 'popover',
                    // modal: {
                    //   swipeToDismiss: true
                    // },
                  })
                },

              }, {
                modalPresentationStyle: 'popover',
                modal: {
                  swipeToDismiss: true
                },
              })
            }
          }}
          style={{
            width: '100%',
            height: calWidth(57),
            backgroundColor: Colors.mainColor1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: calWidth(10),
            marginBottom: calWidth(8),
            paddingHorizontal: calWidth(16)
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <View style={{ width: calWidth(24), height: calWidth(24) }}>

              <Image source={require('assets/icons/checkout.png')} style={{ tintColor: '#fff', width: '100%', height: '100%' }} resizeMode="contain" />
            </View>

            <PoppinsRegular style={{ fontSize: calWidth(19), color: "#fff", marginLeft: calWidth(8) }}>{translations.get('checkout').val()}</PoppinsRegular>
          </View>
          <PoppinsBold style={{ fontSize: calWidth(16), color: '#fff' }}>{cart_total?.toFixed(2)} {translations.get('jd').val()}</PoppinsBold>
        </TouchableOpacity>


      </View>
      {this.state.loading ? <OverLay /> : null}
    </View>)

  }
}

export default CartScreen;
