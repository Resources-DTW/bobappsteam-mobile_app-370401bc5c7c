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
  TextInput,
  Animated,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, dismissModal } from '../../navigation';
import { Header, Container, Toast } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import CartCard from 'src/components/CartCard';
import store from 'src/store';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import translations from 'src/localization/Translations';
import { isValidNumber, parsePhoneNumberFromString } from 'libphonenumber-js'
import { Api } from 'src/services';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import { OverLay } from 'src/components/OverLay';
import context from 'src/utils/context';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import RNOtpVerify from 'react-native-otp-verify';


class LoginScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      height: Platform.OS == 'android' ? calWidth(300) : calWidth(400),
      phone: '',
      nationalNumber: '',
      isValid: false,
      showError: false,
      showOtp: false,
      time: 60,
      code: '',
      loading: false,
      completeReg: false,
      name: '',
      email: '',
      correctEmail: false,
      male: true,
      hash: ''
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
    this.keyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: Platform.OS === 'ios' ? '235633887075-jbnn1bhja1fn2mlqtn5297f671md8prc.apps.googleusercontent.com' : '235633887075-voo9c65vu8k835et399jsb6ko75rlioa.apps.googleusercontent.com',
      // offlineAccess: true,
      // hostedDomain: '',
      // loginHint: '',
      // forceConsentPrompt: true,
      // accountName: '',
      iosClientId: '235633887075-jbnn1bhja1fn2mlqtn5297f671md8prc.apps.googleusercontent.com'
    });
    if (Platform.OS == 'android') {
      this.startListeningForOtp()
      this.getHash()
    }
  }


  getHash = () =>
    RNOtpVerify.getHash()
      .then((hash) => {
        this.setState({ hash: hash.length ? hash[0] : "" })
      })
      .catch(console.log);

  startListeningForOtp = () =>
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => null);


  otpHandler = (message: string) => {
    const otp = /(\d{6})/g.exec(message)[1];
    this.setState({ code: otp.trim() }, () => {
      this.handleLogin()
    });
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  }

  updateTimer = (firstTime = true) => {
    this.setState({ time: 60 })

    this.Timer = setInterval(() => {
      let { time } = this.state
      if (time <= 0) {
        clearInterval(this.Timer)
      } else {
        this.setState(prevState => ({
          time: prevState.time - 1 <= 0 ? 0 : prevState.time - 1,
        }))
      }
    }, 1000)
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    if (this.Timer)
      clearInterval(this.Timer)
  }

  componentWillUnmount() {
    if (Platform.OS == 'android')
      RNOtpVerify.removeListener();

    if (this.props.showHide) {
      this.props.showHide()
    }
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  keyboardWillHide = event => {
    if (Platform.OS == 'ios') {
      this.onLayout()
      this.setState({
        height: calWidth(400)
      })
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }).start();
    }
  };
  keyboardWillShow = event => {
    if (Platform.OS == 'ios') {
      this.onLayout()
      this.setState({
        height: calWidth(600)
      })
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
      }).start();
    }
  };

  updateSize = height => {
    this.setState({
      height,
    });
  };
  handleLogin = async () => {
    Keyboard.dismiss()
    if (this.state.showOtp) {
      this.setState({ loading: true })
      const response = await Api.checkOtpCall({
        phone: "0" + this.state.nationalNumber,
        token: this.props.token,
        code: this.state.code
      })

      if (response && response.data && response.data.status === 200) {
        if (response.data.completed_registration == false) {
          this.setState({
            completeReg: true,
            loading: false
          }, () => {
            this.props.login({ token: response.data.token, noDismiss: true })
          })
        } else {
          // console.warn('eeee')
          this.props.login({ token: response.data.token, goToCheckoutPage: this.props.goToCheckoutPage })
        }
      } else {
        if (response.data.message)
          alert(response.data.message)
        else
          alert('something went wrong')
        this.setState({ loading: false })

      }

    } else {

      if (this.state.isValid) {
        this.setState({ loading: true })
        const response = await Api.loginUserCall({
          phone: "0" + this.state.nationalNumber,
          token: this.props.token,
          hash: this.state.hash
        })
        if (response && response.data && response.data.status == 200) {
          this.onLayout()
          this.updateTimer()
          this.setState({ loading: false, showOtp: true, message: response.data.message, code: '', height: Platform.OS == 'android' ? calWidth(400) : calWidth(650) })
        } else {
          this.setState({
            loading: false
          })
          if (response.data.message)
            alert(response.data.message)
          else
            alert('something went wrong')
        }

      } else {
        this.setState({
          showError: true,
          loading: false
        })
        console.log('not valid')
      }
    }
  }

  renderEditPhone = () => {
    if (this.state.showOtp)
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: calWidth(24) }}>
          <TouchableOpacity
            onPress={() => {
              this.onLayout()
              this.setState({
                showOtp: false,
                message: '',
                height: calWidth(600)
              })
            }}
            style={{
              width: calWidth(222),
              borderRadius: calWidth(19),
              backgroundColor: '#EAFFCB',
              paddingHorizontal: calWidth(16),
              paddingVertical: calWidth(8),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: calWidth(10),
            }}>
            <PoppinsMediam style={{ fontSize: calWidth(16), color: '#000' }}>{"0" + this.state.nationalNumber}</PoppinsMediam>
            <Image source={require('assets/icons/pin.png')} />
          </TouchableOpacity>
          <View style={{ width: calWidth(222), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {this.state.time !== 60 && this.state.time !== 0 ? <PoppinsMediam style={{ textAlign: 'left', color: '#919191', fontSize: calWidth(16) }}>{'00:' + ((this.state.time + "").length == 1 ? "0" + this.state.time : this.state.time)}</PoppinsMediam> : <View />}
            <TouchableOpacity
              disabled={this.state.time !== 60 && this.state.time !== 0}
              style={{ opacity: this.state.time !== 60 && this.state.time !== 0 ? 0.5 : 1 }}
              onPress={this.handleLogin}>
              <PoppinsMediam style={{ color: '#919191', fontSize: calWidth(16) }}>{translations.get('resend_otp').val()}</PoppinsMediam>
            </TouchableOpacity>
          </View>
        </View>
      )

    return null
  }

  loginWithFacebook = () => {
    // dismissModal(this.props.componentId)
    LoginManager.setLoginBehavior("native_with_fallback")
    LoginManager
      .logInWithPermissions(['public_profile'])
      .then((result) => {
        this.setState({ loading: true })
        if (result.isCancelled) {
          this.setState({ loading: false })
          return Promise.reject('Facebook login cancelled.');
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then((data) => {
        if (data.accessToken) {
          const infoRequest = new GraphRequest(
            '/me?fields=name,picture,birthday,email',
            null,
            this._responseInfoCallback
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(infoRequest).start();
        } else {
          this.setState({ loading: false })
          Alert.alert('', 'Failed to get facebook access token.');
        }
      })
      .catch((error) => {
        this.setState({ loading: false })
      });
  };

  _responseInfoCallback = (error, result) => {
    if (error) {
      this.setState({ loading: false })
    } else {
      this.completeRegresiter({
        full_name: result.name,
        "gender": this.state.male ? "male" : 'female',
        email: result.email,
        "birth_date": "",
        token: this.props.token
      })
    }
  }


  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.user) {
        this.completeRegresiter({
          full_name: userInfo.user.name,
          "gender": this.state.male ? "male" : 'female',
          email: userInfo.user.email,
          "birth_date": "",
          token: this.props.token,
          avatar: userInfo.user.photo
        })
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  completeRegresiter = async ({ full_name = "", gender = "", birth_date = "", email = "" }) => {
    const response = await Api.completeRegistrationCall({
      "full_name": full_name,
      "gender": gender,
      "birth_date": birth_date,
      "email": email,
      token: this.props.token
    })
    if (response && response.data && response.data.status == 200) {
      if (this.props.accountScreen) {
        dismissAllModals();
      } else {
        dismissModal(this.props.componentId);
        if (this.props.goToCheckoutPage)
          this.props.goToCheckoutPage();
      }
      this.props.getProfileDataAction({ token: this.props.token })
    } else {
      alert(translations.get('something_worng').val())
    }
  }

  renderCompleteReg = () => {
    if (Platform.OS == 'android')
      return (
        <View
          activeOpacity={1}
          onPress={null} style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: calWidth(8), backgroundColor: 'rgba(0,0,0,0.3)', }}>
          <View style={{ height: 100 }}></View>
          <ScrollView style={{
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: calWidth(20),
            borderTopRightRadius: calWidth(20),
            paddingTop: calWidth(24),
            minHeight: Platform.OS == 'android' ? calWidth(300) : calWidth(400),
            paddingHorizontal: calWidth(16),
            height: Platform.OS == 'android' ? calWidth(520) : calWidth(520),
          }}>
            <View
              activeOpacity={1}
              // onPress={null}
              style={{

              }}>


              <Animated.View
                style={[{ flex: 1 }, { paddingBottom: this.keyboardHeight }]}>
                <View
                  style={[this.state.showError && !this.state.isValid ? {
                    borderColor: 'red'
                  } : {
                    borderColor: this.state.name != "" ? Colors.mainColor1 : '#E6E6E6'
                  }, { borderWidth: 1, flexDirection: 'row', backgroundColor: this.state.name != "" ? '#fff' : '#E6E6E6', padding: calWidth(12), borderRadius: calWidth(10), marginBottom: calWidth(24), },
                  Platform.OS == 'android' ? { paddingVertical: calWidth(6), alignItems: 'center' } : {}
                  ]}>
                  <Image source={require('assets/icons/account_box.png')} style={{ tintColor: Colors.mainColor1 }} />
                  <TextInput
                    placeholder={translations.get('enter_your_name').val()}
                    style={[{ flex: 1, textAlign: context.isRTL() ? 'right' : 'left', fontSize: calWidth(16), marginLeft: calWidth(16) }]}
                    onChangeText={(text) => {
                      this.setState({
                        name: text
                      })
                    }}
                    value={this.state.name}
                  />
                </View>

                <View
                  style={[this.state.showError && !this.state.isValid ? {
                    borderColor: 'red'
                  } : {
                    borderColor: this.state.email != "" ? Colors.mainColor1 : '#E6E6E6'
                  }, { borderWidth: 1, flexDirection: 'row', backgroundColor: this.state.email != "" ? '#fff' : '#E6E6E6', padding: calWidth(12), borderRadius: calWidth(10), marginBottom: calWidth(24), },
                  Platform.OS == 'android' ? { paddingVertical: calWidth(6), alignItems: 'center' } : {}]}>
                  <Image source={require('assets/icons/email.png')} style={{ tintColor: Colors.mainColor1 }} />
                  <TextInput
                    placeholder={translations.get('enter_your_email').val()}
                    style={[{ flex: 1, textAlign: context.isRTL() ? 'right' : 'left', fontSize: calWidth(16), marginLeft: calWidth(16) }]}
                    onChangeText={(text) => {
                      var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                      var matches = regex.exec(text.trim());
                      if (matches && matches.length > 0) {
                        this.setState({ correctEmail: true })
                      } else {
                        this.setState({ correctEmail: false })
                      }
                      this.setState({
                        email: text.trim()
                      })
                    }}
                    value={this.state.email}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: calWidth(14) }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        male: true
                      })
                    }}
                    style={[{
                      paddingVertical: calWidth(16),
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: calWidth(10),
                      backgroundColor: '#fff',
                      shadowColor: "#7BB94D",
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 0,
                        width: 0
                      },
                      elevation: 2,
                      marginRight: calWidth(38)
                    },
                    this.state.male ? { borderColor: Colors.mainColor1, borderWidth: 1 } : {}]}
                  >
                    <Image source={require('assets/icons/male.png')} style={{ tintColor: this.state.male ? Colors.mainColor1 : '#919191', marginBottom: calWidth(14) }} />
                    <Text style={{ fontSize: calWidth(16), color: this.state.male ? Colors.mainColor1 : '#919191' }}>{translations.get('male').val()}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        male: false
                      })
                    }}
                    style={[{
                      paddingVertical: calWidth(16),
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      borderRadius: calWidth(10),
                      backgroundColor: '#fff',
                      shadowColor: "#7BB94D",
                      shadowOpacity: 0.2,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 0,
                        width: 0
                      },
                      elevation: 2,
                    },
                    !this.state.male ? { borderColor: Colors.mainColor1, borderWidth: 1 } : {}]}
                  >
                    <Image source={require('assets/icons/male.png')} style={{ marginBottom: calWidth(14), tintColor: this.state.male ? Colors.mainColor1 : '#919191' }} />
                    <Text style={{ fontSize: calWidth(16), color: this.state.male ? Colors.mainColor1 : '#919191' }}>{translations.get('female').val()}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={this.loginWithFacebook}
                  style={{ paddingHorizontal: calWidth(14), borderRadius: calWidth(10), height: calWidth(48), flexDirection: 'row', alignItems: 'center', backgroundColor: '#3C5998', marginBottom: calWidth(16) }} >
                  <Image source={require('assets/icons/facebook.png')} />
                  <Text style={{ fontSize: calWidth(16), color: '#fff', marginLeft: calWidth(12) }}>{translations.get('facebook').val()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.signIn}
                  style={{
                    paddingHorizontal: calWidth(14), borderRadius: calWidth(10), height: calWidth(48), flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginBottom: calWidth(16),
                    shadowColor: "#000",
                    shadowOpacity: 0.16,
                    shadowRadius: 16,
                    shadowOffset: {
                      height: 6,
                      width: 0
                    },
                    elevation: 2,
                  }} >
                  <View style={{ width: calWidth(32), height: calWidth(32) }}>

                    <FastImage source={require('assets/icons/google.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                  </View>
                  <Text style={{ fontSize: calWidth(16), color: '#000', marginLeft: calWidth(12) }}>{translations.get('google').val()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.completeRegresiter({
                    "full_name": this.state.name,
                    "gender": this.state.male ? "male" : 'female',
                    "birth_date": "",
                    "email": this.state.email,
                    token: this.props.token
                  })}
                  style={{
                    paddingHorizontal: calWidth(14),
                    borderRadius: calWidth(10),
                    height: calWidth(48),
                    flexDirection: 'row',
                    backgroundColor: Colors.mainColor1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} >
                  <Text style={{ fontSize: calWidth(16), color: '#fff', marginRight: calWidth(12), }}>{translations.get('next').val()}</Text>
                  <Image style={context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}} source={require('assets/icons/arrow.png')} />

                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    dismissModal(this.props.componentId);
                    if (this.props.goToCheckoutPage)
                      this.props.goToCheckoutPage()
                    if (this.props.token && this.props.getProfileDataAction)
                      this.props.getProfileDataAction({ token: this.props.token })
                  }}
                  style={{
                    paddingHorizontal: calWidth(14),
                    borderRadius: calWidth(10),
                    height: calWidth(48),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: Colors.mainColor1,
                    borderWidth: 2,
                    marginTop: calWidth(12),
                  }} >
                  <Text style={{ fontSize: calWidth(16), color: "#000", marginRight: calWidth(12), }}>{translations.get('skip').val()}</Text>
                </TouchableOpacity>
                {/* <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString())
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => console.log("logout.")} /> */}
              </Animated.View>
            </View>
          </ScrollView>
          {this.state.loading ? <OverLay /> : null}
        </View>
      );

    else
      return (
        <View
          activeOpacity={1}
          onPress={null} style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: calWidth(8), backgroundColor: 'rgba(0,0,0,0.3)', }}>

          <View
            activeOpacity={1}
            // onPress={null}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              borderTopLeftRadius: calWidth(20),
              borderTopRightRadius: calWidth(20),
              paddingTop: calWidth(24),
              minHeight: Platform.OS == 'android' ? calWidth(300) : calWidth(400),
              paddingHorizontal: calWidth(16),
              height: Platform.OS == 'android' ? calWidth(520) : calWidth(520),
            }}>


            <Animated.View
              style={[{ flex: 1 }, { paddingBottom: this.keyboardHeight }]}>
              <View
                style={[this.state.showError && !this.state.isValid ? {
                  borderColor: 'red'
                } : {
                  borderColor: this.state.name != "" ? Colors.mainColor1 : '#E6E6E6'
                }, { borderWidth: 1, flexDirection: 'row', backgroundColor: this.state.name != "" ? '#fff' : '#E6E6E6', padding: calWidth(12), borderRadius: calWidth(10), marginBottom: calWidth(24), },
                Platform.OS == 'android' ? { paddingVertical: calWidth(6), alignItems: 'center' } : {}
                ]}>
                <Image source={require('assets/icons/account_box.png')} style={{ tintColor: Colors.mainColor1 }} />
                <TextInput
                  placeholder={translations.get('enter_your_name').val()}
                  style={[{ flex: 1, textAlign: context.isRTL() ? 'right' : 'left', fontSize: calWidth(16), marginLeft: calWidth(16) }]}
                  onChangeText={(text) => {
                    this.setState({
                      name: text
                    })
                  }}
                  value={this.state.name}
                />
              </View>

              <View
                style={[this.state.showError && !this.state.isValid ? {
                  borderColor: 'red'
                } : {
                  borderColor: this.state.email != "" ? Colors.mainColor1 : '#E6E6E6'
                }, { borderWidth: 1, flexDirection: 'row', backgroundColor: this.state.email != "" ? '#fff' : '#E6E6E6', padding: calWidth(12), borderRadius: calWidth(10), marginBottom: calWidth(24), },
                Platform.OS == 'android' ? { paddingVertical: calWidth(6), alignItems: 'center' } : {}]}>
                <Image source={require('assets/icons/email.png')} style={{ tintColor: Colors.mainColor1 }} />
                <TextInput
                  placeholder={translations.get('enter_your_email').val()}
                  style={[{ flex: 1, textAlign: context.isRTL() ? 'right' : 'left', fontSize: calWidth(16), marginLeft: calWidth(16) }]}
                  onChangeText={(text) => {
                    var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    var matches = regex.exec(text.trim());
                    if (matches && matches.length > 0) {
                      this.setState({ correctEmail: true })
                    } else {
                      this.setState({ correctEmail: false })
                    }
                    this.setState({
                      email: text.trim()
                    })
                  }}
                  value={this.state.email}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: calWidth(14) }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      male: true
                    })
                  }}
                  style={[{
                    paddingVertical: calWidth(16),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    borderRadius: calWidth(10),
                    backgroundColor: '#fff',
                    shadowColor: "#7BB94D",
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 0,
                      width: 0
                    },
                    elevation: 2,
                    marginRight: calWidth(38)
                  },
                  this.state.male ? { borderColor: Colors.mainColor1, borderWidth: 1 } : {}]}
                >
                  <Image source={require('assets/icons/male.png')} style={{ tintColor: this.state.male ? Colors.mainColor1 : '#919191', marginBottom: calWidth(14) }} />
                  <Text style={{ fontSize: calWidth(16), color: this.state.male ? Colors.mainColor1 : '#919191' }}>{translations.get('male').val()}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      male: false
                    })
                  }}
                  style={[{
                    paddingVertical: calWidth(16),
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    borderRadius: calWidth(10),
                    backgroundColor: '#fff',
                    shadowColor: "#7BB94D",
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 0,
                      width: 0
                    },
                    elevation: 2,
                  },
                  !this.state.male ? { borderColor: Colors.mainColor1, borderWidth: 1 } : {}]}
                >
                  <Image source={require('assets/icons/male.png')} style={{ marginBottom: calWidth(14), tintColor: this.state.male ? Colors.mainColor1 : '#919191' }} />
                  <Text style={{ fontSize: calWidth(16), color: this.state.male ? Colors.mainColor1 : '#919191' }}>{translations.get('female').val()}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={this.loginWithFacebook}
                style={{ paddingHorizontal: calWidth(14), borderRadius: calWidth(10), height: calWidth(48), flexDirection: 'row', alignItems: 'center', backgroundColor: '#3C5998', marginBottom: calWidth(16) }} >
                <Image source={require('assets/icons/facebook.png')} />
                <Text style={{ fontSize: calWidth(16), color: '#fff', marginLeft: calWidth(12) }}>{translations.get('facebook').val()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.signIn}
                style={{
                  paddingHorizontal: calWidth(14), borderRadius: calWidth(10), height: calWidth(48), flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginBottom: calWidth(16), shadowColor: "#000",
                  shadowOpacity: 0.16,
                  shadowRadius: 16,
                  shadowOffset: {
                    height: 6,
                    width: 0
                  },
                  elevation: 2,
                }} >
                <View style={{ width: calWidth(32), height: calWidth(32) }}>

                  <FastImage source={require('assets/icons/google.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                <Text style={{ fontSize: calWidth(16), color: '#000', marginLeft: calWidth(12) }}>{translations.get('google').val()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.completeRegresiter({
                  "full_name": this.state.name,
                  "gender": this.state.male ? "male" : 'female',
                  "birth_date": "",
                  "email": this.state.email,
                  token: this.props.token
                })}
                style={{
                  paddingHorizontal: calWidth(14),
                  borderRadius: calWidth(10),
                  height: calWidth(48),
                  flexDirection: 'row',
                  backgroundColor: Colors.mainColor1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }} >
                <Text style={{ fontSize: calWidth(16), color: '#fff', marginRight: calWidth(12), }}>{translations.get('next').val()}</Text>
                <Image style={context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}} source={require('assets/icons/arrow.png')} />

              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  dismissModal(this.props.componentId);
                  if (this.props.goToCheckoutPage)
                    this.props.goToCheckoutPage()
                  if (this.props.token && this.props.getProfileDataAction)
                    this.props.getProfileDataAction({ token: this.props.token })
                }}
                style={{
                  paddingHorizontal: calWidth(14),
                  borderRadius: calWidth(10),
                  height: calWidth(48),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: Colors.mainColor1,
                  borderWidth: 2,
                  marginTop: calWidth(12)
                }} >
                <Text style={{ fontSize: calWidth(16), color: Colors.mainColor1, marginRight: calWidth(12), }}>{translations.get('skip').val()}</Text>
              </TouchableOpacity>
              {/* <LoginButton
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    console.log("login has error: " + result.error);
                  } else if (result.isCancelled) {
                    console.log("login is cancelled.");
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log(data.accessToken.toString())
                      }
                    )
                  }
                }
              }
              onLogoutFinished={() => console.log("logout.")} /> */}
            </Animated.View>
          </View>

          {this.state.loading ? <OverLay /> : null}
        </View>
      );
  }
  render() {
    if (this.state.completeReg)
      return this.renderCompleteReg()
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          dismissModal(this.props.componentId)
        }} style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: calWidth(8), backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <TouchableOpacity
          activeOpacity={1}
          // onPress={null}
          style={{
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: calWidth(20),
            borderTopRightRadius: calWidth(20),
            padding: calWidth(24),
            minHeight: Platform.OS == 'android' ? calWidth(300) : calWidth(400),
            paddingHorizontal: calWidth(16),
            height: this.state.height
          }}>
          <Animated.View
            style={[{ flex: 1 }, { paddingBottom: this.keyboardHeight }]}>
            <View style={{
              paddingHorizontal: calWidth(24),
              paddingBottom: calWidth(24)
            }}>
              <PoppinsRegular
                style={{
                  textAlign: 'center',
                  fontSize: calWidth(16),
                }}>{this.state.showOtp ? translations.get('otp_text').val() : translations.get('login_title').val()}</PoppinsRegular>
            </View>
            {this.renderEditPhone()}
            <View
              style={[this.state.showError && !this.state.isValid ? {
                borderColor: 'red'
              } : {
                borderColor: this.state.showOtp ? this.state.code != "" ? Colors.mainColor1 : '#E6E6E6' : this.state.phone != "" ? Colors.mainColor1 : '#E6E6E6'
              }, { borderWidth: 1, flexDirection: 'row', backgroundColor: this.state.showOtp ? this.state.code != "" ? '#fff' : '#E6E6E6' : this.state.phone != "" ? '#fff' : '#E6E6E6', padding: calWidth(12), borderRadius: calWidth(10), marginBottom: calWidth(24), },
              Platform.OS == 'android' ? { paddingVertical: calWidth(6), alignItems: 'center' } : {}]}>
              <Image source={this.state.showOtp ? require('assets/icons/otp.png') : require('assets/icons/mobile.png')} />
              <TextInput
                placeholder={this.state.showOtp ? translations.get('otp').val() : translations.get('mobile_number').val()}
                style={[{ flex: 1, textAlign: 'left', fontSize: calWidth(16), marginLeft: calWidth(16) }]}
                onChangeText={(text) => {
                  if (this.state.showOtp) {
                    const arNumbers1 = "٠١٢٣٤٥٦٧٨٩+";
                    const enNumbers2 = "0123456789+";
                    let convertedNumber1 = ''
                    text.split('').map(t => {
                      if (arNumbers1.indexOf(t) > -1) {
                        convertedNumber1 = convertedNumber1 + enNumbers2[arNumbers1.indexOf(t)]
                      } else if (enNumbers2.indexOf(t) > -1) {
                        convertedNumber1 = convertedNumber1 + enNumbers2[enNumbers2.indexOf(t)]
                      } else {
                      }
                    })
                    this.setState({
                      code: convertedNumber1
                    })
                  } else {

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
                    let phoneNumber = parsePhoneNumberFromString(convertedNumber, 'JO')
                    let isValid = false;
                    let nationalNumber = ""
                    if (phoneNumber) {
                      isValid = phoneNumber.isValid()
                      nationalNumber = phoneNumber.nationalNumber
                    }
                    this.setState({
                      phone: convertedNumber,
                      nationalNumber: nationalNumber,
                      isValid: isValid,
                      showError: false
                    })
                  }

                }}
                value={this.state.showOtp ? this.state.code : this.state.phone}
              />
            </View>
            <TouchableOpacity
              onPress={this.handleLogin}
              style={{
                height: calWidth(48), backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center'
              }}>
              {this.state.showOtp ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <PoppinsRegular style={{ color: '#fff', fontSize: calWidth(16), marginRight: calWidth(8) }}>{translations.get('next').val()}</PoppinsRegular>
                <Image source={require('assets/icons/next.png')} />
              </View> : <PoppinsRegular style={{ color: '#fff', fontSize: calWidth(16) }}>{translations.get('send').val()}</PoppinsRegular>}
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
        {this.state.loading ? <OverLay /> : null}
      </TouchableOpacity>
    );
  }
}

export default LoginScreen;
