// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
  TextInput,
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';
import MainContainer from 'src/components/MainContainer';

import { WebView } from 'react-native-webview';
import { Api } from 'src/services';
// import OppwaCore from 'react-native-oppwa'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { calWidth, showToastError } from 'src/utils/helpers';
import { OverLay } from 'src/components/OverLay';
import { popToRoot, showModal, screenIds, pop } from 'src/navigation';
import Colors from 'src/theme';
import { Container } from 'native-base';
import context from 'src/utils/context';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
const OppwaCore = NativeModules.RNOppwa;
PaymentEvents = new NativeEventEmitter(OppwaCore);
import Toast from 'react-native-simple-toast';
import config from 'src/config';
const { RNMeps } = NativeModules;

const onlinePayment = "meps";
class OnlinePaymentScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      cardNumberError: null,
      holderNameError: null,
      cardNumber: "",
      holderName: '',
      date: '',
      CVV: '',
      dateError: null,
      CVVError: null,
      loading: false,
      response: null,
      showSuccess: false
    }
  }

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    if (Platform.OS == 'android') {

      PaymentEvents.addListener('transactionStatus', data => {
        if (data.status == 'transactionFailed') {
          this.setState({
            loading: false
          })

          showToastError(translations.get('something_worng').val())

        } else {
          if (data.redirectURL) {
            // this.setState({ loading: false })
            this.openLink(data.redirectURL);
          }
          // open this url in webview to proceeed with the payment
        }
      });
    }
  }
  componentWillUnmount() {
    if (Platform.OS == 'android')
      PaymentEvents.removeListener('transactionStatus')
    Linking.removeEventListener('url', this.handleOpenURL)
  }
  handleOpenURL = async (event) => {
    InAppBrowser.close()
    let url = '';
    // console.warn({ event })
    if (event.url.indexOf('resourcePath=') > -1) {
      url = event.url.split('resourcePath=')[1].split('&')
    } else {
      // url = event.url.split('aljuneidi://result?')[1].split('&')
    }
    // let obj = {};
    // url.map(ss => {
    //   const res = ss.split("=")
    //   obj = {
    //     ...obj,
    //     [res[0]]: res[1]
    //   }
    // })
    // console.warn({ obj, url })
    // this.props.createOrder({
    //   onlinePayment: true,
    //   authToken: this.props.token,
    //   id: obj.id
    // })
    const response = await Api.createOrderCall({
      ...this.props.order,
      resourcePath: url[0]
    })
    if (response && response.data && response.data.status == 'pending') {
      this.props.getMyOrders({ token: this.props.token })
      this.props.getCart({ token: this.props.token })
      this.setState({
        showSuccess: true,
        cardNumber: "",
        holderName: '',
        date: '',
        CVV: '',
      })
    } else {
      this.setState({ loading: false })
      showToastError(translations.get('something_worng').val())
    }


  }

  pay = () => {
    if (this.props.merchant?.parsingFeature['meps_integration']) {
      this.startPaymentUsingMeps()
    } else if (this.props.merchant?.parsingFeature['hayperpay_integration']) {
      this.startPaymentUsingHyperPay()
    }
  }
  startPaymentUsingMeps = async () => {
    this.setState({ loading: true })
    const response = await Api.startPaymentSessionCall({ token: this.props.token })
    if (response && response.data && response.data.result == 'SUCCESS') {
      const splitDate = this.state.date.split("/")

      if (Platform.OS == 'ios') {
        RNMeps.startPayment([
          response.data.session.id.toString(),
          this.state.holderName.toString(),
          this.state.cardNumber.split('\u00a0').join("").toString(),
          splitDate[0].toString(),
          splitDate[1].toString(),
          this.state.CVV.toString()
        ], (result) => {
          if (result && result.session) {
            this.createOrderMeps(result.session)
          } else {
            this.setState({ loading: false })
            showToastError(result)
          }
        });
      } else {

        RNMeps.startPayment({
          sessionId: response.data.session.id.toString(),
          cardholderName: this.state.holderName.toString(),
          cardNumber: this.state.cardNumber.split('\u00a0').join("").toString(),
          expiryMonth: splitDate[0].toString(),
          expiryYear: splitDate[1].toString(),
          cvv: this.state.CVV.toString()
        }).then(result => {
          if (result && result.session) {
            this.createOrderMeps(result.session)
          } else {
            this.setState({ loading: false })
            showToastError(result)
          }
        }).catch(e => {
          this.setState({ loading: false })
          showToastError(e.message)

        })
      }

    } else {
      this.setState({ loading: false })
      showToastError(response.data.message)
    }

  }

  createOrderMeps = async (session_id) => {
    const response = await Api.createOrderCall({
      ...this.props.order,
      session_id: session_id
    })
    if (response && response.data && response.data.status == 'pending') {
      this.props.getMyOrders({ token: this.props.token })
      this.props.getCart({ token: this.props.token })
      this.setState({
        showSuccess: true,
        cardNumber: "",
        holderName: '',
        date: '',
        CVV: '',
      })
    } else {
      this.setState({ loading: false })
      showToastError(translations.get('something_worng').val())
    }

  }
  startPaymentUsingHyperPay = async () => {
    this.setState({ loading: true })
    let response = {}
    if (this.state.response) {
      response = this.state.response
    } else {
      response = await Api.createOnlineOrderCall({
        ...this.props.order
      })
    }
    if (response && response.data && response.data.id) {
      this.setState({ response })
      const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''
      let paymentBrand = startNumber == '4' ? 'VISA' : startNumber == "5" ? 'MASTER' : 'American Express'.toUpperCase()
      const splitDate = this.state.date.split("/")
      OppwaCore.transactionPayment({
        checkoutID: response.data.id.toString(),
        holderName: this.state.holderName,
        cardNumber: this.state.cardNumber.split('\u00a0').join(""),
        paymentBrand: paymentBrand,
        expiryMonth: splitDate[0],
        expiryYear: '20' + splitDate[1],
        cvv: this.state.CVV,
        shopperResultURL: config.GooglePackageName + ".payments://result"
      }).then(res => {
        if (Platform.OS == 'ios') {
          if (res.redirectURL) {
            this.openLink(res.redirectURL)
          } else {
            this.setState({ loading: false })
            showToastError(translations.get('something_worng').val())

          }
        }
      }).catch(e => {
        this.setState({ loading: false })
        showToastError(e.message)

      })
    } else {
      this.setState({ loading: false })
      showToastError(response.data.data ? response.data.data : translations.get('something_worng').val())
    }
  }

  async openLink(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        }).then((response) => {
          // this.setState({
          //   loading: false
          // })
          // if (
          //   response.type === 'success' &&
          //   response.url
          // ) {
          //   Linking.openURL(response.url)
          // }
        })
      }
      else Linking.openURL(url)
    } catch (error) {
      this.setState({ loading: false })
      showToastError(error.message);
      // this.props.sendMessage({
      //   type: 'danger',
      //   msg: error.message
      // })
      // Alert.alert(error.message)
    }
  }
  onChangeText = (text) => {
    const arNumbers = "٠١٢٣٤٥٦٧٨٩";
    const enNumbers = "0123456789";
    let convertedNumber = ''
    text.split('').map(t => {
      if (arNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[arNumbers.indexOf(t)]
      } else if (enNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[enNumbers.indexOf(t)]
      } else {
      }
    })
    const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''
    let maxNumber = startNumber == '4' || startNumber == '5' ? 16 : 15

    if (convertedNumber.length <= maxNumber) {

      let cardNumber = [];
      let count = 0;
      let bbbb = ""
      let formattedText = convertedNumber.split('\u00a0').join('');
      if (formattedText.length > 0) {
        formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join('\u00a0');
      }
      this.setState({
        cardNumber: formattedText
      }, () => {
        if (this.state.cardNumberError)
          this.checkCardNumber()
      })
    }
  }
  checkCardNumber = () => {
    const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''

    let parsedNumber = this.state.cardNumber.split('\u00a0').join("")
    let maxNumber = startNumber == '4' || startNumber == '5' ? 16 : 15
    if (startNumber != "" && startNumber != "4" && startNumber != "3" && startNumber != "5") {
      this.setState({
        cardNumberError: translations.get('user_support_credit').val()
      })
    } else if (parsedNumber.length != maxNumber) {
      this.setState({
        cardNumberError: translations.get('insert_number').val() + maxNumber + ` ${translations.get('digits').val()}`
      })
    } else if (parsedNumber.length == maxNumber) {
      let paymentBrand = startNumber == '4' ? 'VISA' : startNumber == "5" ? 'MASTER' : 'American Express'.toUpperCase()
      OppwaCore.isValidNumber({ cardNumber: parsedNumber, paymentBrand: paymentBrand }).then(result => {
        this.setState({ cardNumberError: null })
      }).catch(e => {

        this.setState({
          cardNumberError: translations.get('correct_card_number').val()
        })
      })
      this.setState({ cardNumberError: null })
      if (this.state.CVV != "")
        this.checkCVV()
    }
  }
  checkHolderName = () => {
    if (this.state.holderName.trim() == "") {
      this.setState({
        holderNameError: translations.get('card_name').val()
      })
    } else {
      this.setState({ holderNameError: null })
    }
  }

  onChangeTextDate = (text) => {
    const arNumbers = "٠١٢٣٤٥٦٧٨٩";
    const enNumbers = "0123456789";
    let convertedNumber = ''
    text.split('').map(t => {
      if (arNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[arNumbers.indexOf(t)]
      } else if (enNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[enNumbers.indexOf(t)]
      } else {
      }
    })
    if (convertedNumber.length <= 4) {

      let date = "";
      let count = 0;
      for (let i = 0; i < convertedNumber.length; i++) {
        count++;
        if (count % 2 == 0 && count !== 0 && count != convertedNumber.length) {
          date = date + convertedNumber[i] + "/"
        } else {
          date = date + convertedNumber[i]
        }
      }
      if (date.length == 1 && date[0] != 0 && date[0] != 1) {
        date = "0" + date
      }
      if (date.length == 2 && date.indexOf('/') == -1 && date[0] != 0 && (date[1] != 0 && date[1] != 1 && date[1] != 2)) {
        date = "0" + date[0] + "/" + date[1]
      }

      this.setState({
        date: date.trim()
      }, () => {
        if (this.state.dateError)
          this.checkDate()
      })
    }
  }

  checkDate = () => {
    if (this.state.date == "") {
      this.setState({
        dateError: translations.get('expir_date').val()
      })
    } else if (this.state.date.length != 5) {
      this.setState({
        dateError: translations.get('expir_date').val()
      })
    } else if (this.state.date.length == 5) {
      this.setState({
        dateError: null
      })
    }
  }

  onChangeTextCVV = (text) => {
    const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''
    let maxLenght = startNumber == '3' ? 4 : 3
    const arNumbers = "٠١٢٣٤٥٦٧٨٩";
    const enNumbers = "0123456789";
    let convertedNumber = ''
    text.split('').map(t => {
      if (arNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[arNumbers.indexOf(t)]
      } else if (enNumbers.indexOf(t) > -1) {
        convertedNumber = convertedNumber + enNumbers[enNumbers.indexOf(t)]
      } else {
      }
    })
    if (convertedNumber.length <= maxLenght) {


      this.setState({
        CVV: convertedNumber.trim()
      }, () => {
        if (this.state.CVVError)
          this.checkCVV()
      })
    }
  }

  checkCVV = () => {
    const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''
    let maxLenght = startNumber == '3' ? 4 : 3
    if (this.state.CVV == "") {
      this.setState({
        CVVError: translations.get('wrong_cvv').val()
      })
    } else if (this.state.CVV.length != maxLenght) {
      this.setState({
        CVVError: translations.get('wrong_cvv').val()
      })
    } else if (this.state.CVV.length == maxLenght) {
      this.setState({
        CVVError: null
      })
    }
  }
  canBeDisabled = () => {
    if (this.state.cardNumber == "" || this.state.holderName == "" || this.state.date == "" || this.state.CVV == "") {
      return true
    }
    else if (this.state.cardNumberError || this.state.holderNameError || this.state.dateError || this.state.CVVError) {
      return (true)
    } else {
      return false
    }
  }
  _replaceSpace = (str) => {
    return str
  }
  render() {
    const startNumber = this.state.cardNumber.length ? this.state.cardNumber[0] : ''
    let disabled = this.canBeDisabled()
    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
        <View style={{ height: calWidth(80), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'flex-end', paddingBottom: calWidth(8) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16), paddingBottom: 0 }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('credit_card').val()}</PoppinsSemiBold>
        </View>

        <ScrollView style={{ backgroundColor: Colors.mainColor3, }}>
          <View style={{ padding: calWidth(16), }}>
            <View style={{ marginBottom: calWidth(8) }}>
              <PoppinsRegular style={{ fontSize: calWidth(12), color: '#000' }}>{translations.get('card_number').val()}</PoppinsRegular>
              <View style={[this.state.cardNumberError ? { borderWidth: 1, borderColor: '#E90607', marginBottom: calWidth(4) } : {}, { flexDirection: context.isRTL() ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: '#F1F2F4', height: calWidth(45), paddingHorizontal: calWidth(16), borderRadius: calWidth(5) }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {startNumber == "" ? <Image source={require('assets/icons/money-card.png')} /> : startNumber == '3' ? <Image source={require('assets/icons/money-card.png')} /> : null}
                  {startNumber == "" ? <Image source={require('assets/icons/master.png')} style={{ marginLeft: calWidth(8) }} /> : startNumber == '5' ? <Image source={require('assets/icons/master.png')} style={{ marginLeft: calWidth(8) }} /> : null}
                  {startNumber == "" ? <Image source={require('assets/icons/visa.png')} style={{ marginLeft: calWidth(8) }} /> : startNumber == '4' ? <Image source={require('assets/icons/visa.png')} style={{ marginLeft: calWidth(8) }} /> : null}

                </View>
                <TextInput
                  style={{
                    flex: 1,
                    textAlign: 'left',
                    // fontFamily: Platform.OS == 'ios' ? 'Montserrat-Light' : 'MontserratLight',
                    fontSize: calWidth(14),
                  }}
                  keyboardType="decimal-pad"
                  placeholder="4010 1112 1234 4445"
                  onChangeText={this.onChangeText}
                  value={this._replaceSpace(this.state.cardNumber)}
                  onBlur={this.checkCardNumber}
                />
              </View>
              {this.state.cardNumberError ? <PoppinsRegular style={{ color: '#E90607' }}>{this.state.cardNumberError}</PoppinsRegular> : null}
            </View>

            <View style={{ marginBottom: calWidth(8) }}>
              <PoppinsRegular style={{ fontSize: calWidth(12), color: '#000' }}>{translations.get('holder_name').val()}</PoppinsRegular>
              <View style={[this.state.holderNameError ? { borderWidth: 1, borderColor: '#E90607', marginBottom: calWidth(4) } : {}, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: '#F1F2F4', height: calWidth(45), paddingHorizontal: calWidth(16), borderRadius: calWidth(5) }]}>
                <TextInput
                  style={{
                    flex: 1,
                    textAlign: context.isRTL() ? 'right' : 'left',
                    // fontFamily: Platform.OS == 'ios' ? 'Montserrat-Light' : 'MontserratLight',
                    fontSize: calWidth(14)
                  }}
                  placeholder="Holder name"
                  onChangeText={(text) => {

                    this.setState({
                      holderName: text
                    }, () => {
                      if (this.state.holderNameError)
                        this.checkHolderName()
                    })
                  }}
                  value={this.state.holderName}
                  onBlur={this.checkHolderName}
                />
              </View>
              {this.state.holderNameError ? <PoppinsRegular style={{ color: '#E90607' }}>{this.state.holderNameError}</PoppinsRegular> : null}
            </View>

            <View style={{ flexDirection: 'row', marginBottom: calWidth(16) }}>

              <View style={{ flex: 1, }}>
                <PoppinsRegular style={{ fontSize: calWidth(12), color: '#000' }}>{translations.get('exp_date').val()}</PoppinsRegular>
                <View style={[this.state.dateError ? { borderWidth: 1, borderColor: '#E90607', marginBottom: calWidth(4) } : {}, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: '#F1F2F4', height: calWidth(45), maxHeight: calWidth(45), paddingHorizontal: calWidth(16), borderRadius: calWidth(5) }]}>
                  <TextInput
                    style={{
                      flex: 1,
                      textAlign: context.isRTL() ? 'right' : 'left',
                      // fontFamily: Platform.OS == 'ios' ? 'Montserrat-Light' : 'MontserratLight',
                      fontSize: calWidth(14)
                    }}
                    keyboardType="decimal-pad"
                    placeholder="MM / YY"
                    onChangeText={this.onChangeTextDate}
                    value={this.state.date}
                    onBlur={this.checkDate}
                  />
                </View>
                {this.state.dateError ? <PoppinsRegular style={{ color: '#E90607' }}>{this.state.dateError}</PoppinsRegular> : null}
              </View>

              <View style={{ flex: 1, marginLeft: calWidth(6), }}>
                <PoppinsRegular style={{ fontSize: calWidth(12), color: '#000' }}>CVV</PoppinsRegular>
                <View style={[this.state.CVVError ? { borderWidth: 1, borderColor: '#E90607', marginBottom: calWidth(4) } : {}, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: '#F1F2F4', height: calWidth(45), maxHeight: calWidth(45), paddingHorizontal: calWidth(16), borderRadius: calWidth(5) }]}>
                  <TextInput
                    style={{
                      flex: 1,
                      textAlign: context.isRTL() ? 'right' : 'left',
                      // fontFamily: Platform.OS == 'ios' ? 'Montserrat-Light' : 'MontserratLight',
                      fontSize: calWidth(14)
                    }}
                    keyboardType="decimal-pad"
                    placeholder="CVV"
                    onChangeText={this.onChangeTextCVV}
                    value={this.state.CVV}
                    onBlur={this.checkCVV}
                  />
                </View>
                {this.state.CVVError ? <PoppinsRegular style={{ color: '#E90607' }}>{this.state.CVVError}</PoppinsRegular> : null}
              </View>

            </View>

            <TouchableOpacity
              onPress={this.pay}
              // disabled={disabled}
              style={{
                flex: 1, height: calWidth(45), backgroundColor: Colors.mainColor1, borderRadius: calWidth(5),
                justifyContent: 'center', alignItems: 'center',
                // opacity: disabled ? 0.5 : 1
              }}>
              <PoppinsRegular style={{ color: '#fff', fontSize: calWidth(16) }}>{translations.get('pay').val()}</PoppinsRegular>
            </TouchableOpacity>

          </View>
        </ScrollView>
        {this.state.loading || this.state.showSuccess ? <OverLay showSuccess={this.state.showSuccess} indexings={this.props.indexing} /> : null}
      </View >
    );
  }
}

export default OnlinePaymentScreen;
