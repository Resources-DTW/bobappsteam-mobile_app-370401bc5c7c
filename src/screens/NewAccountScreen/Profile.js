import { Text } from 'native-base';
import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsMediam } from 'src/fonts/PoppinsMediam';
import translations from 'src/localization/Translations';
import { push, screenIds, showModal } from 'src/navigation';
import { showHideFooterAction } from 'src/store/actions/menuActions';
import { calWidth } from 'src/utils/helpers';

const Profile = (props) => {
  const user = useSelector(state => state.user.get('userData'))
  const merchant = useSelector(state => state.merchants.get('merchant'));
  const dispatch = useDispatch();
  const { componentId } = props;
  const { avatar = '', full_name = '', phone = '' } = user?.data || {};
  const { splash_logo = '', name = '' } = merchant || {};
  const _onPress = useCallback(() => {
    if (user?.success)
      push(componentId, screenIds.EDIT_PROFILE_SCREEN, { user: user.data })
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
  }, [user, componentId]);

  return (<View style={{ padding: calWidth(6), flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'rgba(130,130,130,0.3)', borderBottomWidth: 0.4 }}>
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ width: calWidth(60), height: calWidth(60), borderRadius: calWidth(30), backgroundColor: '#E6E6E6' }}>
        <FastImage source={avatar != "" ? { uri: avatar } : { uri: splash_logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(30) }} />
      </View>
      <View style={{ padding: calWidth(6), flex: 1 }}>
        <PoppinsMediam numberOfLines={1} style={{ fontSize: calWidth(16), color: '#0F0F0F' }}>{full_name == "" ? name + " Guest" : full_name}</PoppinsMediam>
        <PoppinsRegular style={{ fontSize: calWidth(14), color: '#0F0F0F' }}>{phone}</PoppinsRegular>
      </View>
    </View>
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>

      <TouchableOpacity
        activeOpacity={1}
        onPress={_onPress}
        style={{ borderRadius: calWidth(24), borderColor: 'rgba(130,130,130,0.3)', borderWidth: 1, paddingHorizontal: calWidth(10), paddingVertical: calWidth(6) }}>
        <PoppinsMediam style={{ fontSize: calWidth(10), color: '#141414' }}>{user?.success ? translations.get('edit_profile').val() : translations.get('login').val()}</PoppinsMediam>
      </TouchableOpacity>
    </View>
  </View>)
};

export default Profile;