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
  ScrollView,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { push, screenIds, showModal } from 'src/navigation';
import MainContainer from 'src/components/MainContainer';
import translations from 'src/localization/Translations';
import context from 'src/utils/context';
import { logoutApp } from 'src/navigation/setRoot';
import { Navigation } from 'react-native-navigation';
import Rate, { AndroidMarket } from 'react-native-rate'
import config from 'src/config';

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: 'WhatsApp', title: translations.get('whatsup').val(),
          icon: require('assets/icons/whats.png'),
          goTo: () => {
            const { whatsapp = "" } = this.props.merchant || {}

            Linking.canOpenURL('https://api.whatsapp.com/send?' + 'phone=' + whatsapp)
              .then(supported => {
                if (!supported) {
                  Alert.alert(
                    'Please install whats app!'
                  );
                } else {
                  return Linking.openURL('https://api.whatsapp.com/send?' + 'phone=' + whatsapp).catch(e => console.warn(e));
                }
              })
          }
        },
        {
          id: 'Terms',
          hide: props.merchant?.parsingFeature['Hide_privacypolicy_terms&condtions'],
          title: translations.get('terms').val(),
          icon: require('assets/icons/rightArrow.png'), goTo: () => {
            push(this.props.componentId, screenIds.WIDGET_SCREEN, {
              title: translations.get('terms').val(),
              uri: `https://${this.props.merchant.subdomain}/${context.getCurrentLanguage()}/terms-and-conditions`
            })
          }
        },
        {
          id: 'PrivacyPolicy',
          hide: props.merchant?.parsingFeature['Hide_privacypolicy_terms&condtions'],
          title: translations.get('privacy').val(),
          icon: require('assets/icons/rightArrow.png'),
          goTo: () => {

            push(this.props.componentId, screenIds.WIDGET_SCREEN, {
              title: translations.get('privacy').val(),
              uri: `https://${this.props.merchant.subdomain}/${context.getCurrentLanguage()}/privacy-policy`
            })
          }
        },
        {
          id: 'RateOurApp', title: translations.get('rate').val(), icon: null,
          goTo: () => {
            const options = {
              AppleAppID: config.AppleAppID,
              GooglePackageName: config.GooglePackageName,
              OtherAndroidURL: "https://bobapps.co",
              preferredAndroidMarket: AndroidMarket.Google,
              preferInApp: false,
              openAppStoreIfInAppFails: true,
              fallbackPlatformURL: "https://bobapps.co",
            }
            Rate.rate(options, success => {
              if (success) {
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                this.setState({ rated: true })
              }
            })
          }
        },
        {
          id: 'changeLang', title: translations.get('change_lang').val(), icon: null,
          goTo: () => {

            this.props.changeLang({ lang: context.isRTL() ? 'en' : 'ar' })
          }
        },

      ]
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }
  componentDidAppear() {
    this.props.showHideFooterAction(true)
  }
  renderTopSection = () => {
    const { full_name = "", phone = "", avatar = "", success = false } = this.props.userData.data || {}
    const { logo = "", splash_logo = "", name = "" } = this.props.merchant || {}
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          paddingHorizontal: calWidth(20),
          paddingVertical: calWidth(10),
          borderRadius: calWidth(15),
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <View style={{ height: calWidth(60), width: calWidth(60), backgroundColor: '#fff' }}>
          <FastImage source={avatar != "" ? { uri: avatar } : { uri: splash_logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(30) }} resizeMode={avatar != "" ? 'cover' : 'contain'} />
        </View>
        <View style={{ flex: 1, marginLeft: calWidth(16), justifyContent: 'center' }}>
          <Text style={{ flexWrap: 'wrap', textAlign: 'left', fontSize: calWidth(16), fontWeight: '400', color: '#000000' }}>{full_name == "" ? name + " Guest" : full_name}</Text>
          <Text style={{ textAlign: 'left', fontSize: calWidth(16), fontWeight: '400', color: '#000000' }}>{phone}</Text>

        </View>
        {this.props.userData.success ? <TouchableOpacity
          onPress={() => push(this.props.componentId, screenIds.EDIT_PROFILE_SCREEN, { user: this.props.userData.data })}
        >
          <View style={{
            width: calWidth(36), height: calWidth(36), borderRadius: calWidth(18), backgroundColor: '#F2F2F2',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            <Image source={require('assets/icons/edit.png')} />
          </View>
        </TouchableOpacity> : null}
      </TouchableOpacity>
    )
  }

  renderButton = ({ icon, title, marginRight = 0, empty = false, goTo = null, style = {}, notifications = false }) => {
    if (empty)
      return (<View style={{
        flex: 1,
        padding: calWidth(16),
        borderRadius: calWidth(15),
        justifyContent: 'center',
        alignItems: 'center',
      }}></View>)
    return (
      <TouchableOpacity
        onPress={goTo}
        style={{
          flex: 1,
          padding: calWidth(16),
          borderRadius: calWidth(15),
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: marginRight
        }}>
        {/* <View style={{ width: calWidth(24), height: calWidth(24) }}> */}
        <Image source={icon} style={{ ...style, }} tintColor={style.tintColor} resizeMode="contain" />
        {/* </View> */}
        <Text style={{ textAlign: 'center', fontSize: calWidth(16), color: '#777777' }}>{title} {notifications ? this.props.notifications?.list?.filter(noti => noti.unread).length != 0 ? '(' + this.props.notifications?.list?.filter(noti => noti.unread).length + ")" : null : null}</Text>
      </TouchableOpacity>
    )
  }

  renderListItem = ({ item, index, }) => {
    if (item.hide) return null
    return (
      <TouchableOpacity onPress={item.goTo} style={{ paddingHorizontal: calWidth(10), borderRadius: calWidth(10), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: calWidth(48), marginTop: calWidth(10) }}>
        <View style={{ flexDirection: 'row', }}>

          {item.leftIcon ? <Image source={item.leftIcon} style={[{ marginRight: calWidth(10) }, context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}]} /> : null}
          <Text style={{ textAlign: 'left', fontSize: calWidth(16), fontWeight: '500', color: '#777777', }}>{item.title}</Text>
        </View>
        {item.icon ? <Image source={item.icon} style={context.isRTL() && item.id != 'WhatsApp' ? { transform: [{ rotate: "180deg" }] } : {}} /> : null}
      </TouchableOpacity>
    )
  }
  render() {

    return (
      <MainContainer componentId={this.props.componentId} cutHeader={true} hide={true} removeHeader={true}  >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: Colors.mainColor3, }}
          contentContainerStyle={{ paddingHorizontal: calWidth(24) }}
        >
          {/* {this.renderTrackOrders()} */}
          {this.renderTopSection()}
          <View style={{ flexDirection: 'row', flex: 1, marginTop: calWidth(10), }}>
            {this.renderButton({
              icon: require('assets/icons/notification.png'),
              title: translations.get('notifications').val(), marginRight: calWidth(10),
              style: { tintColor: Colors.mainColor1 },
              goTo: () => {
                push(this.props.componentId, screenIds.NOTOFICATION_SCREEN)
              },
              notifications: true
            })}
            {this.renderButton({
              icon: require('assets/icons/fav.png'), title: translations.get('fav').val(),
              style: { tintColor: Colors.mainColor1 },
              goTo: () => {
                push(this.props.componentId, screenIds.MY_FAV_SCREEN)
              }
            })}

          </View>
          <View style={{ flexDirection: 'row', flex: 1, marginTop: calWidth(10), }}>
            {this.renderButton({
              icon: require('assets/icons/location.png'), title: translations.get('my_addresses').val(), marginRight: calWidth(10),
              style: { tintColor: Colors.mainColor1 },
              goTo: () => {
                push(this.props.componentId, screenIds.MY_ADDRESSES_SCREEEN)
              }
            })}
            {/* {this.renderButton({ empty: true })} */}
            {config.loyality ? this.renderButton({
              icon: require('assets/images/barcode.png'), title: translations.get('loyalty').val(),
              style: { tintColor: Colors.mainColor1 },
              goTo: () => {
                showModal(screenIds.LOYALTY_COINS_SCREEN,
                  {}, {
                  modalPresentationStyle: 'popover',
                  modal: {
                    swipeToDismiss: true
                  }
                })
              }
            }) : this.renderButton({ empty: true })}
          </View>
          {<FlatList
            data={this.state.list}
            renderItem={this.renderListItem}
            scrollEnabled={false}
          />}
          {this.props.userData && this.props.userData.success ? this.renderListItem({
            item: {
              id: 'logout', title: translations.get('logout').val(), icon: null, leftIcon: require('assets/icons/logout.png'),
              goTo: () => {
                Alert.alert(translations.get('logout').val(),
                  translations.get('are_you_sure_logout').val(),
                  [
                    {
                      text: translations.get('yes_logout').val(),
                      onPress: () => {
                        logoutApp()
                      }
                    },
                    {
                      text: translations.get('cancel').val(),
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
                    },
                  ],
                  { cancelable: false }
                )
              }
            },
          }) : this.renderListItem({
            item: {
              id: 'login', title: translations.get('login').val(), icon: null, leftIcon: null,
              goTo: () => {
                showModal(screenIds.LOGIN_SCREEN, {
                  showHide: () => this.props.showHideFooterAction(true),
                  accountScreen: true
                }, {
                  modalPresentationStyle: 'popover',
                  modal: {
                    swipeToDismiss: true
                  },
                })
              }
            },
          })}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://bobapps.co')}
            style={{ justifyContent: 'center', alignItems: 'center', marginVertical: calWidth(16), marginBottom: calWidth(80) }}>
            <Image source={config.accountImage} />
          </TouchableOpacity>
        </ScrollView>
      </MainContainer>
    )
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }} >
        <TouchableOpacity
          onPress={() => {
            this.props.changeLang({ lang: 'en' })
          }}
          style={{ padding: 20 }}>
          <Text style={{ fontSize: 16 }}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.changeLang({ lang: 'ar' })
          }}
          style={{ padding: 20 }}>
          <Text style={{ fontSize: 16 }}>عربي</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            push(this.props.componentId, screenIds.MY_ADDRESSES_SCREEEN)
          }}
          style={{ padding: 20 }}>
          <Text style={{ fontSize: 16 }}>address</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

export default AccountScreen;
