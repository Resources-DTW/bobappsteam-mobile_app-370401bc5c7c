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
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, pop, push } from '../../navigation';
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
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { Api } from 'src/services';
import context from 'src/utils/context';


class MyAddressesScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      selectedAddress: props.selectedAdress ? props.selectedAdress : null
    }

  }
  componentDidMount() {
    this.props.getAdresses({ token: this.props.token })

  }


  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }
  deleteAddress = async (id) => {
    this.setState({
      loading: true
    })
    const response = await Api.deleteAdressesCall({ id: id, token: this.props.token })
    if (response && response.data && response.data.status) {
      this.setState({
        loading: false
      })
      // Toast.show({
      //   text: response.data.message,
      //   type: 'success',
      //   duration: 1000
      // })
    } else {
      this.setState({
        loading: false
      })
      alert(response.data.message)
    }

    this.props.getAdresses({ token: this.props.token })
  }
  renderCartCard = ({ item, index }) => {
    const { name = "", area = "", city = "", street = "" } = item || {}

    return (<TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.setState({
          selectedAddress: item._id
        })
        if (this.props.changeAddress) {
          this.props.changeAddress(item)
          pop(this.props.componentId)
        }
      }}
      style={{
        margin: calWidth(24),
        marginBottom: calWidth(0),
        padding: calWidth(16),
        paddingRight: calWidth(24),
        borderRadius: calWidth(8),
        backgroundColor: this.state.selectedAddress ? this.state.selectedAddress == item._id ? Colors.mainColor2 : '#fff' : index == 0 ? Colors.mainColor2 : '#fff',
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 16,
        shadowOffset: {
          height: 6,
          width: 0
        },
        elevation: 2,
      }} >
      <View style={{ position: 'absolute', top: calWidth(12), right: calWidth(12) }}>
        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => {
            Alert.alert(translations.get('edit_or_remove').val(), '',
              [
                {
                  text: translations.get('edit').val(),
                  onPress: () => {
                    push(this.props.componentId, screenIds.ADD_ADDRESS_SCREEN, { edit: true, item })
                  }
                },
                { text: translations.get('delete').val(), onPress: () => this.deleteAddress(item._id) },
                {
                  text: translations.get('cancel').val(),
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },

              ],
              { cancelable: false }
            )
          }}>

          <Image source={require('assets/icons/dots.png')} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: calWidth(10) }}>

        <View style={{
          width: calWidth(175), backgroundColor: Colors.mainColor1, padding: calWidth(10),
          borderRadius: calWidth(8)
        }}>
          <PoppinsRegular style={{ fontSize: calWidth(11), color: '#fff', marginBottom: calWidth(8) }}>{translations.get('address_name_1').val()}</PoppinsRegular>
          <PoppinsSemiBold style={{ fontSize: calWidth(13), color: '#fff', }}>{name}</PoppinsSemiBold>
        </View>

        <View
          style={{
            flex: 1, backgroundColor: Colors.mainColor1, padding: calWidth(10),
            borderRadius: calWidth(8),
            marginLeft: calWidth(10),
          }}>
          <PoppinsRegular style={{ fontSize: calWidth(11), color: '#fff', marginBottom: calWidth(8) }}>{translations.get('area').val()}</PoppinsRegular>
          <PoppinsSemiBold style={{ fontSize: calWidth(13), color: '#fff', }}>{area}</PoppinsSemiBold>

        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        <View style={{
          width: calWidth(175), backgroundColor: Colors.mainColor1, padding: calWidth(10),
          borderRadius: calWidth(8)
        }}>
          <PoppinsRegular style={{ fontSize: calWidth(11), color: '#fff', marginBottom: calWidth(8) }}>{translations.get('street_address').val()}</PoppinsRegular>
          <PoppinsSemiBold style={{ fontSize: calWidth(13), color: '#fff', }}>{street}</PoppinsSemiBold>

        </View>

        <View style={{
          flex: 1, backgroundColor: Colors.mainColor1, padding: calWidth(10),
          borderRadius: calWidth(8),
          marginLeft: calWidth(10),
        }}>
          <PoppinsRegular style={{ fontSize: calWidth(11), color: '#fff', marginBottom: calWidth(8) }}>{translations.get('city').val()}</PoppinsRegular>
          <PoppinsSemiBold style={{ fontSize: calWidth(13), color: '#fff', }}>{city}</PoppinsSemiBold>

        </View>
      </View>
    </TouchableOpacity>)
  }
  render() {

    const { images = [], name = "", price = "", quantity = "", items = [], cart_total = 0 } = this.state.cart || {}
    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
        <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('my_addresses').val()}</PoppinsSemiBold>
        </View>
        <FlatList
          // style={{ flex: 1, }}
          contentContainerStyle={{}}
          data={this.props.addresses.list}
          renderItem={this.renderCartCard}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id}
          ListHeaderComponent={() => {
            return (
              <View style={{ padding: calWidth(24), paddingBottom: calWidth(0) }}>
                <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16) }}>{translations.get('my_addresses').val()}</PoppinsSemiBold>
              </View>
            )
          }}
          ListFooterComponent={() => {
            if (this.props.addresses.pending)
              return (
                <ActivityIndicator />
              )
            if (this.props.addresses.list == 0)
              return (
                <>
                  <TouchableOpacity
                    onPress={() => push(this.props.componentId, screenIds.ADD_ADDRESS_SCREEN, {
                      checkoutPageId: this.props.checkoutPageId,
                      changeAddress: (item) => {
                        if (this.props.changeAddress)
                          this.props.changeAddress(item)
                        // pop(this.props.componentId)
                      }
                    })}
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: calWidth(10),
                      marginHorizontal: calWidth(24),
                      paddingHorizontal: calWidth(14),
                      marginVertical: calWidth(16)
                    }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: calWidth(16) }}>
                      <Image source={require('assets/icons/no_address.png')} style={{ marginBottom: calWidth(8) }} />
                      <PoppinsRegular style={{ textAlign: 'center', fontSize: calWidth(16), color: '#919191', marginBottom: calWidth(8) }}>{translations.get('no_address').val()}</PoppinsRegular>
                      <PoppinsRegular style={{ textAlign: 'center', fontSize: calWidth(16), color: '#919191' }}>{translations.get('add_new_address').val()}</PoppinsRegular>
                    </View>
                  </TouchableOpacity>
                  <View style={{ height: calWidth(80) }} />
                </>
              )
            else
              return (
                <>
                  <TouchableOpacity
                    onPress={() => push(this.props.componentId, screenIds.ADD_ADDRESS_SCREEN, {
                      checkoutPageId: this.props.checkoutPageId,
                      changeAddress: (item) => {
                        if (this.props.changeAddress)
                          this.props.changeAddress(item)
                        // pop(this.props.componentId)
                      }
                    })}
                    style={{
                      backgroundColor: Colors.mainColor1, borderRadius: calWidth(10),
                      marginHorizontal: calWidth(24),
                      paddingHorizontal: calWidth(14),
                      marginVertical: calWidth(16)
                    }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: calWidth(16) }}>
                      <PoppinsRegular style={{ textAlign: 'center', fontSize: calWidth(16), color: '#fff' }}>{translations.get('add_new_address').val()}</PoppinsRegular>
                    </View>
                  </TouchableOpacity>
                  <View style={{ height: calWidth(80) }} />
                </>
              )
          }
          }
        />

      </View >

    );
  }
}

export default MyAddressesScreen;
