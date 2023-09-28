// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { useDispatch, useSelector } from 'react-redux';
import Favorite from 'src/components/Favorite';
import FullCarousel from 'src/components/FullCarousel';
import ShareIcon from 'src/components/ShareIcon';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { pop, popToRoot } from 'src/navigation';
import context from 'src/utils/context';
import { calWidth, showToastError } from 'src/utils/helpers';
import Price from './Price';
import TitleAndRate from './TitleAndRate'
import Description from './Description'
import Tabs from './Tabs'
import Colors from 'src/theme';
import translations from 'src/localization/Translations';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import Quantity from './Quantity'
import { addToCartAction } from 'src/store/actions/cartActions';
import Toast from 'react-native-simple-toast';
import { Api } from 'src/services';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UploadImage from '../UploadImage';
import { OverLay } from 'src/components/OverLay';

export default function ItemPageTypeTwo(props) {
  const [item, setItem] = useState(props?.getItem ? {} : props.item)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}

  const cart = useSelector(state => state.cart.get('cartDetails'))
  const addToCartData = useSelector(state => state.cart.get('addToCartData'))

  const token = useSelector(state => state.merchants.get('token'))
  const dispatch = useDispatch();

  useEffect(() => {
    const getConstants = async () => {
      const {
        statusBarHeight,
        TopBarHeight,
        BottomTabsHeight
      } = await Navigation.constants();
      setStatusBarHeight(statusBarHeight)
    }

    const getItem = async () => {
      const response = await Api.getItemDetailsCall({ token: token, id: props?.item?._id });
      if (response && response.data) {
        setItem(response.data)
      }
    }
    getConstants()

    if (props.getItem) {
      getItem()
    }


  }, [])




  const addToCart = () => {
    if (Object.keys(selectedOptions).length == 0 && item?.options?.length > 0 && item?.options?.filter(option => option.is_required).length) {
      showToastError(translations.get('choose_option').val())
      return;
    }
    if (true) {
      let optionsQuantity = {};
      let mainQuantity = 0;
      mainQuantity = item.quantity;
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
      Object.keys(selectedOptions).map(key => {
        Object.keys(selectedOptions[key]).map(secondKey => {
          if (!selectedOptions?.[key]?.[secondKey]?.hasOwnProperty('sub_options') && (optionsQuantity[secondKey] || 0) + quantity > selectedOptions[key][secondKey]?.quantity) {
            dontContinue = true
          }
        })
      })
      if (!dontContinue) {
        if (totalQuantity + quantity > mainQuantity) {
          dontContinue = true
        }
      }
      if (dontContinue && !parsingFeature['ignore_quantity']) {
        showToastError(translations.get('StockOut').val())
        return;
      }
    }


    if (parsingFeature['quantity_required'] && props?.item?.quantity < 0 && !parsingFeature['ignore_quantity']) {
      showToastError(translations.get('StockOut').val())
    } else {
      let options = [];
      let fullOptions = [];
      if (selectedOptions) {
        Object.keys(selectedOptions).map(key => {
          Object.keys(selectedOptions[key]).map(secondKey => {
            options.push({ option_id: key, sub_option: selectedOptions[key][secondKey].title ? selectedOptions[key][secondKey].title : "" })
            fullOptions.push({ option_id: key, sub_option: selectedOptions[key][secondKey] })
          })
        })
      }
      dispatch(addToCartAction({
        item: item,
        token: token,
        item_id: item._id,
        quantity: quantity,
        options: options.length > 0 ? options : null,
        fullOptions: fullOptions,
        note: note,
        show: false,
        pop: () => pop(props.componentId, true),
        image: image
      }))
    }
  }

  const { rate = 0, name = "", name_ar = "", is_offer = false, price = "", offer_percentage = 1, _id = "", offer_amount = 0 } = item || {}
  let totalPrice = is_offer ? offer_amount != 0 ? price - offer_amount : price - (price * offer_percentage / 100) : price
  if (selectedOptions) {
    Object.keys(selectedOptions).map(key => {
      if (selectedOptions[key]) {
        Object.keys(selectedOptions[key]).map(secondKey => {
          if (selectedOptions[key][secondKey])
            totalPrice = parseFloat(totalPrice) + parseFloat(selectedOptions[key][secondKey].price ? selectedOptions[key][secondKey].price : 0)
        })
      }
    })
  }

  return (
    <>


      <KeyboardAwareScrollView
        style={{ backgroundColor: '#fff', marginTop: -statusBarHeight, zIndex: -1, paddingTop: calWidth(40) }}
        scrollEnabled={true}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode="on-drag"
        extraScrollHeight={40}
        showsVerticalScrollIndicator={false}
      >
        {item?._id ? <>
          <FullCarousel slides={item?.images || []} style={{ height: calWidth(240), }} />
          <View style={{ flexDirection: 'row', padding: calWidth(16), justifyContent: 'space-between', }}>
            <TitleAndRate item={item} />
            <Price item={item} />
          </View>
          <Description item={item} />
          <UploadImage
            image={image}
            setImage={setImage}
          />
          <Tabs
            item={item}
            setSelectedOptions={setSelectedOptions}
            selectedOptions={selectedOptions}
            quantity={quantity}
            setQuantity={setQuantity}
            note={note}
            setNote={setNote}
          />
          <View style={{ height: 40 }}></View>
        </> : null}
      </KeyboardAwareScrollView>
      <View style={{ position: 'absolute', width: '100%', zIndex: 323232, }}>
        <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
          colors={['rgba(0,0,0,0)', '#000']}
          style={{
            // height: '100%',
            width: '100%',
            flexDirection: 'row',
            paddingLeft: calWidth(16), alignItems: 'flex-end', justifyContent: 'space-between', height: calWidth(40 + statusBarHeight), paddingBottom: calWidth(12),
          }}>
          <TouchableOpacity
            style={{ width: calWidth(34), height: calWidth(34), justifyContent: 'center', alignItems: 'center' }}
            onPress={() => pop(props.componentId, true)}
          >
            <View style={{ width: calWidth(18), height: calWidth(18) }}>
              <FastImage source={require('assets/icons/back.png')} style={[{ width: '100%', height: '100%' }, context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {},]} resizeMode="contain" tintColor={'#fff'} />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', paddingHorizontal: calWidth(16) }}>
            <Favorite item={item} />
            <View style={{ marginLeft: calWidth(10) }}>

              <ShareIcon item={item} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {item?._id ? <View style={{
        backgroundColor: '#fff',
        padding: calWidth(24),
        paddingTop: calWidth(16),
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 16,
        shadowOffset: {
          height: 6,
          width: 0
        },
        // elevation: 2,
      }}>
        <PoppinsSemiBold style={{ color: Colors.mainColor1, fontSize: calWidth(16), marginBottom: calWidth(8) }}>{translations.get('price').val()}: {(quantity * totalPrice).toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={addToCart}
            style={{ height: calWidth(46), backgroundColor: Colors.mainColor1, borderRadius: calWidth(23), flexDirection: 'row', alignItems: 'center', paddingHorizontal: calWidth(4) }}>
            <PoppinsRegular style={{ fontSize: calWidth(14), color: '#fff', marginRight: calWidth(32), marginLeft: calWidth(10) }}>{parsingFeature['indoor_cta'] ? translations.get('add_to_order').val() : translations.get('add_to_cart').val()}</PoppinsRegular>
            <View style={{ width: calWidth(36), height: calWidth(36), borderRadius: calWidth(18), backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('assets/icons/left.png')} style={[{ tintColor: Colors.mainColor1 }, context.isRTL() ? {} : { transform: [{ rotate: "180deg" }] }]} />
            </View>
          </TouchableOpacity>
        </View>
      </View> : null}
      {addToCartData?.pending ? <OverLay /> : null}
    </>
  )
}
