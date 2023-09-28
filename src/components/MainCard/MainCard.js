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
import { Header, Root, Footer, Container } from 'native-base';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { screenIds, push, showModal } from 'src/navigation';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { PoppinsBold } from 'src/fonts/PoppinsBold';

class MainCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      loadEnd: false
    }
  }
  renderOffer = () => {
    const { offer_percentage = "", offer_amount = 0 } = this.state.item || {}
    return (<View style={{ position: 'absolute', left: context.isRTL() ? -10 : -4, top: context.isRTL() ? 0 : -4, zIndex: 22 }}>
      <View style={[{ width: calWidth(96), height: calWidth(88) }, context.isRTL() ? { transform: [{ rotate: "90deg" }] } : {}]}>
        <FastImage source={require('assets/icons/offerLable.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" >
          <View style={{
            paddingTop: calWidth(10),
            transform: [{ rotate: "-40deg" }],
          }}>

            <PoppinsSemiBold style={{
              fontSize: calWidth(14), color: '#FFFFFF',
              textAlign: context.isRTL() ? 'right' : 'left',
              left: -8
            }}>{translations.get('save').val()} {offer_amount != 0 ? offer_amount + translations.get('jd').val() : offer_percentage + "%"}</PoppinsSemiBold>
          </View>
        </FastImage>
      </View>
    </View>)
  }
  renderPrice = () => {
    const { price = "", offer_percentage = 100, is_offer = false, rate = 0, offer_amount = 0 } = this.state.item || {}
    if (is_offer) {
      const newPrice = offer_amount != 0 ? price - offer_amount : price - (price * offer_percentage / 100)
      return (
        <>
          <PoppinsSemiBold style={{ textAlign: 'right', color: "#DC2028", fontSize: calWidth(13), textDecorationLine: 'line-through' }}>{price.toFixed(2)} {translations.get('jd').val()}<PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
          <PoppinsSemiBold style={{ textAlign: 'right', color: '#000', fontSize: calWidth(18), fontWeight: 'bold' }}>{newPrice.toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
        </>
      )
    }
    let starts = []
    for (let i = 0; i < 5; i++) {
      if (i < rate) starts.push(<Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.shadeColor2 }} />)
      else starts.push(<Image source={require('assets/icons/un_selected_star.png')} style={{ tintColor: Colors.shadeColor2 }} />)
    }
    return (
      <>
        <PoppinsSemiBold style={{ textAlign: 'right', color: '#000', fontSize: calWidth(16) }}>{price.toFixed(2)} {translations.get('jd').val()} <PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
        <View style={{ flexDirection: 'row' }}>
          {starts}
        </View>
      </>
    )
  }

  handlAddOrRemoveFav = () => {
    const { _id } = this.state.item || {}
    if (this.props.favList[_id]) {
      this.props.addOrRemoveFav({ id: _id, token: this.props.token })
    } else {
      this.props.addOrRemoveFav({ id: _id, add: true, token: this.props.token })
    }

  }

  handleLoadEnd = () => {
    this.setState({
      loadEnd: true
    })
  }
  render() {
    const { images = [], name = "", name_ar = "", category = {}, price = "", is_offer = false, _id = "", quantity = 0 } = this.state.item || {}
    const { name: categoryName = "", name_ar: categoryNameAr = "" } = category || {}
    const { logo = "", merchant_image = "" } = this.props.merchant || {}
    return (
      <TouchableOpacity
        onPress={() => {
          push(this.props.componentId, screenIds.ITEM_SCREEN, { item: this.state.item })
        }}
        style={[{ marginHorizontal: calWidth(24), marginBottom: calWidth(24), }, this.props.reverse ? { direction: 'rtl' } : {}]}>
        {/* {quantity <= 0 ? <View style={{ zIndex: 232323, position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: calWidth(10), }}>
          <PoppinsBold style={{ fontSize: calWidth(18), color: 'red' }}>out of stuck</PoppinsBold>
        </View> : null} */}
        <View style={{ width: calWidth(328), backgroundColor: '#fff', borderRadius: calWidth(10), }}>
          <View style={{ width: '100%', height: calWidth(180), borderTopLeftRadius: calWidth(10), borderTopRightRadius: calWidth(10), }}>
            {is_offer ? this.renderOffer() : null}
            <View>

              <FastImage onLoadEnd={this.handleLoadEnd} nativeID={`image${images.length > 0 ? images[0] : ''}`} source={images.length > 0 ? { uri: images[0] } : { uri: merchant_image }} style={{ width: '100%', height: '100%', borderTopLeftRadius: calWidth(10), borderTopRightRadius: calWidth(10), padding: calWidth(8), alignItems: 'flex-end' }} resizeMode='contain' >

                <TouchableOpacity
                  onPress={this.handlAddOrRemoveFav}
                  style={{
                    backgroundColor: '#fff',
                    width: calWidth(44),
                    height: calWidth(44),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: calWidth(7),
                    shadowColor: "#000",
                    shadowOpacity: 0.17,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 0,
                      width: 0
                    },
                    elevation: 2,
                  }}>
                  <View style={{ width: calWidth(20), height: calWidth(20) }}>
                    <FastImage source={this.props.favList[_id] ? require('assets/icons/heart_fill.png') : require('assets/icons/heart.png')} style={{ width: '100%', height: '100%', }} resizeMode="contain" />
                  </View>
                </TouchableOpacity>
              </FastImage>
              {this.state.loadEnd ? null : <FastImage source={{ uri: merchant_image }} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1 }} resizeMode="contain" />}

            </View>
          </View>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingVertical: calWidth(10), paddingHorizontal: calWidth(16) }}>
            <View style={{ justifyContent: 'space-between', flex: 1 }}>

              <PoppinsSemiBold numberOfLines={2} style={{ flexWrap: 'wrap', fontSize: calWidth(16), color: '#5C5C5C' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
              <PoppinsRegular numberOfLines={1} style={{ flexWrap: 'wrap', fontSize: calWidth(12), color: '#919191' }}>{context.isRTL() ? categoryNameAr : categoryName}</PoppinsRegular>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              {this.renderPrice()}
            </View>
          </View>

        </View>
      </TouchableOpacity >
    );
  }
}

export default MainCard;
