import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';
import { useSelector } from 'react-redux';
import config from 'src/config';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import translations from 'src/localization/Translations';
import { push, screenIds } from 'src/navigation';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';



const BottomSections = (props) => {
  const merchant = useSelector(state => state.merchants.get('merchant'))

  const list = [
    {
      id: 'RateOurApp', title: translations.get('rate').val(),
      icon: require('assets/icons/rightArrow.png'),
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
          }
        })
      }
    },
    {
      id: 'Terms',
      hide: merchant?.parsingFeature['Hide_privacypolicy_terms&condtions'],
      title: translations.get('terms').val(),
      icon: require('assets/icons/rightArrow.png'), goTo: () => {
        push(props.componentId, screenIds.WIDGET_SCREEN, {
          title: translations.get('terms').val(),
          uri: `https://${merchant.subdomain}/${context.getCurrentLanguage()}/terms-and-conditions`
        })
      }
    },
    {
      id: 'PrivacyPolicy',
      hide: merchant?.parsingFeature['Hide_privacypolicy_terms&condtions'],
      title: translations.get('privacy').val(),
      icon: require('assets/icons/rightArrow.png'),
      goTo: () => {

        push(props.componentId, screenIds.WIDGET_SCREEN, {
          title: translations.get('privacy').val(),
          uri: `https://${merchant.subdomain}/${context.getCurrentLanguage()}/privacy-policy`
        })
      }
    },
  ];

  const renderItem = (item, index) => {
    if (item.hide) return null;
    return (<TouchableOpacity
      onPress={item.goTo}
      key={index}
      style={{
        backgroundColor: '#fff',
        shadowColor: "#999999",
        shadowOpacity: 0.16,
        shadowRadius: 6,
        shadowOffset: {
          height: 6,
          width: 0
        },
        elevation: 2,
        borderRadius: calWidth(12),
        padding: calWidth(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: calWidth(4)
      }}
    >
      <PoppinsMediam style={{ fontSize: calWidth(14), color: '#0F0F0F', }}>{item.title}</PoppinsMediam>
      {<Image source={item.icon} style={context.isRTL() && item.id != 'WhatsApp' ? { transform: [{ rotate: "180deg" }] } : {}} />}

    </TouchableOpacity>)
  }
  return (<View style={{ marginTop: calWidth(16) }}>

    {list.map((item, index) => renderItem(item, index))}
  </View>)
}

export default BottomSections;