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
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissModal, screenIds, popToRoot, dismissAllModals, showModal } from '../../navigation';
import { Header, Container } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import CartScreen from '../CartScreen';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';


class SuccessAddItemScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeToCartScreen: false
    }
  }
  componentDidMount() {

  }

  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  render() {
    const { images = [], name = "", price = "", name_ar = "", is_offer = false, offer_amount = 0, offer_percentage = 0 } = this.props.item.item
    let totalPrice = is_offer ? offer_amount != 0 ? price - offer_amount : price - (price * offer_percentage / 100) : price

    const { quantity = "", fullOptions = [], note = "" } = this.props.item
    if (this.state.changeToCartScreen)
      return (
        <CartScreen componentId={this.props.componentId} />
      )
    return (
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            dismissModal(screenIds.SUCCESS_ADD_ITEM_SCREEN, this.props.show)
          }} style={{ flex: 1, paddingHorizontal: calWidth(8), }}>

        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          // onPress={null}
          style={{
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: calWidth(20),
            borderTopRightRadius: calWidth(20),
            padding: calWidth(16),
            // minHeight: Platform.OS == 'android' ? calWidth(300) : calWidth(350),
            justifyContent: 'space-between',
          }}>
          <View style={{}}>
            <View style={{ flexDirection: 'row', marginBottom: calWidth(20), alignItems: 'flex-start' }}>
              <View style={{ width: calWidth(64), height: calWidth(64), borderRadius: calWidth(10) }}>
                <FastImage source={{ uri: images.length ? images[0] : '' }} style={{ width: '100%', height: '100%', borderRadius: calWidth(10) }} resizeMode="contain" />
              </View>
              <View style={{ flex: 1, }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: calWidth(8) }}>
                  <View style={{ flex: 1 }}>
                    <PoppinsBold numberOfLines={1} style={{ flexWrap: 'wrap', fontSize: calWidth(16), color: '#000' }}>{context.isRTL() ? name_ar : name}</PoppinsBold>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <PoppinsRegular style={{ fontSize: calWidth(14), color: '#000' }}>{translations.get('quantity').val()}</PoppinsRegular>
                    </View>
                  </View>
                  <View>
                    <PoppinsBold style={{ fontSize: calWidth(16), color: '#000' }}>{totalPrice?.toFixed(2)} {translations.get('jd').val()}</PoppinsBold>
                    <PoppinsRegular style={{ fontSize: calWidth(14), color: '#000', textAlign: 'center' }}>{context.isRTL() ? `${quantity} X` : `X ${quantity}`}</PoppinsRegular>
                  </View>
                </View>

                {fullOptions.length > 0 ? <View style={{ paddingLeft: calWidth(8) }}>
                  <View>
                    <PoppinsBold style={{ fontSize: calWidth(16), color: "#000" }}>{translations.get('options').val()}</PoppinsBold>
                  </View>
                  {fullOptions.map(option => {
                    const { sub_option = {} } = option
                    return (
                      <View style={{ paddingLeft: calWidth(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(14), color: "#000" }}>{context.isRTL() ? sub_option.title_ar : sub_option.title}</PoppinsRegular>
                        <PoppinsRegular style={{ fontSize: calWidth(14), color: "#000", textAlign: 'center' }}>{sub_option?.price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>
                      </View>
                    )
                  })}

                </View>
                  : null}

                {note != "" ? <View style={{ paddingLeft: calWidth(8) }}>
                  <View>
                    <PoppinsBold style={{ fontSize: calWidth(16), color: Colors.mainColor2 }}>{translations.get('note').val()}</PoppinsBold>
                  </View>
                  <View style={{ paddingLeft: calWidth(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <PoppinsRegular numberOfLines={2} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(14), color: Colors.mainColor2 }}>{note}</PoppinsRegular>

                  </View>
                </View>
                  : null}


              </View>
            </View>


            <View style={{ marginBottom: calWidth(20) }}>

              <View style={{ marginBottom: calWidth(10) }}>
                <PoppinsRegular style={{ fontSize: calWidth(16), color: '#000', textAlign: 'center' }}>{this.props.merchant?.parsingFeature['indoor_cta'] ? translations.get('added_to_order').val() : translations.get('added_to_cart').val()}</PoppinsRegular>

              </View>
              {/* <View style={{ width: '100%', height: calWidth(57), backgroundColor: Colors.mainColor1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(10) }}>
                <View style={{ width: calWidth(28), height: calWidth(28) }}>

                  <Image source={require('assets/icons/cart_shopping.png')} style={{ tintColor: Colors.mainColor1, width: '100%', height: '100%' }} resizeMode="contain" />
                </View>

                <PoppinsRegular style={{ fontSize: calWidth(19), color: Colors.mainColor2, marginLeft: calWidth(8) }}>{translations.get('cart_items').val()} {this.props.cartCount}</PoppinsRegular>

              </View> */}
            </View>

          </View>

          <View>
            <TouchableOpacity
              onPress={() => {
                // dismissAllModals(this.props.componentId)
                this.onLayout()
                this.setState({
                  changeToCartScreen: true
                })
                // showModal(screenIds.CART_SCREEN, {}, {
                //   modalPresentationStyle: 'popover',
                //   modal: {
                //     swipeToDismiss: true
                //   },
                // })
              }}
              style={{
                width: '100%',
                height: calWidth(57),
                backgroundColor: Colors.mainColor1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: calWidth(10),
                marginBottom: calWidth(8)
              }}>
              <View style={{ width: calWidth(24), height: calWidth(24) }}>

                <Image source={require('assets/icons/cart_shopping.png')} style={{ tintColor: '#fff', width: '100%', height: '100%' }} resizeMode="contain" />
              </View>

              <PoppinsRegular style={{ fontSize: calWidth(19), color: "#fff", marginLeft: calWidth(8) }}>{this.props.merchant?.parsingFeature['indoor_cta'] ? translations.get('view_order').val() : translations.get('view_cart').val()}</PoppinsRegular>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.props.pop) {
                  this.props.pop()
                  dismissAllModals(this.props.show);
                } else {

                  dismissAllModals(this.props.show);
                  if (!this.props.show) {
                    // if (this.props.indexing.index == 0) {
                    //   popToRoot(screenIds.HOME_SCREEN, this.props.show);
                    // } else if (this.props.indexing.index == 1) {
                    //   popToRoot(screenIds.OFFERS_SCREEN, this.props.show);
                    // } else if (this.props.indexing.index == 2) {
                    //   popToRoot(screenIds.MENU_SCREEN, this.props.show);
                    // }
                  }
                }
              }}
              style={{ height: calWidth(57), width: '100%', alignItems: 'center', justifyContent: 'center', borderColor: Colors.mainColor1, borderRadius: calWidth(10), borderWidth: 2 }}>
              <PoppinsSemiBold style={{ fontSize: calWidth(19), color: Colors.mainColor1, marginLeft: calWidth(8) }}>{translations.get('continue_shopping').val()}</PoppinsSemiBold>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}

export default SuccessAddItemScreen;
