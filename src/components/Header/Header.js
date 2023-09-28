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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { Root, Footer, Container } from 'native-base';
import MainFooter from '../MainFooter';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { showModal, screenIds, dissmisAndShowModal, pop, push } from 'src/navigation';
import context from 'src/utils/context';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartCount: props.cartCount ? props.cartCount : 0
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cart.success != this.props.cart.success && this.props.cart.success) {

      this.setState({ cartCount: this.props.cartCount })
    }
    if (this.props.cart.items.length != prevProps.cart.items.length) {
      this.setState({ cartCount: this.props.cartCount })
    }
  }

  render() {
    return (
      <View style={{ height: Platform.OS == 'ios' ? calWidth(100) : calWidth(70), flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32), justifyContent: 'space-between' }}>
        <TouchableOpacity
          disabled={this.props.hideBack}
          onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16), flexDirection: 'row', alignItems: 'center' }}>
          {this.props.hideBack ? null : <Image source={require('assets/icons/back_2.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />}
          <PoppinsSemiBold style={{ marginLeft: calWidth(4), fontSize: calWidth(24), color: Colors.mainColor1 }}>{this.props.title}</PoppinsSemiBold>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => {
            showModal(screenIds.CART_SCREEN, {}, {
              modalPresentationStyle: 'popover',
              modal: {
                swipeToDismiss: true
              },
            })
            // showModal(screenIds.CART_SCREEN)
          }}
          style={{ width: calWidth(60), alignItems: 'center', }}>
          <View>
            {this.state.cartCount != 0 ? <View style={{
              zIndex: 2, position: 'absolute', right: -calHeight(4), top: -calHeight(4), width: calWidth(13), height: calWidth(13), borderRadius: calWidth(13 / 2), backgroundColor: '#D6551B',
              borderWidth: 1,
              borderColor: Colors.mainColor2,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <PoppinsRegular style={{ fontSize: calWidth(7), color: '#fff' }}>{this.state.cartCount}</PoppinsRegular>
            </View> : null}
            <View style={{ zIndex: 1, width: calWidth(24), height: calWidth(24) }}>
              {this.props.merchant.parsingFeature['cart_icon_2'] ? <Image source={require('assets/icons/cart_2.png')} style={{ tintColor: Colors.shadeColor1, width: '100%', height: '100%' }} resizeMode="contain" /> : <Image source={require('assets/icons/cart_shopping.png')} style={{ tintColor: Colors.shadeColor1, width: '100%', height: '100%' }} resizeMode="contain" />}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Header;
