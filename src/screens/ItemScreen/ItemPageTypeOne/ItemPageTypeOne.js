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
  ScrollView,
  FlatList,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight, showToastError } from 'src/utils/helpers';
import { Root, Col, Footer } from 'native-base';
import { dismissModal, pop, popToRoot } from 'src/navigation';
const { Navigation } = require('react-native-navigation');

import FullCarousel from 'src/components/FullCarousel';
import { Header } from 'native-base';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { OverLay } from 'src/components/OverLay';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import store from 'src/store';
import translations from 'src/localization/Translations';
import context from 'src/utils/context';
import Toast from 'react-native-simple-toast';
import { Api } from 'src/services';
import Options from '../ItemPageTypeTwo/Options';
import ShareIcon from 'src/components/ShareIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UploadImage from '../UploadImage';


class ItemPageTypeOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      statusBarHeight: 0,
      TopBarHeight: 0,
      rate: 0,
      selectedOption: null,
      wantedQuantity: 1.0,
      text: '',
      selectedOptions: {},
      extraPrice: 0,
      note: '',
      reviews: [],
      item: {},
      image: null
    }
    this.navigationEvents = Navigation.events().bindComponent(this);

  }
  componentWillUnmount() {
    this.navigationEvents && this.navigationEvents.remove();
  }
  componentDidDisappear() {
    store.dispatch(showHideFooterAction(true))
  }
  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }
  componentDidMount() {
    this.getConstants()
    if (this.props.getItem) {
      this.getItem()
    } else {

      const { options = [] } = this.props.item

      const onlyOptions = [];
      const optionsWithSub = [];
      options.map(option => {
        if (option && option.sub_options && option.sub_options.length) {
          optionsWithSub.push(option)
        } else {
          onlyOptions.push(option)
        }
      })
      this.setState({
        ...this.props.item,
        optionsWithSub: optionsWithSub,
        onlyOptions: onlyOptions,
        item: this.props.item
        // selectedOption: options.length ? options[0] : null
      })
      this.getItemRates()
    }

  }
  getItem = async () => {
    const response = await Api.getItemDetailsCall({ token: this.props.token, id: this.props.item._id });
    if (response && response.data) {
      const { options = [] } = response.data

      const onlyOptions = [];
      const optionsWithSub = [];
      options.map(option => {
        if (option && option.sub_options && option.sub_options.length) {
          optionsWithSub.push(option)
        } else {
          onlyOptions.push(option)
        }
      })
      this.setState({
        ...response.data,
        optionsWithSub: optionsWithSub,
        onlyOptions: onlyOptions,
        item: response.data,
        // selectedOption: options.length ? options[0] : null
      })
      this.getItemRates()
    }
  }

  getItemRates = async () => {
    const response = await Api.getItemRatesCall({ token: this.props.token, id: this.props.item._id });
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      this.setState({
        reviews: response.data.data
      })
    }
  }
  getConstants = async () => {
    const {
      statusBarHeight,
      TopBarHeight,
      BottomTabsHeight
    } = await Navigation.constants();
    this.setState({
      statusBarHeight: statusBarHeight,
      TopBarHeight: TopBarHeight
    })

  }
  renderOptions = () => {
    const { onlyOptions = [] } = this.state;
    // console.warn(onlyOptions)
    if (onlyOptions.length == 0) return null;
    else return (
      <View style={{ marginBottom: calWidth(24) }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', marginBottom: calWidth(14), opacity: 0.43, }}>{translations.get('options').val()}</PoppinsSemiBold>
        <View
          style={{
            // flex: 1,
            // flexDirection: 'row',
            // flexWrap: 'wrap',
            // justifyContent: 'center',
            // alignItems: 'center'
          }}>

          {onlyOptions.map((option, i) => (<TouchableOpacity
            onPress={() => {

              this.setState(prevState => ({
                selectedOption: prevState.selectedOption ? prevState.selectedOption._id == option._id ? null : option : option,
                // extraPrice: prevState.selectedOption ? prevState.selectedOption._id == option._id ? prevState.extraPrice - option.price : prevState.extraPrice + option.price : prevState.extraPrice + option.price,
              }))
            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              height: calWidth(52),
              backgroundColor: '#fff',
              marginBottom: calWidth(8),
              // marginHorizontal: calWidth(8),
              borderRadius: calWidth(10),
              paddingHorizontal: calWidth(8),
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.11,
              shadowRadius: 9,
              shadowOffset: {
                height: 0,
                width: 0
              },
              elevation: 2,
              borderColor: this.state.selectedOption ? this.state.selectedOption._id == option._id ? Colors.mainColor1 : '#fff' : '#fff'
            }} key={option._id}>
            <PoppinsRegular style={{ color: '#090909', fontSize: calWidth(12), textAlign: 'center', }}>{context.isRTL() ? option.title_ar : option.title}</PoppinsRegular>
            {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : option.price ? option.price == 0 ? <View /> : <PoppinsRegular style={{ textAlign: 'center', color: '#707070', fontSize: calWidth(12) }}>+ {option?.price?.toFixed(2)} {translations.get('jd').val()} </PoppinsRegular> : <View />}

          </TouchableOpacity>))
          }
        </View>
      </View>
    )
  }

  renderSubOptions = (mainOption = {}) => {
    const { sub_options = [] } = mainOption || {}
    let selectedOption = this.state.selectedOptions[mainOption._id] || {};

    return (
      <View
        key={mainOption._id}
        style={{
          marginBottom: calWidth(24),
          backgroundColor: '#fff',
          shadowColor: "#000",
          shadowOpacity: 0.11,
          shadowRadius: 9,
          shadowOffset: {
            height: 0,
            width: 0
          },
          elevation: 2,

          borderRadius: calWidth(10)
        }}>
        <View style={{ padding: calWidth(8), }}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', marginBottom: calWidth(4), }}>{context.isRTL() ? mainOption.title_ar : mainOption.title}</PoppinsSemiBold>
        </View>
        <View style={{
          // flex: 1,
          // flexDirection: 'row',
          // flexWrap: 'wrap',
          // justifyContent: 'center',
          // alignItems: 'center'
        }}>

          {sub_options.map((option, i) => (<TouchableOpacity
            onPress={() => {
              this.setState(prevState => ({
                selectedOptions: {
                  ...prevState.selectedOptions,
                  [mainOption._id]: prevState.selectedOptions[mainOption._id] ? prevState.selectedOptions[mainOption._id].title == option.title ? null : option : option,
                },
              }))
            }}
            style={{
              flexDirection: 'row',
              // marginBottom: calWidth(8),
              // marginHorizontal: calWidth(2),
              // borderRadius: calWidth(10),
              paddingHorizontal: calWidth(8),
              paddingVertical: calWidth(8),
              alignItems: 'center',
              justifyContent: 'space-between',
              // borderWidth: 2,
              backgroundColor: selectedOption ? selectedOption.title == option.title ? '#F9F9F9' : '#fff' : '#fff'
            }} key={option.title}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: calWidth(16), height: calWidth(16), borderRadius: calWidth(8), borderWidth: 1, borderColor: Colors.mainColor1,
                backgroundColor: selectedOption ? selectedOption.title == option.title ? Colors.mainColor1 : '#fff' : '#fff'
              }}></View>
              <PoppinsRegular style={{ marginLeft: calWidth(8), color: '#090909', fontSize: calWidth(12), textAlign: 'center', }}>{context.isRTL() ? option.title_ar : option.title}</PoppinsRegular>
            </View>
            {this.props.merchant?.parsingFeature['hide_option_price'] ? <View /> : option.price ? option.price == 0 ? <View /> : <PoppinsRegular style={{ textAlign: 'center', color: '#000', fontSize: calWidth(12) }}>+ {option?.price?.toFixed(2)} {translations.get('jd').val()} </PoppinsRegular> : <View />}

          </TouchableOpacity>))
          }
        </View>
      </View>
    )
  }
  renderQuantity = () => {

    let calPrice = 0
    if (this.state.selectedOption && this.state.selectedOption.price) {
      calPrice = this.state.wantedQuantity * this.state.selectedOption.price
    } else {
      calPrice = this.state.wantedQuantity * this.state.price
    }
    return (
      <View style={{ marginBottom: calWidth(16) }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#474C55', marginBottom: calWidth(16) }}>{translations.get('quantity_1').val()}</PoppinsSemiBold>
        <View style={{ height: calWidth(40), borderRadius: calWidth(10), flexDirection: 'row', backgroundColor: Colors.tintColor1, marginBottom: calWidth(10) }}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.wantedQuantity > 1) {
                this.setState(prevState => ({
                  wantedQuantity: prevState.wantedQuantity - 1
                }))
              }
            }}
            style={{ justifyContent: 'center', alignItems: 'center', width: calWidth(40), backgroundColor: Colors.mainColor1, borderTopLeftRadius: calWidth(10), borderBottomLeftRadius: calWidth(10) }}>
            <Image source={require('assets/icons/minus.png')} />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PoppinsSemiBold style={{ fontSize: calWidth(20), color: Colors.mainColor2 }}>{this.state.wantedQuantity}</PoppinsSemiBold>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (this.state.wantedQuantity < this.state.quantity) {
                this.setState(prevState => ({
                  wantedQuantity: prevState.wantedQuantity + 1
                }))
              } else {
                showToastError(translations.get('StockOut').val())
              }
            }}
            style={{ justifyContent: 'center', alignItems: 'center', width: calWidth(40), backgroundColor: Colors.mainColor1, borderTopRightRadius: calWidth(10), borderBottomRightRadius: calWidth(10) }}>
            <Image source={require('assets/icons/plus.png')} />
          </TouchableOpacity>
        </View>
        <PoppinsSemiBold style={{ textAlign: 'center', fontSize: calWidth(16), color: '#474C55' }}>{translations.get('price').val()}:<Text style={{ color: Colors.mainColor2 }}> {calPrice?.toFixed(2)} {translations.get('jd').val()}</Text></PoppinsSemiBold>
      </View>
    )
  }

  addToCart = () => {

    const { selectedOptions = {}, item = {}, wantedQuantity: quantity = 0 } = this.state;
    const { cart = {} } = this.props;
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
      if (dontContinue && !this.props.merchant?.parsingFeature['ignore_quantity']) {
        showToastError(translations.get('StockOut').val())
        return;
      }
    }

    if (this.props.merchant?.parsingFeature['quantity_required'] && this.props?.item?.quantity < 0 && !this.props.merchant?.parsingFeature['ignore_quantity']) {
      showToastError(translations.get('StockOut').val())
    } else {

      let options = [];
      let fullOptions = [];
      const { selectedOptions = {} } = this.state || {}
      if (selectedOptions) {
        Object.keys(selectedOptions).map(key => {
          Object.keys(selectedOptions[key]).map(secondKey => {
            options.push({ option_id: key, sub_option: selectedOptions[key][secondKey].title ? selectedOptions[key][secondKey].title : "" })
            fullOptions.push({ option_id: key, sub_option: selectedOptions[key][secondKey] })
          })
        })
      }

      this.props.addToCart({
        item: this.props.item,
        token: this.props.token,
        item_id: this.state._id,
        quantity: this.state.wantedQuantity,
        options: options.length > 0 ? options : null,
        fullOptions: fullOptions,
        note: this.state.note,
        show: false,
        pop: () => popToRoot(this.props.componentId),
        image: this.state.image
      })
      this.setState({ note: '' })
    }
  }
  renderDescription = () => {
    if ((this.state.description || "") != "")
      return (
        <>
          <PoppinsRegular style={{ marginHorizontal: calWidth(10), fontSize: calWidth(12), color: '#7B8495', marginBottom: calWidth(16) }}>{context.isRTL() ? this.state.description_ar : this.state.description}</PoppinsRegular>
        </>
      )
    return null
  }

  renderNote = () => {
    return (
      <View>
        <PoppinsRegular style={{ fontSize: calWidth(11), color: Colors.mainColor2, marginBottom: calWidth(8) }}>{translations.get('notes').val()}</PoppinsRegular>
        <View style={{ flex: 1, height: calWidth(80), backgroundColor: '#F2F2F2', borderRadius: calWidth(7), padding: calWidth(12) }}>
          <TextInput
            numberOfLines={4}
            editable={true}
            multiline={true}
            maxLength={750}
            style={[Platform.OS == "android" && { textAlignVertical: "top" }, {
              flex: 1,

              color: '#29292B',
              fontFamily: 'Poppins-Regular',

            }]}
            onChangeText={(text) => {
              this.setState({
                note: text
              })
            }}
            value={this.state.note}
          />

        </View>
      </View>
    )
  }


  handlAddOrRemoveFav = () => {
    const { _id } = this.state || {}
    if (this.props.favList[_id]) {
      this.props.addOrRemoveFav({ id: _id, token: this.props.token })
    } else {
      this.props.addOrRemoveFav({ id: _id, add: true, token: this.props.token })
    }

  }
  renderContent = () => {
    const { rate = 0, name = "", name_ar = "", is_offer = false, price = "", offer_percentage = 1, _id = "", offer_amount = 0 } = this.state
    let totalPrice = is_offer ? offer_amount != 0 ? price - offer_amount : price - (price * offer_percentage / 100) : price


    return (
      <>
        <View style={{
          position: 'absolute', zIndex: 3232, height: calWidth(this.state.statusBarHeight + 70), width: '100%',

        }}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            colors={['#000000', 'rgba(0,0,0,0)']}
            style={{
              position: 'absolute',
              flex: 1,
              opacity: 0.24,
              zIndex: 1,
              width: '100%',
              height: '100%'
            }}>

          </LinearGradient>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: calWidth(24),
            paddingBottom: calWidth(16),
            zIndex: 22,
          }}>

            <TouchableOpacity
              onPress={() => { pop(this.props.componentId) }}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: calWidth(4), borderRadius: calWidth(8) }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
              <PoppinsRegular style={{ fontSize: calWidth(16), color: Colors.mainColor1, marginLeft: calWidth(8) }}>{translations.get('back').val()}</PoppinsRegular>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginRight: calWidth(10) }}>

                <ShareIcon item={this.state.item} />
              </View>
              <TouchableOpacity
                onPress={this.handlAddOrRemoveFav}
                style={{
                  backgroundColor: '#fff',
                  width: calWidth(34),
                  height: calWidth(34),
                  borderRadius: calWidth(7),
                  shadowColor: "#D6551B",
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  shadowOffset: {
                    height: 5,
                    width: 5
                  },
                  elevation: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                <View style={{ width: calWidth(20), height: calWidth(20) }}>
                  <FastImage source={this.props.favList[_id] ? require('assets/icons/heart_fill.png') : require('assets/icons/heart.png')} style={{ width: '100%', height: '100%', }} resizeMode="contain" />
                </View>
                {/* <Image source={require('assets/icons/heart_white.png')} style={{ tintColor: '#D6551B' }} /> */}
              </TouchableOpacity>

            </View>
          </View>
        </View>


        <FullCarousel slides={this.state.images} />
        {true ? <View style={{ justifyContent: 'space-between', alignItems: 'center', position: 'absolute', top: calWidth(204), right: calWidth(24), backgroundColor: Colors.mainColor2, width: calWidth(35), height: calWidth(85), borderRadius: calWidth(7) }}>
          <TouchableOpacity
            onPress={() => {
              if (this.props.merchant?.parsingFeature['quantity_required']) {

                if (this.state.wantedQuantity < this.state.quantity) {
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
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('assets/icons/plus.png')} style={{ tintColor: Colors.mainColor1 }} />
          </TouchableOpacity>
          <View style={{ width: calWidth(31), height: calWidth(31), borderRadius: calWidth(31 / 2), backgroundColor: Colors.mainColor1, justifyContent: 'center', alignItems: 'center' }}>
            <PoppinsBold style={{ fontSize: calWidth(15), color: '#fff' }}>{this.state.wantedQuantity}</PoppinsBold>

          </View>
          <TouchableOpacity
            onPress={() => {
              if (this.state.wantedQuantity > 1) {
                this.setState(prevState => ({
                  wantedQuantity: prevState.wantedQuantity - 1
                }))
              }
            }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('assets/icons/minus.png')} style={{ tintColor: Colors.mainColor1 }} />
          </TouchableOpacity>
        </View> : null}

        <View style={{ marginTop: calWidth(16), paddingHorizontal: calWidth(24), }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <PoppinsBold style={{ fontSize: calWidth(20), color: '#29292B' }}>{context.isRTL() ? name_ar : name}</PoppinsBold>
            {is_offer ? <PoppinsBold style={{ fontSize: calWidth(16), color: Colors.mainColor2, textDecorationLine: 'line-through', marginLeft: calWidth(20) }}>
              {price?.toFixed(2)} {translations.get('jd').val()}
            </PoppinsBold> : null}
          </View>
          <View style={{ flexDirection: 'row', marginBottom: calWidth(16), flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('assets/icons/star_1.png')} style={{ tintColor: Colors.shadeColor2 }} />
              <PoppinsSemiBold style={{ marginLeft: calWidth(2), fontSize: calWidth(10), color: Colors.mainColor1, marginTop: 2 }}>{rate.toFixed(1)}</PoppinsSemiBold>
            </View>
            {is_offer ? <View style={{ marginLeft: calWidth(14), paddingVertical: calWidth(4), paddingHorizontal: calWidth(10), borderRadius: calWidth(9), backgroundColor: '#DC2028', justifyContent: 'center', alignItems: 'center' }}>
              <PoppinsBold style={{ fontSize: calWidth(9), color: '#fff', }}>{translations.get('save').val()} {offer_amount != 0 ? offer_amount + translations.get('jd').val() : offer_percentage + "%"}</PoppinsBold>
            </View> : null}
          </View>
          {this.renderDescription()}
          <UploadImage
            image={this.state.image}
            setImage={(image) => {
              this.setState({ image: image })
            }}
          />
          <Options
            setSelectedOptions={(selectedOptions) => {
              this.setState({
                selectedOptions
              })
            }}
            selectedOptions={this.state.selectedOptions}
            item={this.state?.item || {}}
          />
          {this.renderNote()}
        </View>

      </>
    )
  }

  renderReviews = () => {
    if (this.state.reviews.length == 0) return null;
    return (
      <View style={{ padding: calWidth(24) }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#474C55', marginBottom: calWidth(12) }}>{translations.get('Reviews').val()}</PoppinsSemiBold>
        {this.state.reviews.map(review => this.renderReview(review))}
      </View>
    )
  }
  renderReview = (review) => {
    const { rater = {}, rate_value = 0, comment = "" } = review || {};
    const { avatar = "", full_name = "" } = rater || {};
    const { logo = "", splash_logo = "", name = "" } = this.props.merchant || {}

    var starts = []
    for (let i = 0; i < 5; i++) {
      if (i < rate_value) starts.push(<Image source={require('assets/icons/star.png')} style={{ tintColor: Colors.mainColor1 }} />)
      else starts.push(<Image source={require('assets/icons/un_selected_star.png')} style={{ tintColor: Colors.mainColor2 }} />)
    }
    return (
      <View style={{ marginBottom: calWidth(16), backgroundColor: Colors.mainColor3, borderRadius: calWidth(8), padding: calWidth(8) }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: calWidth(45), height: calWidth(45), borderRadius: calWidth(10) }}>
              <FastImage source={avatar != "" ? { uri: avatar } : { uri: splash_logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(10) }} resizeMode={avatar != "" ? 'cover' : 'contain'} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#474C55', marginLeft: calWidth(8) }}>{full_name}</PoppinsRegular>
              <View style={{ flexDirection: 'row', }}>
                {starts}
              </View>
            </View>
            <View>
              <PoppinsRegular style={{ fontSize: calWidth(14), color: '#7B8495', marginLeft: calWidth(8) }}>{comment}</PoppinsRegular>
            </View>
          </View>
        </View>
      </View>
    )
  }
  render() {
    const { rate = 0, name = "", name_ar = "", is_offer = false, price = "", offer_percentage = 1, _id = "", offer_amount = 0 } = this.state
    let totalPrice = is_offer ? offer_amount != 0 ? price - offer_amount : price - (price * offer_percentage / 100) : price

    const { selectedOptions = {} } = this.state || {}
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
      <Root>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode="on-drag"
          extraScrollHeight={40}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#fff', marginTop: -this.state.statusBarHeight }}>
          {Platform.OS == 'ios' ? <KeyboardAvoidingView
            behavior="position"
            enabled
          >
            {this.renderContent()}
          </KeyboardAvoidingView> :
            this.renderContent()
          }
          {this.renderReviews()}
        </KeyboardAwareScrollView>
        <View style={{ height: calWidth(107), backgroundColor: '#fff' }}>
          <Image source={require('assets/icons/footer.png')} style={{ position: 'absolute', width: '100%', height: '100%', tintColor: Colors.mainColor2 }} >
          </Image>
          <TouchableOpacity
            onPress={this.addToCart}
            style={{
              alignSelf: 'flex-end',
              width: calWidth(160),
              height: calWidth(60),
              backgroundColor: Colors.mainColor1,
              borderRadius: calWidth(10),
              marginRight: calWidth(24),
              shadowColor: "#006F40",
              shadowOpacity: 0.24,
              shadowRadius: 10,
              shadowOffset: {
                height: -5,
                width: 5
              },
              elevation: 2,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Image source={require('assets/icons/add_cart.png')} />
            <PoppinsRegular style={{ fontSize: calWidth(19), color: '#fff', marginLeft: calWidth(8) }}>{this.props.merchant?.parsingFeature['indoor_cta'] ? translations.get('add_to_order').val() : translations.get('add_to_cart').val()}</PoppinsRegular>
          </TouchableOpacity>
          <View style={{ padding: calWidth(24), paddingTop: 0 }}>

            <PoppinsSemiBold style={{ color: '#fff', fontSize: calWidth(16) }}>{translations.get('price').val()}: {(parseFloat(this.state.wantedQuantity) * parseFloat(totalPrice)).toFixed(2)}</PoppinsSemiBold>
          </View>
        </View>
        {this.props.addToCartData.pending ? <OverLay /> : null}
      </Root>
    );
  }
}

export default ItemPageTypeOne;
