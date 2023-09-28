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
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, pop, push } from '../../navigation';
import { Header, Container, Root } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth, showToastError, showToastItemSuccess } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import CartCard from 'src/components/CartCard';
import store from 'src/store';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import translations from 'src/localization/Translations';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { Api } from 'src/services';
import { OverLay } from 'src/components/OverLay';
import Toast from 'react-native-simple-toast';
import context from 'src/utils/context';
import moment from 'moment';
import config from 'src/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { width, height, scale } = Dimensions.get("window");


class CheckoutScreen extends PureComponent {
  constructor(props) {
    super(props);
    const types = [];
    if (props.merchant?.parsingFeature['indoor']) {
      types.push({ id: 'indoor', title: translations.get('indoor').val(), })
    }
    if (props.merchant?.parsingFeature['delivery']) {
      types.push({ id: 'delivery', title: translations.get('delivery').val(), })
    }
    this.state = {
      cart: {},
      selectedAdress: null,
      addresses: {
        list: []
      },
      fees: 0,
      tax: 0,
      showSuccess: false,
      loading: false,
      coupon: '',
      discount: 0,
      errorMsg: '',
      coupon_id: '',
      selectedDay: props.merchant?.parsingFeature['order_for_tomorrow'] ? 'tommorow' : 'today',
      note: '',
      types: types,
      selectedType: types.length ? types[0] : {},
      table_number: '',
      users: {},
      showEnterName: false,
      name: ''
    }
    this.navigationEvents = Navigation.events().bindComponent(this);

  }
  componentDidDisappear() {
    // store.dispatch(showHideFooterAction(true))
  }
  componentWillUnmount() {
    this.navigationEvents && this.navigationEvents.remove();
  }

  componentDidMount() {
    // this.onLayout()
    this.setState({
      cart: this.props.cart
    }, () => {
      this.props.getAdresses({ token: this.props.token, first: true })
    })
    setTimeout(() => {
      this.parsingCart()
    }, 350);
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
      loading: false
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
    if (this.props.addresses.success != prevProps.addresses.success && this.props.addresses.success) {
      if (this.props.addresses.list.length) {
        let address = {};
        if (this.state.selectedAdress) {
          this.props.addresses.list.map(add => {
            if (add._id == this.state.selectedAdress) {
              address = add
            }
          })
        } else {
          address = this.props.addresses.list[0]
        }
        this.getFees(address._id)
      }
    }
  }
  renderCartCard = ({ item, index }) => {
    return <CartCard item={item} index={index} disable={true} />
  }

