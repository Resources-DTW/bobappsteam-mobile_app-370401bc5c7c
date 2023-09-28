import React from 'react';
import { Alert, FlatList, Linking, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';
import { push, screenIds, showModal } from 'src/navigation';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import { changeLangAction } from 'src/store/actions/merchantsActions';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';

const Sections = (props) => {
  const notifications = useSelector(state => state.user.get('notifications'))
  const dispatch = useDispatch()
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const userLogin = useSelector(state => state.user.get('userLogin'))

  const list = [
    {
      icon: require('assets/icons/noti.png'),
      title: translations.get('notifications').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        if (userLogin)
          push(props.componentId, screenIds.NOTOFICATION_SCREEN)
        else
          showModal(screenIds.LOGIN_SCREEN, {
            showHide: () => dispatch(showHideFooterAction(true)),
            accountScreen: true
          }, {
            modalPresentationStyle: 'popover',
            modal: {
              swipeToDismiss: true
            },
          })
      },
      notifications: true
    },
    {
      icon: require('assets/icons/favorite.png'),
      title: translations.get('fav').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        if (userLogin)
          push(props.componentId, screenIds.MY_FAV_SCREEN)
        else
          showModal(screenIds.LOGIN_SCREEN, {
            showHide: () => dispatch(showHideFooterAction(true)),
            accountScreen: true
          }, {
            modalPresentationStyle: 'popover',
            modal: {
              swipeToDismiss: true
            },
          })
      },
    },
    {
      icon: require('assets/icons/locations.png'),
      title: translations.get('my_addresses').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        if (userLogin)
          push(props.componentId, screenIds.MY_ADDRESSES_SCREEEN)
        else
          showModal(screenIds.LOGIN_SCREEN, {
            showHide: () => dispatch(showHideFooterAction(true)),
            accountScreen: true
          }, {
            modalPresentationStyle: 'popover',
            modal: {
              swipeToDismiss: true
            },
          })
      },
    },
    {
      icon: require('assets/icons/about_us.png'),
      title: translations.get('about_us').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        push(props.componentId, screenIds.ABOUT_US_SCREEN)
      },
    },
    {
      icon: require('assets/icons/language.png'),
      title: translations.get('language').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        dispatch(changeLangAction({ lang: context.isRTL() ? 'en' : 'ar' }))
      },
      lang: true
    },
    {
      icon: require('assets/icons/facebook_1.png'),
      title: translations.get('facebook_1').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        const { facebook = "" } = merchant;
        Linking.canOpenURL(facebook)
          .then(supported => {
            if (!supported) {
              Alert.alert(
                'Please install facebook app!'
              );
            } else {
              return Linking.openURL(facebook).catch(e => console.warn(e));
            }
          })
      },
      isHide: () => {
        const { facebook = "" } = merchant;
        return (facebook || "") == ""
      }
    },
    {
      icon: require('assets/icons/insta.png'),
      title: translations.get('insta').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        const { instagram = "" } = merchant;
        Linking.canOpenURL(instagram)
          .then(supported => {
            if (!supported) {
              Alert.alert(
                'Please install instagram app!'
              );
            } else {
              return Linking.openURL(instagram).catch(e => console.warn(e));
            }
          })
      },
      isHide: () => {
        const { instagram = "" } = merchant;
        return (instagram || "") == ""
      }
    },
    {
      icon: require('assets/icons/whatsapp.png'),
      title: translations.get('whatsapp').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        const { whatsapp = "" } = merchant || {}

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
      },
      isHide: () => {
        const { whatsapp = "" } = merchant;
        return (whatsapp || "") == ""
      }
    },
    {
      icon: require('assets/icons/youtube.png'),
      title: translations.get('youtube').val(),
      style: { tintColor: Colors.mainColor1 },
      goTo: () => {
        const { youtube = "" } = merchant;
        Linking.canOpenURL(youtube)
          .then(supported => {
            if (!supported) {
              Alert.alert(
                'Please install youtube app!'
              );
            } else {
              return Linking.openURL(youtube).catch(e => console.warn(e));
            }
          })
      },
      isHide: () => {
        const { youtube = "" } = merchant;
        return (youtube || "") == ""
      }
    },
  ]

  const renderItem = ({ item, index }) => {
    return (<TouchableOpacity
      activeOpacity={1}
      onPress={item.goTo}
      style={{
        borderRadius: calWidth(12), backgroundColor: '#fff', padding: calWidth(8), marginVertical: calWidth(4), marginHorizontal: calWidth(4),
        shadowColor: "#999999",
        shadowOpacity: 0.16,
        shadowRadius: 3,
        shadowOffset: {
          height: 3,
          width: 0
        },
        elevation: 2,
      }}
    >
      <View style={{ width: calWidth(28), height: calWidth(28), marginBottom: calWidth(4) }}>
        <FastImage source={item.icon} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </View>
      <PoppinsMediam style={{ fontSize: calWidth(14), color: '#0F0F0F', }}>{item.title}</PoppinsMediam>
      {item.notifications && notifications?.list?.filter(noti => noti.unread).length != 0 ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: calWidth(10), height: calWidth(10), borderRadius: calWidth(5), backgroundColor: '#FF3B3B', marginRight: 4 }}></View>
        <PoppinsRegular style={{ fontSize: calWidth(10), color: '#0F0F0F' }} >{item.notifications ? notifications?.list?.filter(noti => noti.unread).length != 0 ? notifications?.list?.filter(noti => noti.unread).length : null : null} {translations.get('new').val()}</PoppinsRegular>
      </View> : null}
      {item.lang ? <PoppinsRegular style={{ fontSize: calWidth(10), color: '#0F0F0F' }} >{context.getCurrentLanguage() == 'ar' ? 'عربي' : 'English'}</PoppinsRegular>
        : null}
    </TouchableOpacity>)
  }
  const list1 = [];
  const list2 = [];

  list.map((l, i) => {
    if (l.isHide && l.isHide()) {

    } else {
      if (i % 2 == 0)
        list1.push(renderItem({ item: l, index: i }))
      if (i % 2 == 1)
        list2.push(renderItem({ item: l, index: i }))
    }
  })
  return (<View style={{ flexDirection: 'row', paddingTop: calWidth(4) }}>
    <View style={{ flex: 1 }}>
      {list1}
    </View>
    <View style={{ flex: 1 }}>
      {list2}
    </View>
  </View>)

}

export default Sections;