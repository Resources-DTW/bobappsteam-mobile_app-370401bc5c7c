import React from 'react';
import { View, Dimensions, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import Colors from '../theme';
import { calWidth } from 'src/utils/helpers';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';
import { dismissAllModals, popToRoot, screenIds } from 'src/navigation';
const { width, height, scale } = Dimensions.get("window");

export const OverLay = (props) => {
  return (
    <View style={[{
      height: height, width: width, position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0, backgroundColor: 'rgba(0,0,0,0.2)',
      zIndex: 999,
      justifyContent: 'center',

    }, props.showSuccess ? {} : { alignItems: 'center' }]}>
      {props.showSuccess ?
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
            <View style={{ position: 'absolute', top: -30, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ width: calWidth(60), height: calWidth(60), borderRadius: calWidth(30), backgroundColor: Colors.mainColor1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('assets/icons/check.png')} />
              </View>
            </View>
            <PoppinsRegular style={{ fontSize: calWidth(16), color: '#000', textAlign: 'center', marginBottom: calWidth(20) }}>{translations.get('order_success').val()}</PoppinsRegular>
            <TouchableOpacity onPress={() => {
              dismissAllModals();
              if (props.indexings?.indxe ? props.indexings?.indxe == 0 : props.indexings?.get?.('index') == 0) {
                popToRoot(screenIds.HOME_SCREEN);
              } else if (props.indexings?.indxe ? props.indexings?.indxe == 1 : props.indexings?.get?.('index') == 1) {
                popToRoot(screenIds.OFFERS_SCREEN);
              } else if (props.indexings?.indxe ? props.indexings?.indxe == 2 : props.indexings?.get?.('index') == 2) {
                popToRoot(screenIds.MENU_SCREEN);
              }
            }} style={{ backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), height: calWidth(48), justifyContent: 'center', alignItems: 'center' }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('Continue').val()}</PoppinsRegular>
            </TouchableOpacity>
          </View>
        </View>
        : <ActivityIndicator size='large' color={Colors.mainColor2} />}
    </View>
  )
}