  renderSelectedAddress = () => {
    if (this.props.addresses.list && this.props.addresses.list.length) {
      let address = {}
      if (this.state.selectedAdress) {
        this.props.addresses.list.map(add => {
          if (add._id == this.state.selectedAdress) {
            address = add
          }
        })
      } else {
        address = this.props.addresses.list[0] || {};
      }
      const { name = "", area = "", street = "", } = address || {}
      return (
        <>
          <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{name}</PoppinsRegular>
          <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{area}</PoppinsRegular>
          <PoppinsRegular style={{ textAlign: 'left', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{street}</PoppinsRegular>

        </>
      )
    } else {
      return (null)
    }
  }

  handleCheckout = async (onlinePayment = false) => {
    if (this.state.selectedType?.id == 'delivery') {

      if (this.props.addresses.list && this.props.addresses.list.length > 0) {
        this.setState({ loading: true })
        let address = {};
        if (this.state.selectedAdress) {
          this.props.addresses.list.map(add => {
            if (add._id == this.state.selectedAdress) {
              address = add
            }
          })
        } else {
          address = this.props.addresses.list[0]
        }
        if (onlinePayment) {
          push(this.props.componentId, screenIds.ONLINE_PAYMENT_SCREEN, {
            order: {
              cart_id: this.state.cart._id,
              address_id: address._id,
              token: this.props.token,
              coupon_id: this.state.coupon_id,
              delivery_date: this.state.selectedDay == 'tommorow' ? moment().add(1, 'days') : '',
              check_out_note: this.state.note,
              total_amount: (parseFloat(this.state.cart.cart_total) + parseFloat(this.state.fees) + parseFloat(this.state.tax) - parseFloat(this.state.discount))
            }
          })
          this.setState({ loading: false })
        } else {

          const response = await Api.createOrderCall({
            cart_id: this.state.cart._id,
            address_id: address._id,
            token: this.props.token,
            coupon_id: this.state.coupon_id,
            delivery_date: this.state.selectedDay == 'tommorow' ? moment().add(1, 'days') : '',
            check_out_note: this.state.note
          })
          if (response && response.data && response.data.status == 'pending') {
            this.props.getMyOrders({ token: this.props.token })

            this.props.getCart({ token: this.props.token })
            this.setState({
              showSuccess: true
            })
          } else {
            this.setState({ loading: false })
            showToastError(translations.get('something_worng').val())
          }
        }

      } else {
        showToastError(translations.get('please_choose_address').val())
      }
    } else {
      if (this.state.table_number != "" || this.props?.merchant?.parsingFeature['indoor_hide_table']) {

        if (this.props.user?.full_name) {
          this.createIndoorOrder()
        } else {
          this.setState({
            showEnterName: true
          })
        }

      } else {
        showToastError(translations.get('please_choose_table_number').val())
      }
    }

  }
  createIndoorOrder = async () => {
    this.setState({ loading: true, showEnterName: false })
    const response = await Api.createOrderCall({
      cart_id: this.state.cart._id,
      address_id: "",
      token: this.props.token,
      coupon_id: this.state.coupon_id,
      delivery_date: this.state.selectedDay == 'tommorow' ? moment().add(1, 'days') : '',
      check_out_note: this.state.note,
      table_number: this.state.table_number
    });
    if (response && response.data && response.data.status == 'pending') {
      this.props.getMyOrders({ token: this.props.token })

      this.props.getCart({ token: this.props.token })
      this.setState({
        showSuccess: true
      })
    } else {
      this.setState({ loading: false })
      showToastError(translations.get('something_worng').val())
    }
  }
  getFees = async (addressId) => {
    this.setState({ loading: true })
    let fees = 0;
    let tax = 0;
    if (this.state.selectedType?.id != "indoor") {
      const response = await Api.getShippingFeesCall({
        cart_id: this.state.cart._id,
        address_id: addressId,
        token: this.props.token,
        future_date: this.state.selectedDay == 'tommorow'
      })

      if (response && response.data && response.data.status == 200) {
        fees = response.data.amount
      }
    }
    const response2 = await Api.getTaxCall({
      cart_id: this.state.cart._id,
      address_id: addressId,
      token: this.props.token
    })
    if (response2 && response2.data && response2.data.status == 200) {

      tax = this.props.merchant?.parsingFeature['Show_Tax'] ? response2.data.amount : 0
    }
    this.setState({
      fees: this.state.selectedType?.id != "indoor" ? fees : 0,
      tax: tax,
      loading: false
    })
  }
  applyCoupoun = async () => {
    this.setState({ loading: true })
    const response = await Api.couponCall({
      token: this.props.token,
      code: this.state.coupon
    })
    if (response && response.data && response.data.status != 400) {
      const { coupon_type = "", discount_amount = "", _id = "" } = response.data || {}
      let discount = 0
      if (coupon_type == 'percentage') {
        discount = this.state.cart.cart_total * discount_amount / 100
      } else {
        discount = discount_amount
      }
      this.setState({
        loading: false,
        coupon_type: coupon_type,
        discount: discount,
        coupon_id: _id
      })
    } else {

      this.setState({
        loading: false,
        errorMsg: response.data.message,
        discount: 0,
        coupon_type: '',
        coupon_id: ''
      })
    }
  }
  renderCoupon = () => {
    return (
      <View style={{
        marginHorizontal: calWidth(24),
        marginVertical: calWidth(16),
      }}>
        <View style={{
          // backgroundColor: '#E6E6E6',
          borderRadius: calWidth(10),

          height: calWidth(48),
          flexDirection: 'row',
          marginBottom: calWidth(8)
        }}>
          <TextInput
            style={{
              flex: 1,
              borderColor: '#E6E6E6',
              borderWidth: 1,
              borderTopLeftRadius: calWidth(10),
              borderBottomLeftRadius: calWidth(10),
              paddingHorizontal: calWidth(20),

            }}
            placeholder={translations.get('CouponCode').val()}
            placeholderTextColor="#919191"
            value={this.state.coupon}
            onChangeText={(text) => {
              this.setState({
                coupon: text,
                errorMsg: '',
              })
            }}
          />
          <TouchableOpacity
            onPress={this.applyCoupoun}
            style={{
              backgroundColor: this.state.coupon.length == 0 ? '#E6E6E6' : Colors.mainColor1,
              height: '100%',
              paddingHorizontal: calWidth(24),
              borderTopRightRadius: calWidth(10),
              borderBottomRightRadius: calWidth(10),
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <PoppinsRegular style={{
              fontSize: calWidth(16),
              color: this.state.coupon.length == 0 ? '#919191' : '#fff'
            }}>{translations.get('apply_active').val()}</PoppinsRegular>
          </TouchableOpacity>
        </View>
        {this.state.errorMsg != "" ? <PoppinsRegular style={{ fontSize: calWidth(12), color: 'red' }} >{this.state.errorMsg}</PoppinsRegular> : null}

      </View>
    )
  }
  renderDelivaryTime = () => {
    if (this.props.merchant?.parsingFeature['order_for_tomorrow'])
      return (
        <View style={{ paddingHorizontal: calWidth(24), }}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#1D2935', marginBottom: calWidth(8) }}>{translations.get('order_time').val()}</PoppinsSemiBold>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.selectedDay != 'today') {

                  this.setState({
                    selectedDay: 'today'
                  }, () => {
                    this.getFees(this.state.selectedAdress)
                  })
                }
              }}
              style={[{ marginRight: calWidth(16), paddingVertical: calWidth(10), width: calWidth(106), justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(4) }, this.state.selectedDay == 'today' ? { borderColor: "#40403D", borderWidth: 1 } : { borderColor: "#B2B2B2", borderWidth: 1 }]}>
              <Image source={require('assets/icons/today.png')} style={{ tintColor: this.state.selectedDay == 'today' ? "#40403D" : "#B2B2B2", marginBottom: calWidth(4) }} />
              <PoppinsSemiBold style={{ fontSize: calWidth(16), color: this.state.selectedDay == 'today' ? "#40403D" : "#B2B2B2", }}>{translations.get('today').val()}</PoppinsSemiBold>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.state.selectedDay != 'tommorow') {

                  this.setState({
                    selectedDay: 'tommorow'
                  }, () => {
                    this.getFees(this.state.selectedAdress)
                  })
                }
              }}
              style={[{ marginLeft: calWidth(16), paddingVertical: calWidth(10), width: calWidth(106), justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(4) }, this.state.selectedDay == 'tommorow' ? { borderColor: "#40403D", borderWidth: 1 } : { borderColor: "#B2B2B2", borderWidth: 1 }]}>
              <Image source={require('assets/icons/tommorow.png')} style={{ marginBottom: calWidth(4), tintColor: this.state.selectedDay == 'tommorow' ? "#40403D" : "#B2B2B2", }} />
              <PoppinsSemiBold style={{ fontSize: calWidth(16), color: this.state.selectedDay == 'tommorow' ? "#40403D" : "#B2B2B2", }}>{translations.get('tommorow').val()}</PoppinsSemiBold>
            </TouchableOpacity>
          </View>
        </View>
      )
    return null;
  }

  renderTypes = () => {
    return (
      <View style={{ marginHorizontal: calWidth(24), }}>
        <View style={{ flexDirection: 'row' }}>
          {this.state.types.map((type, index) => {

            return (<TouchableOpacity
              onPress={() => {
                this.setState({
                  selectedType: type
                })
              }}
              style={[{ flex: 1, padding: calWidth(12), backgroundColor: type.id == this.state.selectedType.id ? '#fff' : '#F2F2F2', borderWidth: 2, borderColor: type.id == this.state.selectedType.id ? Colors.mainColor1 : '#F2F2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: calWidth(16), borderRadius: calWidth(10) }, index == 1 ? { marginLeft: calWidth(16) } : {}]} >
              {/* <Image source={require('assets/icons/cash.png')} style={{ tintColor: Colors.mainColor1 }} /> */}
              <PoppinsBold style={{ color: type.id == this.state.selectedType.id ? Colors.mainColor1 : '#919191', fontSize: calWidth(16) }}>{type.title}</PoppinsBold>
            </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  renderIndoor = () => {
    if (this.state.selectedType?.id == "indoor") {
      return (<View style={{ marginHorizontal: calWidth(24), marginBottom: calWidth(16), flexDirection: 'row', alignItems: 'center' }}>
        <View style={{}}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000', }}>{translations.get('table_number').val()}</PoppinsSemiBold>
        </View>
        {this.props?.merchant?.parsingFeature['indoor_hide_table'] ? null : <View style={{ width: calWidth(60), backgroundColor: '#F2F2F2', borderRadius: calWidth(7), padding: calWidth(12), marginLeft: calWidth(16) }}>
          <TextInput
            style={[Platform.OS == "android" && { textAlignVertical: "top" }, {
              color: '#29292B',
              fontFamily: 'Poppins-Regular',
            }]}
            onChangeText={(text) => {
              const arNumbers = "٠١٢٣٤٥٦٧٨٩+";
              const enNumbers = "0123456789+";
              let convertedNumber = ''
              text.split('').map(t => {
                if (arNumbers.indexOf(t) > -1) {
                  convertedNumber = convertedNumber + enNumbers[arNumbers.indexOf(t)]
                } else if (enNumbers.indexOf(t) > -1) {
                  convertedNumber = convertedNumber + enNumbers[enNumbers.indexOf(t)]
                } else {
                }
              })
              this.setState({
                table_number: convertedNumber
              })
            }}
            value={this.state.table_number}
          />

        </View>}
      </View >)
    }
  }

  renderOrderDetails = () => {
    if (this.props?.merchant?.parsingFeature['hide_totalprice_checkout'])
      return null

    return (<View style={{
      backgroundColor: '#F2F2F2', borderRadius: calWidth(10),
      marginHorizontal: calWidth(24),
      paddingHorizontal: calWidth(14),
      marginVertical: calWidth(16)
    }}>

      {this.state.selectedType?.id != "indoor" ? <View style={{ paddingVertical: calWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
        <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('deliveryFees').val()}</PoppinsRegular>
        <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{this.state.fees?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>

      </View> : null}
      {this.props.merchant?.parsingFeature['Show_Tax'] ? <View style={{ paddingVertical: calWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
        <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('tax').val()}</PoppinsRegular>
        <PoppinsRegular style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{this.state.tax?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>
      </View> : null}
      <View style={{ paddingVertical: calWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
        <PoppinsRegular style={{ color: "#D92626", fontSize: calWidth(16) }}>{translations.get('discount').val()}</PoppinsRegular>
        <PoppinsRegular style={{ color: "#D92626", fontSize: calWidth(16) }}>- {this.state.discount?.toFixed(2)} {translations.get('jd').val()}</PoppinsRegular>

      </View>
      <View style={{ paddingVertical: calWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
        <PoppinsSemiBold style={{ color: "#000", fontSize: calWidth(16) }}>{translations.get('SubTotal').val()}</PoppinsSemiBold>
        <PoppinsSemiBold style={{ color: "#000", fontSize: calWidth(16) }}>{(parseFloat(this.state.cart.cart_total) + parseFloat(this.state.selectedType?.id != "indoor" ? this.state.fees : 0) + parseFloat(this.state.tax) - parseFloat(this.state.discount)).toFixed(2)} {translations.get('jd').val()}</PoppinsSemiBold>

      </View>
    </View>
    )
  }
  renderFooter = () => {
    return (
      <View style={{ marginTop: calWidth(12), backgroundColor: '#fff', paddingTop: calWidth(12) }}>
        {this.renderDelivaryTime()}
        {this.renderCoupon()}
        {this.renderOrderDetails()}
        {this.renderTypes()}
        {this.state.selectedType?.id == 'delivery' ? <TouchableOpacity
          onPress={() => push(this.props.componentId, screenIds.MY_ADDRESSES_SCREEEN, {
            checkoutPageId: this.props.componentId,
            selectedAdress: this.state.selectedAdress,
            changeAddress: (selectedAdress) => {

              this.setState({
                selectedAdress: selectedAdress._id
              })
              this.getFees(selectedAdress._id)
              showToastItemSuccess(translations.get('change_address_success').val())
            }
          })}
          style={{
            backgroundColor: '#F2F2F2', borderRadius: calWidth(10),
            marginHorizontal: calWidth(24),
            paddingHorizontal: calWidth(14),
            marginVertical: calWidth(16)
          }}>

          <View style={{ paddingVertical: calWidth(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}>
            <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('deliveryAddress').val()}</PoppinsSemiBold>
            {this.props.addresses.list && this.props.addresses.list.length ? <PoppinsSemiBold style={{ color: Colors.mainColor1, fontSize: calWidth(16) }}>{translations.get('change').val()}</PoppinsSemiBold> : null}

          </View>
          {this.props.addresses.list && this.props.addresses.list.length ?
            <View style={{ padding: calWidth(16) }}>
              {this.renderSelectedAddress()}
            </View>
            : <View style={{ justifyContent: 'center', alignItems: 'center', padding: calWidth(16) }}>
              <Image source={require('assets/icons/no_address.png')} style={{ marginBottom: calWidth(8) }} />
              <PoppinsRegular style={{ textAlign: 'center', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{translations.get('no_address').val()}</PoppinsRegular>
              <PoppinsRegular style={{ textAlign: 'center', fontSize: calWidth(16), color: '#919191' }}>{translations.get('add_new_address').val()}</PoppinsRegular>

            </View>}
        </TouchableOpacity> : null
        }
        {this.renderIndoor()}
        <View style={{
          marginHorizontal: calWidth(16),
          paddingHorizontal: calWidth(14),
          // marginVertical: calWidth(16)
        }}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000', marginBottom: calWidth(14) }}>{translations.get('paymentMethod').val()}</PoppinsSemiBold>
          <TouchableOpacity disabled={true} style={{ padding: calWidth(16), backgroundColor: '#fff', borderWidth: 2, borderColor: Colors.mainColor1, flexDirection: 'row', alignItems: 'center', marginBottom: calWidth(16), borderRadius: calWidth(10) }} >
            <Image source={require('assets/icons/cash.png')} style={{ tintColor: Colors.mainColor1 }} />
            <PoppinsBold style={{ marginLeft: calWidth(12), color: Colors.mainColor1, fontSize: calWidth(16) }}>{translations.get('cash').val()}</PoppinsBold>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.handleCheckout(true)
            }}
            disabled={!this.props.merchant?.parsingFeature['has_online_payment']}
            style={{ padding: calWidth(16), backgroundColor: '#F2F2F2', flexDirection: 'row', alignItems: 'center', marginBottom: calWidth(16), borderRadius: calWidth(10) }} >
            <Image source={require('assets/icons/credit_card.png')} />
            <PoppinsBold style={{ marginLeft: calWidth(12), color: '#919191', fontSize: calWidth(16) }}>{translations.get('credit_card').val()}</PoppinsBold>
            {this.props.merchant?.parsingFeature['has_online_payment'] ? null : <PoppinsRegular style={{ marginLeft: calWidth(4), color: '#919191', fontSize: calWidth(16) }}>({translations.get('soon').val()})</PoppinsRegular>}
          </TouchableOpacity>
        </View>
        <View style={{
          marginHorizontal: calWidth(24),
          paddingHorizontal: calWidth(14),
          marginBottom: calWidth(16)
        }}>

          {this.renderNote()}
        </View>
      </View>
    )
  }

  renderNote = () => {
    return (
      <View>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000', marginBottom: calWidth(14) }}>{translations.get('notes').val()}</PoppinsSemiBold>
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

  renderItems = () => {

    return Object.keys(this.state.users).map((key, index) => {
      return this.renderGroup(this.state.users?.[key])
    })
  }
  renderGroup = (items) => {
    let total = 0;
    if (items?.length)
      return <View key={items[0].user?._id || "jkjjjj"} style={{ backgroundColor: '#fff', marginTop: calWidth(20), paddingHorizontal: calWidth(20), paddingBottom: calWidth(20) }}>
        {<PoppinsRegular style={{ fontSize: calWidth(16), paddingTop: calWidth(8) }}>{items[0]?.user ? (items[0]?.user?.full_name || "") != "" ? items[0]?.user?.full_name : this.props.merchant?.name + " Guest" : context.isRTL() ? "قمت بإضافتها" : 'From You'}</PoppinsRegular>}
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

  renderEnterName = () => {
    return (
      <View style={[{
        height: height, width: width, position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0, backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 1212121,
        justifyContent: 'center',

      }, true ? {} : { alignItems: 'center' }]}>
        {true ?
          <View style={{ padding: calWidth(24) }}>

            <View style={{
              padding: calWidth(24),
              paddingTop: calWidth(50),
              paddingBottom: calWidth(32),
              backgroundColor: '#F2F2F2',
              borderRadius: calWidth(24),
              shadowColor: "#000",
              shadowOpacity: 0.16,
              shadowRadius: 16,
              shadowOffset: {
                height: 6,
                width: 0
              },
              elevation: 2,
            }}>

              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#000', textAlign: 'center', marginBottom: calWidth(20) }}>{translations.get('please_enter_your_name').val()}</PoppinsRegular>
              <View style={{
                // backgroundColor: '#E6E6E6',
                borderRadius: calWidth(10),

                height: calWidth(48),
                flexDirection: 'row',
                marginBottom: calWidth(16)
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderColor: '#E6E6E6',
                    borderWidth: 1,
                    borderTopLeftRadius: calWidth(10),
                    borderBottomLeftRadius: calWidth(10),
                    paddingHorizontal: calWidth(20),

                  }}
                  placeholder={translations.get('enter_your_name').val()}
                  placeholderTextColor="#919191"
                  value={this.state.name}
                  onChangeText={(text) => {
                    this.setState({
                      name: text,
                      errorMsg: '',
                    })
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (this.state.name == "") {
                    showToastError(translations.get('please_enter_your_name').val())
                    return;
                  } else {
                    this.completeRegresiter(this.state.name)
                  }
                }} style={{ backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), height: calWidth(48), justifyContent: 'center', alignItems: 'center' }}>
                <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('Confirm_Order').val()}</PoppinsRegular>
              </TouchableOpacity>
            </View>
          </View>
          : null}
      </View>
    )
  }


  completeRegresiter = async (full_name) => {
    const response = await Api.completeRegistrationCall({
      "full_name": full_name,
      token: this.props.token
    })
    // console.warn(response, "====")
    if (response && response.data && response.data.status == 200) {
      this.createIndoorOrder();
    } else {
      showToastError(translations.get('something_worng').val())
    }
  }

  render() {
    const { images = [], name = "", price = "", quantity = "", items = [], cart_total = 0 } = this.state.cart || {}
    console.warn(this.props.merchant?.parsingFeature)
    return (
      <Root>

        <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
          <SafeAreaView style={{ backgroundColor: Colors.mainColor2, }} />
          <View style={{ height: calWidth(80), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
            </TouchableOpacity>
            <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('checkout').val()}</PoppinsSemiBold>
          </View>
          <KeyboardAwareScrollView
            scrollEnabled={true}
            keyboardShouldPersistTaps='handled'
            keyboardDismissMode="on-drag"
            extraScrollHeight={60}
            showsVerticalScrollIndicator={false}
          >
            {this.renderItems()}
            {this.renderFooter()}
          </KeyboardAwareScrollView>
          <View style={{ padding: calWidth(24), paddingTop: calWidth(8) }}>
            <TouchableOpacity
              disabled={this.props.cart?.items?.length == 0}
              onPress={() => this.handleCheckout()}
              style={{ padding: calWidth(16), backgroundColor: Colors.mainColor1, flexDirection: 'row', alignItems: 'center', marginBottom: calWidth(16), borderRadius: calWidth(10), justifyContent: 'space-between' }} >
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/checkout.png')} style={{ tintColor: '#fff', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>

                <PoppinsBold style={{ marginLeft: calWidth(12), color: '#fff', fontSize: calWidth(16) }}>{translations.get('Confirm_Order').val()}</PoppinsBold>
              </View>
              <PoppinsBold style={{ fontSize: calWidth(16), color: '#fff' }}>{(parseFloat(this.state.cart.cart_total) + parseFloat(this.state.fees) + parseFloat(this.state.tax) - parseFloat(this.state.discount)).toFixed(2)} {translations.get('jd').val()}</PoppinsBold>
            </TouchableOpacity>
          </View>
          {this.state.loading || this.state.showSuccess ? <OverLay showSuccess={this.state.showSuccess} indexings={this.props.indexing} /> : null}
          {this.state.showEnterName ? this.renderEnterName() : null}

        </View >
      </Root>

    );
  }
}

export default CheckoutScreen;
