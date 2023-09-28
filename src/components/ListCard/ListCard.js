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
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { push, screenIds, showModal } from 'src/navigation';
import translations from 'src/localization/Translations';
import context from 'src/utils/context';

class ListCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      loadEnd: false
    }
  }

  renderOffer = () => {
    const { offer_percentage = "", offer_amount = 0 } = this.state.item || {}
    return (<View style={{ position: 'absolute', left: -4, top: -4, zIndex: 22 }}>
      <View style={[{ width: calWidth(61), height: calWidth(61), }, context.isRTL() ? { transform: [{ rotate: "90deg" }] } : {}]}>
        <FastImage source={require('assets/icons/offerLable.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" >
          <View style={{
            paddingTop: calWidth(8),
            transform: [{ rotate: "-40deg" }],
          }}>

            <PoppinsSemiBold style={{
              fontSize: calWidth(10), color: '#FFFFFF',
              textAlign: context.isRTL() ? 'right' : 'left',
              left: -4,
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
    return (
      <>
        <PoppinsSemiBold style={{ textAlign: 'right', color: '#000', fontSize: calWidth(16) }}>{price.toFixed(2)} {translations.get('jd').val()} <PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#919191' }}></PoppinsSemiBold></PoppinsSemiBold>
        <View>
          <Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.shadeColor2 }} />
        </View>
      </>
    )
  }

  handleLoadEnd = () => {
    this.setState({
      loadEnd: true
    })
  }
  render() {
    const { images = [], name = "", name_ar = "", category = {}, price = "", is_offer = false } = this.state.item || {}
    const { name: categoryName = "", name_ar: categoryName_ar = "", } = category || {}
    const { logo = "", merchant_image = "" } = this.props.merchant || {}

    return (
      <TouchableOpacity
        // onPress={() => push(this.props.componentId, screenIds.ITEM_SCREEN, { item: this.state.item }, {
        //   // animations: {
        //   //   push: {
        //   //     sharedElementTransitions: [
        //   //       {
        //   //         fromId: `image${images.length > 0 ? images[0] : ''}`,
        //   //         toId: `image${images.length > 0 ? images[0] : ''}Dest`,
        //   //       }
        //   //     ]
        //   //   },
        //   //   pop: {
        //   //     sharedElementTransitions: [
        //   //       {
        //   //         toId: `image${images.length > 0 ? images[0] : ''}`,
        //   //         fromId: `image${images.length > 0 ? images[0] : ''}Dest`,
        //   //       }
        //   //     ]
        //   //   },
        //   // }
        // })}
        onPress={() => {
          push(this.props.componentId, screenIds.ITEM_SCREEN, { item: this.state.item })
        }}
        style={{ marginHorizontal: calWidth(24), marginBottom: calWidth(24) }}>
        <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: calWidth(8), flexDirection: 'row', padding: calWidth(3) }}>
          {is_offer ? this.renderOffer() : null}
          <View style={{ width: calWidth(61), height: "100%", borderRadius: calWidth(8) }}>


            <FastImage onLoadEnd={this.handleLoadEnd} nativeID={`image${images.length > 0 ? images[0] : ''}`} source={images.length > 0 ? { uri: images[0] } : { uri: merchant_image }} style={{ width: '100%', height: '100%', borderRadius: calWidth(8), }} resizeMode='cover' >
            </FastImage>
            {this.state.loadEnd ? null : <FastImage source={{ uri: merchant_image }} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1, borderRadius: calWidth(8), }} resizeMode="contain" />}

          </View>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingVertical: calWidth(10), paddingHorizontal: calWidth(16) }}>
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <PoppinsSemiBold numberOfLines={2} style={{ flexWrap: 'wrap', fontSize: calWidth(16), color: '#5C5C5C' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
              <PoppinsRegular numberOfLines={1} style={{ flexWrap: 'wrap', fontSize: calWidth(12), color: '#919191' }}>{context.isRTL() ? categoryName_ar : categoryName}</PoppinsRegular>
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              {this.renderPrice()}

            </View>
          </View>

        </View>
      </TouchableOpacity>
    );
  }
}

export default ListCard;
