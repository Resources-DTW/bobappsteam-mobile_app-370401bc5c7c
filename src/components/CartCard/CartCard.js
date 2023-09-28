// @flow

import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
  Image,
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const { width } = Dimensions.get('window');
import FastImage from 'react-native-fast-image';
import { calWidth, showToastError } from 'src/utils/helpers';
import { push, screenIds, showModal } from 'src/navigation';
import Swipeable from 'react-native-swipeable';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { Api } from 'src/services';
import Toast from 'react-native-simple-toast';

const leftContent = <Text>Pull to activate</Text>;


class CartCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      hide: false,
      showDelete: false
    }
    this.rightButtons = [
      <TouchableOpacity activeOpacity={1} onPress={this.handleDelet} style={{ backgroundColor: '#D92626', height: calWidth(65), }} >
        <View style={{ width: calWidth(52), height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ width: calWidth(16), height: calWidth(20) }}>
            <FastImage source={require('assets/icons/trash.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity >
    ];
    this.leftButtons = [
      <TouchableOpacity activeOpacity={1} onPress={this.handleDelet} style={{ backgroundColor: '#D92626', height: calWidth(65), alignItems: 'flex-end', justifyContent: 'flex-end' }} >
        <View style={{ width: calWidth(52), height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ width: calWidth(16), height: calWidth(20) }}>
            <FastImage source={require('assets/icons/trash.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
          </View>
        </View>
      </TouchableOpacity >
    ];
  }

  handleDelet = () => {
    this.props.removeFromCart({
      index: this.props.index,
      cart_id: this.props.cart._id,
      token: this.props.token
    })
  }

  handleChangeQuantity = async (quantity, minus = false) => {
    if (true) {
      const { options: selectedOptions = [] } = this.state;
      const { item } = this.props;
      let optionsQuantity = {};
      let mainQuantity = 0;
      mainQuantity = item?.item?.quantity;
      let totalQuantity = 0;
      this.props.cart.items.map(i => {
        if (i.item?._id == item.item._id) {
          totalQuantity = totalQuantity + i.quantity;
          i.options?.map(op => {
            if (op.sub_option && op.sub_option.quantity) {
              optionsQuantity[op.sub_option.title] = optionsQuantity[op.sub_option.title] ? optionsQuantity[op.sub_option.title] + quantity : quantity
            }
          })
        }
      })
      let dontContinue = false
      // Object.keys(selectedOptions).map(key => {
      //   Object.keys(selectedOptions[key]).map(secondKey => {
      //     if (!selectedOptions?.[key]?.[secondKey]?.hasOwnProperty('sub_options') && (optionsQuantity[secondKey] || 0) + quantity > selectedOptions[key][secondKey]?.quantity) {
      //       dontContinue = true
      //     }
      //   })
      // })
      if (!dontContinue) {
        if (totalQuantity + 1 > mainQuantity) {
          dontContinue = true
        }
      }
      if (dontContinue && !minus && !this.props.merchant?.parsingFeature['ignore_quantity']) {
        showToastError(translations.get('StockOut').val())
        return;
      }
    }

    this.props.editCartItem({
      index: this.props.index,
      cart_id: this.props.cart._id,
      token: this.props.token,
      quantity: quantity
    })
  }
  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  showHide = () => {
    this.onLayout()
    this.setState(prevState => ({
      showDelete: !prevState.showDelete
    }))
  }
  renderQuantity = () => {
    const { quantity = 0, price = "", options = [] } = this.props.item || {}

    if (this.props.disable)
      return <View />

    return (<View style={{ height: calWidth(20), width: calWidth(70), borderRadius: calWidth(11), borderColor: '#707070', borderWidth: 0.3, flexDirection: 'row', }}>
      <TouchableOpacity
        onPress={() => this.handleChangeQuantity(quantity + 1)}
        activeOpacity={1}
        style={{ width: calWidth(20), justifyContent: 'center', alignItems: 'center', borderRightColor: '#707070', borderRightWidth: 0.3 }}>
        <Text style={{ fontSize: calWidth(14), fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <Text style={{ fontSize: calWidth(14), fontWeight: 'bold' }}>{quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={() => this.handleChangeQuantity(quantity - 1, true)}
        activeOpacity={1}
        style={{ width: calWidth(20), justifyContent: 'center', alignItems: 'center', borderLeftColor: '#707070', borderLeftWidth: 0.3 }}>
        <Text style={{ fontSize: calWidth(14), fontWeight: 'bold' }}>-</Text>
      </TouchableOpacity>
    </View>)
  }
  render() {
    const { quantity = 0, price = "", options = [], special_image = "" } = this.props.item || {}
    const { images = [], name = "", name_ar = "", } = this.props.item.item;
    let optionsPrice = 0;
    options.map(op => {
      if (op.price != 0) {
        optionsPrice = parseFloat(optionsPrice) + parseFloat(op.price)
      } else if (op.sub_option) {
        if (op?.sub_option?.price) {
          optionsPrice = parseFloat(optionsPrice) + parseFloat(op.sub_option?.price)
        }
      }
    })
    return (
      <TouchableOpacity
        key={this.props.index + name}
        activeOpacity={1}
        disabled={this.props.disable}
        onPress={() => {
        }}
        style={{
          flexDirection: 'row',
          flex: 1,
          paddingVertical: calWidth(12),
          borderBottomColor: '#E2E2E2',
          borderBottomWidth: 0.5
        }}>
        <View style={{ width: calWidth(95), height: calWidth(95) }}>
          <FastImage source={{ uri: special_image != "" ? special_image : images.length ? images[0] : '' }} style={{ width: '100%', height: '100%', }} resizeMode='cover' />
        </View>
        <View style={{ flex: 1, paddingHorizontal: calWidth(10), justifyContent: 'space-between' }}>
          <View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <PoppinsRegular numberOfLines={1} style={{ flex: 1, fontSize: calWidth(12), color: '#B2B1BB', }}>{context.isRTL() ? name_ar : name + name}</PoppinsRegular>
              <PoppinsBold style={{ fontSize: calWidth(12), color: '#0F0F0F', marginLeft: calWidth(4) }}>{price?.toFixed(2)} {translations.get('jd').val()}</PoppinsBold>
            </View>
            <View>
              {options.length > 0 ? <View style={{}}>
                {options.map(option => {
                  if (option?.sub_option) {
                    return (
                      <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(12), color: '#5C5C5C', }}>{this.props.merchant?.parsingFeature['hide_option_title'] ? '' : context.isRTL() ? option.title_ar + ": " : option.title + ": "}{context.isRTL() ? (option?.sub_option?.title_ar || "") != "" ? option?.sub_option?.title_ar : option?.sub_option?.title : option?.sub_option?.title}</PoppinsRegular>
                          {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : <PoppinsRegular style={{ fontSize: calWidth(12), color: "#5E5A6B", textAlign: 'center' }}>{option?.sub_option?.price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>}
                        </View>
                      </>
                    )
                  } else {

                    return (
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(12), color: '#5C5C5C', }}>{context.isRTL() ? (option.title_ar || "") != "" ? option.title_ar : option.title : option.title}</PoppinsRegular>
                        {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : <PoppinsRegular style={{ fontSize: calWidth(12), color: "#5E5A6B", textAlign: 'center' }}>{option?.price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>}
                      </View>
                    )
                  }
                })}

              </View>
                : null}
            </View>

          </View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View></View>
              <PoppinsRegular style={{ color: '#000000' }}>{translations.get('price').val() + " : " + (parseFloat(price + optionsPrice) * quantity).toFixed(2) + " " + translations.get('jd').val()}</PoppinsRegular>
            </View>
            {<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: calWidth(4) }}>
              {this.props.onlyShow ? null : this.renderQuantity()}
              {this.props.disable ?
                this.props.canRate ? <View style={{ flex: 1, alignItems: 'flex-end' }}>

                  <TouchableOpacity
                    onPress={() => {
                      showModal(screenIds.RATE_AND_REVIEW_SCREEN,
                        { item: this.props.item?.item }, {
                        modalPresentationStyle: 'popover',
                        modal: {
                          swipeToDismiss: true
                        }
                      })
                    }}
                    style={{ padding: calWidth(6), borderRadius: calWidth(4), borderWidth: 1, borderColor: Colors.mainColor1, paddingVertical: calWidth(2) }}>
                    <PoppinsRegular style={{ color: Colors.mainColor1 }}>{translations.get('rate_item').val()}</PoppinsRegular>
                  </TouchableOpacity>
                </View> : null
                : this.props.onlyShow ? null : <TouchableOpacity onPress={this.handleDelet} style={{ justifyContent: 'center', alignItems: 'center', }}>
                  <Image source={require('assets/icons/delete.png')} style={{}} />
                </TouchableOpacity>}
            </View>}
          </View>
        </View>
      </TouchableOpacity>
    )
    return (
      <TouchableOpacity
        key={this.props.index + name}
        activeOpacity={1}
        disabled={this.props.disable}
        onPress={() => {
        }}
        style={{
          marginTop: this.props.index == 0 ? calWidth(24) : 0,
          marginBottom: calWidth(10),
          marginHorizontal: calWidth(24),
          backgroundColor: 'red',
          flexDirection: 'row',
          borderRadius: calWidth(10),
          minHeight: calWidth(65),
          flex: 1,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 23,
          shadowOffset: {
            height: 3,
            width: 0
          },
          elevation: 2,
          // justifyContent: 'flex-end'
        }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>

          <TouchableOpacity style={{ flex: 1, height: '100%', alignItems: 'flex-end', borderTopRightRadius: calWidth(10), borderBottomRightRadius: calWidth(10) }} onPress={this.handleDelet}>
            <View style={{ width: calWidth(52), height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ width: calWidth(16), height: calWidth(20) }}>
                <FastImage source={require('assets/icons/trash.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              </View>
            </View>
          </TouchableOpacity>
        </View>


        <View style={{ zIndex: 23, flex: 1, left: this.state.showDelete ? -calWidth(52) : 0, backgroundColor: '#fff', borderRadius: calWidth(10), }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ height: '100%', width: calWidth(64), borderRadius: calWidth(10), backgroundColor: 'red' }}>
              <FastImage source={{ uri: images.length ? images[0] : '' }} style={{ width: '100%', height: '100%', borderRadius: calWidth(10) }} resizeMode='cover' />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: calWidth(6) }}>
              <View style={{ flex: 1, }}>

                <View style={{ flex: 1, justifyContent: 'space-between', paddingLeft: calWidth(8), }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PoppinsBold numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(16), color: "#5C5C5C" }}>{context.isRTL() ? name_ar : name}</PoppinsBold>
                    <PoppinsRegular style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: calWidth(8) }}>
                        <PoppinsRegular style={{ fontSize: calWidth(12), color: '#5C5C5C' }}>{translations.get('quantity').val()}</PoppinsRegular>
                      </View>
                      <PoppinsRegular style={{ fontSize: calWidth(12), color: Colors.mainColor1, textAlign: 'center' }}>{context.isRTL() ? `${quantity} X` : `X ${quantity}`}</PoppinsRegular>
                    </View>
                    {this.props.canRate ? <View style={{ flex: 1, alignItems: 'flex-end' }}>

                      <TouchableOpacity
                        onPress={() => {
                          showModal(screenIds.RATE_AND_REVIEW_SCREEN,
                            { item: this.props.item?.item }, {
                            modalPresentationStyle: 'popover',
                            modal: {
                              swipeToDismiss: true
                            }
                          })
                        }}
                        style={{ padding: calWidth(6), borderRadius: calWidth(4), borderWidth: 1, borderColor: Colors.mainColor1, paddingVertical: calWidth(2) }}>
                        <PoppinsRegular style={{ color: Colors.mainColor1 }}>{translations.get('rate_item').val()}</PoppinsRegular>
                      </TouchableOpacity>
                    </View> : null}
                  </View>
                </View>

                {options.length > 0 ? <View style={{ paddingLeft: calWidth(8) }}>
                  <View>
                    <PoppinsBold style={{ fontSize: calWidth(12), color: '#5C5C5C' }}>{translations.get('options').val()}</PoppinsBold>
                  </View>
                  {options.map(option => {
                    if (option?.sub_option) {
                      return (
                        <>
                          <View style={{ paddingLeft: calWidth(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(12), color: '#5C5C5C', }}>{context.isRTL() ? (option?.sub_option?.title_ar || "") != "" ? option?.sub_option?.title_ar : option?.sub_option?.title : option?.sub_option?.title}</PoppinsRegular>
                            {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : <PoppinsRegular style={{ fontSize: calWidth(12), color: Colors.mainColor2, textAlign: 'center' }}>{option?.sub_option?.price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>}
                          </View>
                        </>
                      )
                    } else {

                      return (
                        <View style={{ paddingLeft: calWidth(8), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', fontSize: calWidth(12), color: '#5C5C5C', }}>{context.isRTL() ? (option.title_ar || "") != "" ? option.title_ar : option.title : option.title}</PoppinsRegular>
                          {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : <PoppinsRegular style={{ fontSize: calWidth(12), color: Colors.mainColor2, textAlign: 'center' }}>{option?.price?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>}
                        </View>
                      )
                    }
                  })}

                </View>
                  : null}

              </View>
            </View>
            {this.props.disable ? <View style={{ width: calWidth(12) }} /> : <TouchableOpacity onPress={this.handleDelet} style={{ justifyContent: 'center', alignItems: 'center', padding: calWidth(12), }}>
              <Image source={require('assets/icons/delete.png')} style={{}} />
            </TouchableOpacity>}


          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: calWidth(8) }}>

            {this.renderQuantity()}
            <PoppinsRegular>{translations.get('total_price').val() + " : " + (parseFloat(price + optionsPrice) * quantity).toFixed(2) + " " + translations.get('jd').val()}</PoppinsRegular>
          </View>
        </View>

      </TouchableOpacity>

    );
  }
}

export default CartCard;
