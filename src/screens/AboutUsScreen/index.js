import React, { useEffect, useState } from 'react';
import { Linking, Platform, TouchableOpacity, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import translations from 'src/localization/Translations';
import { Api } from 'src/services';
import { calWidth } from 'src/utils/helpers';
import HTML from "react-native-render-html";
import context from 'src/utils/context';
import { pop } from 'src/navigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const AboutUsScreen = (props) => {
  const [tab, setTab] = useState('about')
  const token = useSelector(state => state.merchants.get('token'))
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { image = "", logo = "", about_ar = "", about = "", branches = [] } = merchant;

  const renderAbout = () => {
    return (<HTML containerStyle={{ padding: calWidth(20) }} source={{ html: "<div>" + (context.isRTL() ? about_ar : about) + "</div>" }} tagsStyles={true ? { div: { textAlign: 'left', } } : {}} />
    )
  }

  const renderBranchs = () => {

    return (branches.map(branch => {
      const { name = "", name_ar = "", location = "", location_ar = "", lat = "", lng = "" } = branch;
      return (<TouchableOpacity
        key={location}
        onPress={() => {
          Linking.openURL(`${Platform.OS === 'ios' ? 'maps' : 'geo'}:0,0?q=${lat},${lng}`)
        }}
        style={{ flexDirection: 'row', paddingHorizontal: calWidth(20), paddingVertical: calWidth(6) }}
      >
        <View style={{ width: calWidth(56), height: calWidth(56) }}>
          <FastImage source={require('assets/icons/mapss.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
        </View>
        <View style={{ padding: calWidth(8) }}>
          <PoppinsMediam style={{ fontSize: calWidth(16), color: '#000000' }}>{context.isRTL() ? name_ar != "" ? name_ar : name : name}</PoppinsMediam>
          <PoppinsRegular style={{ fontSize: calWidth(12), color: '#A8A8A8' }}>{context.isRTL() ? location_ar != "" ? location_ar : location : location}</PoppinsRegular>

        </View>
      </TouchableOpacity>)
    }))
  }

  return (<View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>

    <View style={{ height: calWidth(160), width: '100%', }}>
      <FastImage source={{ uri: image }}
        style={{ width: '100%', height: '100%', }}
      >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: calWidth(20), paddingTop: calWidth(40), paddingBottom: calWidth(10) }}>

          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              pop(props.componentId)
              // showModal(screenIds.CART_SCREEN)
            }}
            style={{ width: calWidth(60), alignItems: 'flex-start', }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
        </View>
      </FastImage>
    </View>

    <View style={{}}>
      <View
        style={{
          width: calWidth(66),
          height: calWidth(66),
          borderRadius: calWidth(9),
          backgroundColor: '#fff',
          shadowColor: "#80828B",
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: {
            height: 2,
            width: 0
          },
          elevation: 2,
          position: 'absolute',
          top: -calWidth(33),
          left: calWidth(20)
        }}>
        <FastImage source={{ uri: logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(33) }} />
      </View>
      <View style={{ flexDirection: 'row', marginTop: calWidth(33), paddingHorizontal: calWidth(20), borderBottomColor: '#E2E8ED', borderBottomWidth: 1 }}>
        <TouchableOpacity
          onPress={() => {
            setTab('about')
          }}
          style={{ flex: 1, padding: calWidth(12), paddingVertical: calWidth(6), justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'about' ? '#F9BD58' : '#F9F9F9' }}>
          <PoppinsRegular style={{ color: '#2B2B2B', fontSize: calWidth(16) }}>{translations.get('about_us').val()}</PoppinsRegular>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={branches.length == 0}
          onPress={() => {
            setTab('branchs')
          }}
          style={{ flex: 1, padding: calWidth(12), justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: tab == 'branchs' ? '#F9BD58' : '#F9F9F9' }}>
          {branches.length ? <>
            <PoppinsRegular style={{ color: '#2B2B2B', fontSize: calWidth(16) }}>{translations.get('branches').val()}</PoppinsRegular>
          </>
            : null}
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, padding: calWidth(12), justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: '#F9F9F9' }}></TouchableOpacity>

      </View>


    </View>
    <ScrollView
      showsVerticalScrollIndicator={false}
    >

      {tab == 'about' ? renderAbout() : tab == 'branchs' ? renderBranchs() : null}
    </ScrollView>
  </View>)
}

export default AboutUsScreen;