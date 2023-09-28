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
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight, showToastError } from 'src/utils/helpers';
import { Header, Root, Footer, Container } from 'native-base';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { screenIds, push, showModal } from 'src/navigation';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Toast from 'react-native-simple-toast';

class EasyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      wantedQuantity: 1,
      itemId: '',
      loadEnd: false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.addToCartData.success != prevProps.addToCartData.success && this.props.addToCartData.success && this.state.itemId == this.props.item?._id) {
      this.setState({
        itemId: '',
        wantedQuantity: 1
      })
    } else if (this.props.addToCartData.error != prevProps.addToCartData.error && this.props.addToCartData.error && this.state.itemId == this.props.item?._id) {
      this.setState({
        itemId: '',
        wantedQuantity: 1
      })
    }
  }
  renderOffer = () => {
    const { offer_percentage = "", offer_amount = 0 } = this.state.item || {}
    return (<View style={{ position: 'absolute', right: context.isRTL() ? -4 : -4, top: context.isRTL() ? 0 : -4, zIndex: -1, }}>
      <View style={[{ width: calWidth(96), height: calWidth(88) }, context.isRTL() ? {} : { transform: [{ rotate: "90deg" }] }]}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: calWidth(4) }}>
          <PoppinsSemiBold style={{ textAlign: 'left', color: "#DC2028", fontSize: calWidth(10), textDecorationLine: 'line-through' }}>{price.toFixed(2)} {translations.get('jd').val()}<PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
          <PoppinsSemiBold style={{ textAlign: 'left', color: '#000', fontSize: calWidth(12), marginLeft: calWidth(4) }}>{newPrice.toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
        </View>
      )
    }
    return (
      <View style={{ marginBottom: calWidth(4) }}>
        <PoppinsSemiBold style={{ textAlign: 'left', color: '#000', fontSize: calWidth(12) }}>{price.toFixed(2)} {translations.get('jd').val()} <PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
      </View>
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

  addToCart = () => {
    if (!this.state.selectedOption && this.props.item?.options?.length > 0 && this.props.item?.options?.filter(option => option.is_required).length) {
      showToastError(translations.get('choose_option').val());
      push(this.props.componentId, screenIds.ITEM_SCREEN, { item: this.props.item })

      return;
    }
    const { item = {}, wantedQuantity: quantity = 0 } = this.state;
    const { cart = {} } = this.props;

    if (true) {
      let optionsQuantity = {};
      let mainQuantity = item.quantity;
      let totalQuantity = 0;
      cart.items.map(i => {
        if (i.item?._id == item._id) {
          totalQuantity = totalQuantity + i.quantity;
          i.options?.map(op => {
            if (op.sub_option && op.sub_option.quantity) {
              optionsQuantity[op.sub_option.title] = optionsQuantity[op.sub_option.title] ? optionsQuantity[op.sub_option.title] + quantity : quantity
            }
          })
        }
      })
      let dontContinue = false
      if (!dontContinue && mainQuantity >= 0) {
        if (totalQuantity + quantity > mainQuantity) {
          dontContinue = true
        }
      }
      if (dontContinue && !this.props.merchant?.parsingFeature['ignore_quantity']) {
        showToastError(translations.get('StockOut').val())
        return;
      }
    }


    if (this.props.merchant?.parsingFeature['quantity_required'] && this.props?.item?.quantity < 0 && !this.props.merchant?.parsingFeature['ignore_quantity']) {
      showToastError(translations.get('StockOut').val())
    } else {

      this.setState({
        itemId: this.props.item._id,
      })
      let options = [];
      let fullOptions = [];
      if (this.state.selectedOption) {
        options.push({ option_id: this.state.selectedOption._id, sub_option: '' })
        fullOptions.push({ option_id: this.state.selectedOption._id, sub_option: this.state.selectedOption })
      }
      if (this.state.selectedOptions) {
        Object.keys(this.state.selectedOptions).map(key => {
          options.push({ option_id: key, sub_option: this.state.selectedOptions[key].title })
          fullOptions.push({ option_id: key, sub_option: this.state.selectedOptions[key] })
        })
      }
      this.props.addToCart({
        item: this.props.item,
        token: this.props.token,
        item_id: this.props.item._id,
        quantity: this.state.wantedQuantity,
        // options: options.length > 0 ? options : null,
        // fullOptions: fullOptions,
        note: '',
        show: true
      })
    }

  }

  renderQuantity = () => {
    return (
      <View style={{ height: calWidth(24), flexDirection: 'row', marginBottom: calWidth(4), alignItems: 'center', width: "60%", alignSelf: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            if (this.props.merchant?.parsingFeature['quantity_required']) {
              if (this.state.wantedQuantity < this.props?.item?.quantity) {
                this.setState(prevState => ({
                  wantedQuantity: prevState.wantedQuantity + 1
                }))
              } else {
                showToastError(translations.get('StockOut').val())

              }
            } else {
              this.setState(prevState => ({
                wantedQuantity: prevState.wantedQuantity + 1
              }))
            }
          }}
          style={{ width: calWidth(24), height: calWidth(24), backgroundColor: Colors.mainColor1, borderRadius: calWidth(12), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: calWidth(14), color: '#FFF', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}></View>
        <View
          style={{ flex: 1, zIndex: -22, backgroundColor: '#F0F0F0', height: calWidth(20), justifyContent: 'center', alignItems: 'center', position: 'absolute', left: 0, right: 0 }}
        >
          <Text>{this.state.wantedQuantity}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if (this.state.wantedQuantity > 1) {
              this.setState(prevState => ({
                wantedQuantity: prevState.wantedQuantity - 1
              }))
            }
          }}
          style={{ width: calWidth(24), height: calWidth(24), backgroundColor: Colors.mainColor1, borderRadius: calWidth(12), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: calWidth(14), color: '#FFF', fontWeight: 'bold' }}>-</Text>
        </TouchableOpacity>
      </View >
    )
  }
  renderAddToCart = () => {
    return (
      <View style={{ flex: 1, height: calWidth(22), backgroundColor: Colors.mainColor1, borderRadius: calWidth(4), flexDirection: 'row', marginRight: calWidth(4) }}>

        <TouchableOpacity
          activeOpacity={1}
          onPress={this.addToCart}
          disabled={this.props.addToCartData.pending}
          style={{ flex: 1, height: '100%', borderRadius: calWidth(4), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
        >
          {this.props.addToCartData.pending && this.state.itemId == this.props.item?._id ?
            <ActivityIndicator color="#fff" />
            : <>
              <Text style={{ color: '#fff', fontSize: calWidth(14) }}>{this.props.merchant?.parsingFeature['indoor_cta'] ? translations.get('add_to_order').val() : translations.get('add_to_cart').val()}</Text>
            </>}
        </TouchableOpacity>

      </View>
    )

  }

  handleLoadEnd = () => {
    this.setState({
      loadEnd: true
    })
  }

  render() {
    if (this.props.item.empty)
      return (<View style={[
        this.props.item.hide ? {
          width: calWidth(140),
          padding: calWidth(8),
          borderRadius: calWidth(6),
          height: calWidth(180),
          margin: calWidth(4),
          marginVertical: this.props.flex ? calWidth(4) : calWidth(16),
        } :
          {
            width: calWidth(140),
            padding: calWidth(8),
            borderRadius: calWidth(6),
            height: calWidth(180),
            backgroundColor: this.props.item.hide ? 'transparent' : '#fff',
            margin: calWidth(4),
            shadowColor: "#80828B",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            shadowOffset: {
              height: 2,
              width: 0
            },
            elevation: 2,
            marginVertical: this.props.flex ? calWidth(8) : calWidth(16),
          }, this.props.flex ? { flex: 1, } : {},]}>
      </View>)
    const { images = [], name = "", name_ar = "", category = {}, price = "", is_offer = false, _id = "", quantity = 0 } = this.state.item || {}
    const { name: categoryName = "", name_ar: categoryNameAr = "" } = category || {}
    const { logo = "", merchant_image = "" } = this.props.merchant || {}

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          push(this.props.componentId, screenIds.ITEM_SCREEN, { item: this.props.item })
        }}
        style={[{
          width: calWidth(140),
          padding: calWidth(8),
          borderRadius: calWidth(6),
          backgroundColor: '#fff',
          margin: calWidth(4),
          shadowColor: "#80828B",
          shadowOpacity: 0.15,
          shadowRadius: 15,
          shadowOffset: {
            height: 6,
            width: 0
          },
          elevation: 2,
          marginVertical: this.props.flex ? calWidth(8) : calWidth(16),
        }, this.props.flex ? { flex: 1, } : {},
        this.props.reverse ? { direction: 'rtl' } : {}]}>
        {is_offer ? this.renderOffer() : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: -1 }}>
          <View style={{ width: calWidth(24), height: calWidth(14), justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(2) }}>
            {/* <PoppinsBold style={{ color: '#6E7989', fontSize: calWidth(8) }}>{this.state.wantedQuantity} Q</PoppinsBold> */}
          </View>
          <TouchableOpacity
            onPress={this.handlAddOrRemoveFav}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOpacity: 0.17,
              shadowRadius: 10,
              shadowOffset: {
                height: 0,
                width: 0
              },
              elevation: 2,
              zIndex: 22
            }}>
            <View style={{ width: calWidth(14), height: calWidth(14) }}>
              <FastImage source={this.props.favList[_id] ? require('assets/icons/heart_fill.png') : require('assets/icons/heart.png')} style={{ width: '100%', height: '100%', }} resizeMode="contain" />
            </View>
          </TouchableOpacity>

        </View>
        <View style={{ height: this.props.flex ? calWidth(120) : calWidth(80), width: '100%', marginBottom: calWidth(8), zIndex: -222, }}>
          <FastImage onLoadEnd={this.handleLoadEnd} source={images.length > 0 ? { uri: images[0] } : { uri: merchant_image }} style={{ width: '100%', height: '100%', zIndex: 22, }} resizeMode='contain' />
          {this.state.loadEnd ? null : <FastImage source={{ uri: merchant_image }} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1 }} resizeMode="contain" />}
        </View>
        <View style={{ flex: 1 }}>

          <PoppinsSemiBold numberOfLines={2} style={{ flexWrap: 'wrap', fontSize: calWidth(11), color: '#000', }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
        </View>
        {this.renderPrice()}
        <View style={{}}>
          {this.renderQuantity()}
          {this.renderAddToCart()}
        </View>
      </TouchableOpacity >
    )

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
            <FastImage nativeID={`image${images.length > 0 ? images[0] : ''}`} source={images.length > 0 ? { uri: images[0] } : { uri: '' }} style={{ width: '100%', height: '100%', borderTopLeftRadius: calWidth(10), borderTopRightRadius: calWidth(10), padding: calWidth(8), alignItems: 'flex-end' }} resizeMode='contain' >

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

export default EasyCard;
