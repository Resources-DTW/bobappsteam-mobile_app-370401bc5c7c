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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { Header, Root, Footer, Container } from 'native-base';
import MainFooter from '../MainFooter';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { showModal, screenIds, dissmisAndShowModal, pop, push } from 'src/navigation';
import context from 'src/utils/context';
import ShareOrder from '../ShareOrder';

class MainContainer extends Component {
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
    const { logo = "", splash_logo = "" } = this.props.merchant || {}
    return (
      <Root >
        <Header style={{ flexDirection: 'row', height: this.props.normal ? calHeight(120) : this.props.cutHeader ? calHeight(100) : calHeight(120), backgroundColor: this.props.removeHeader ? Colors.mainColor3 : Colors.mainColor3, borderBottomWidth: 0, zIndex: -1 }} >
          <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: this.props.normal ? 'flex-end' : 'center', alignItems: 'center', paddingBottom: this.props.normal ? 0 : calWidth(16) }}>
            <View style={{ height: calWidth(80), width: calWidth(180), }}>
              <FastImage source={{ uri: (logo || "") != '' ? logo : splash_logo || "" }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
            </View>
          </View>
          {this.props.hide ? null : <View style={{ paddingHorizontal: calWidth(8), position: 'absolute', width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: this.props.normal ? 'flex-end' : 'center', paddingBottom: calWidth(16) }}>
            {this.props.showBack ? <TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={() => {
                pop(this.props.componentId)
                // showModal(screenIds.CART_SCREEN)
              }}
              style={{ width: calWidth(60), alignItems: 'flex-start', }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
            </TouchableOpacity> :
              this.props.search ?
                <ShareOrder /> :
                <ShareOrder />
            }
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
              style={{ width: calWidth(60), alignItems: 'flex-end', }}>
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
          }
        </Header>

        {this.props.children}

        {/* <MainFooter selected={this.props.selected} /> */}
      </Root>
    );
  }
}

export default MainContainer;
