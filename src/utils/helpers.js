import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Toast from 'react-native-root-toast';
import { STATUSBAR_HEIGHT } from 'src/constants';
import translations from 'src/localization/Translations';
import { screenIds, showModal } from 'src/navigation';

const { width, height } = Dimensions.get('window');
export const calWidth = (IPhonePixel) => {
  return width < height ? (width * IPhonePixel / 375) : (height * IPhonePixel / 375)
}

export const calHeight = (IPhonePixel) => {
  return width < height ? (width * IPhonePixel / 375) : (height * IPhonePixel / 375)
}

export const calRealHeight = (IPhonePixel) => {
  return height * IPhonePixel / 375
}

var statusBarHeightLocal = 0
const getConstants = async () => {
  const {
    statusBarHeight,
    TopBarHeight,
    BottomTabsHeight
  } = await Navigation.constants();
  statusBarHeightLocal = statusBarHeight;
}

getConstants();

export const showToastError = (msg = "") => {
  let message = msg.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
  Toast.show(message, {
    duration: 2000,
    position: statusBarHeightLocal,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: {
      height: calWidth(50), justifyContent: 'center', width: '100%', backgroundColor: '#e74c3c',
      // opacity: 1,
    },
    textColor: '#FFFFFF',
    textStyle: {
      fontSize: calWidth(12)
    },
  });
}

export const showToastItemSuccess = (msg = "", viewCart = false, bottom = false, btnText = '') => {
  Toast.show(msg, {
    duration: 2000,
    position: bottom ? -120 : statusBarHeightLocal,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: {
      width: '100%',
      height: calWidth(50), backgroundColor: '#07bc0c',
      // opacity: 1,
      justifyContent: viewCart ? 'space-between' : 'flex-start', alignItems: 'center', flexDirection: 'row',
      paddingHorizontal: calWidth(16)
    },
    textColor: '#FFFFFF',
    textStyle: {
      fontSize: calWidth(15)
    },
    goTo: () => {
      if (btnText != "" && Platform.OS == 'ios') {
        return (<TouchableOpacity
          onPress={() => showModal(screenIds.CART_SCREEN, {

          }, {
            modalPresentationStyle: 'popover',
            modal: {
              swipeToDismiss: true
            },
          })}>
          <Text style={{ fontSize: calWidth(15), color: '#fff', textDecorationLine: 'underline', textDecorationColor: '#fff' }}>{btnText != "" ? btnText : translations.get('view_cart').val()}</Text>
        </TouchableOpacity>)
      } else null
    }
    // img: require('assets/icons/warning.png')
  });
}
