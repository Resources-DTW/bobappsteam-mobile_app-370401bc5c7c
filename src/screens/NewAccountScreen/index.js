import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Linking, Image, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import config from 'src/config';
import { calWidth } from 'src/utils/helpers';
import BottomSections from './BottomSections';
import Profile from './Profile';
import Sections from './Sections';
import { useNavigationComponentDidAppear } from 'react-native-navigation-hooks'
import { useDispatch, useSelector } from 'react-redux';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import translations from 'src/localization/Translations';
import { logoutApp } from 'src/navigation/setRoot';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';

const NewAccountScreen = (props) => {
  const dispatch = useDispatch();
  // Listen events only for this screen if screen was wrapped with NavigationProvider
  useNavigationComponentDidAppear((e) => {
    dispatch(showHideFooterAction(true))
  })
  const userLogin = useSelector(state => state.user.get('userLogin'))

  return (<View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
    <SafeAreaView></SafeAreaView>
    <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: calWidth(16) }}
    >
      <Profile
        componentId={props.componentId}
      />
      <Sections
        componentId={props.componentId}
      />
      <BottomSections
        componentId={props.componentId}
      />
      {userLogin ? <TouchableOpacity
        style={{ padding: calWidth(16), justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
        onPress={() => {
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
        }}
      >
        <PoppinsMediam style={{ fontSize: calWidth(18), color: '#0F0F0F', }}>{translations.get('logout').val()}</PoppinsMediam>

      </TouchableOpacity> : null}
      <TouchableOpacity
        onPress={() => Linking.openURL('https://bobapps.co')}
        style={{ justifyContent: 'center', alignItems: 'center', marginVertical: calWidth(16), marginBottom: calWidth(80) }}>
        <Image source={config.accountImage} />
      </TouchableOpacity>
    </ScrollView>
  </View>)
}

export default NewAccountScreen;