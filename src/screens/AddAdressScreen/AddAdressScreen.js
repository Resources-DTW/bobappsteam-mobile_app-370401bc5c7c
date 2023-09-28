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
  ScrollView,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, pop, push, popTo } from '../../navigation';
import { Header, Container, Root } from 'native-base';
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
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import { Api } from 'src/services';
import { OverLay } from 'src/components/OverLay';
import context from 'src/utils/context';

class AddAdressScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cart: {},
      address_name: '',
      street_address: '',
      apartment_number: '',
      city: '',
      city_state: '',
      latitude: '',
      longitude: '',
      area: '',
      enabled: false
    }
    this.mapNormal = React.createRef();

  }
  componentDidUpdate(prevProps) {
    if (!this.props.edit && this.props.saveAddressSelector.success != prevProps.saveAddressSelector.success && this.props.saveAddressSelector.success) {
      this.setState({
        address_name: '',
        street_address: '',
        apartment_number: '',
        city: '',
        city_state: '',
        area: '',
      })
      if (this.props.changeAddress) {
        this.props.changeAddress(this.props.saveAddressSelector.data)
        if (this.props.checkoutPageId)
          popTo(this.props.checkoutPageId)
        else
          pop(this.props.componentId)
      } else {
        pop(this.props.componentId)
      }
      // alert(translations.get('added_address_successfuly').val())
    }
  }

  componentDidMount() {
    if (this.props.edit) {
      this.setState({
        enabled: true,
        latitude: this.props.item.lat,
        longitude: this.props.item.long,
        street_address: this.props.item.street || "",
        area: this.props.item.area || "",
        city: this.props.item.city || "",
        address_name: this.props.item.name || "",
        city_state: this.props.item.state || "",
        apartment_number: this.props.item.building || ""
      })

    } else
      this.requestFineLocation()
  }
  async requestFineLocation() {
    let self = this;
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          self.locationWatchId2 = Geolocation.getCurrentPosition(
            (position) => {
              if (position.coords && !this.props.mapLocation) {
                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  enabled: true
                }, () => {
                  this.getLocationName(`${position.coords.latitude},${position.coords.longitude}`)

                })

              }
            },
            (error) => console.warn(error)
          );
        } else {
        }
      } else {
        self.locationWatchId2 = Geolocation.getCurrentPosition(
          (position) => {
            if (position.coords && !this.props.mapLocation) {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                enabled: true
              }, () => {
                this.getLocationName(`${position.coords.latitude},${position.coords.longitude}`)
              })
            }
          },
          (error) => {
          }
        );
      }
    } catch (err) {
    }
  }

  getLocationName = async (latlng) => {
    const response = await Api.getLocationNameCall({
      latlng: latlng
    })
    let add = {}
    if (response && response.data && response.data.results) {
      for (let i = 0; i < response.data.results.length; i++) {
        let found = false
        response.data.results[i].address_components.map(address => {
          if (address.types.includes('route')) {
            add = { ...add, street_address: address.long_name }
          } else if (address.types.includes('neighborhood')) {
            add = { ...add, area: address.long_name }
          } else if (address.types.includes('locality')) {
            add = { ...add, city: address.long_name }
          }
        })
        if (found) break;
      }
      // response.data.results[0].address_components.map(address => {
      //   if (address.types.includes('route')) {
      //     add = { ...add, street_address: address.long_name }
      //   } else if (address.types.includes('sublocality')) {
      //     add = { ...add, area: address.long_name }
      //   } else if (address.types.includes('locality')) {
      //     add = { ...add, city: address.long_name }
      //   }
      // })
      this.setState({
        ...add
      })
    }
    // if (response && response.data && response.data.results && response.data.results.length) {
    //   let ffff = response.data.results[0].formatted_address.split("، ")
    //   this.setState({
    //     locationName: ffff.reverse().join("، ")
    //   })
    // }
  }

  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }

  moveToPoint = async ({ latitude, longitude }) => {

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    };
    this.mapNormal.current.animateToRegion(region, 500);
  };


  renderCartCard = () => {
    return (<TouchableOpacity
      style={{
        margin: calWidth(24),
        marginBottom: calWidth(0),
        padding: calWidth(16),
        borderRadius: calWidth(8),
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 16,
        shadowOffset: {
          height: 6,
          width: 0
        },
        elevation: 2,
      }} >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: calWidth(10) }}>

        <View style={{
          width: calWidth(175), backgroundColor: '#777777', padding: calWidth(10),
          borderRadius: calWidth(8)
        }}>

        </View>

        <View style={{
          flex: 1, backgroundColor: '#777777', padding: calWidth(10),
          borderRadius: calWidth(8),
          marginLeft: calWidth(10),
        }}>

        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        <View style={{
          width: calWidth(175), backgroundColor: '#777777', padding: calWidth(10),
          borderRadius: calWidth(8)
        }}>

        </View>

        <View style={{
          flex: 1, backgroundColor: '#777777', padding: calWidth(10),
          borderRadius: calWidth(8),
          marginLeft: calWidth(10),
        }}>

        </View>
      </View>
    </TouchableOpacity>)
  }
  render() {
    const { images = [], name = "", price = "", quantity = "", items = [], cart_total = 0 } = this.state.cart || {}
    return (
      <Root>


        <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
          <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
            <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
            </TouchableOpacity>
            <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{this.props.edit ? translations.get('edit_addresses').val() : translations.get('ad_addresses').val()}</PoppinsSemiBold>
          </View>
          <ScrollView>
            <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
              <View style={{ padding: calWidth(10) }}>

                <Image source={require('assets/icons/pin_map.png')} style={{}} />
              </View>
              <TextInput
                style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                placeholder={translations.get('address_name').val()}
                key={translations.get('address_name').val()}
                value={this.state.address_name}
                onChangeText={(text) => {
                  this.setState({
                    address_name: text
                  })
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
              <View style={{ padding: calWidth(10) }}>

                <Image source={require('assets/icons/pin_map.png')} style={{}} />
              </View>
              <TextInput
                style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                placeholder={translations.get('street_address').val()}
                key={translations.get('street_address').val()}
                value={this.state.street_address}
                onChangeText={(text) => {
                  this.setState({
                    street_address: text
                  })
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginLeft: calWidth(24), marginVertical: calWidth(12) }}>
                <View style={{ padding: calWidth(10) }}>

                  <Image source={require('assets/icons/pin_map.png')} style={{}} />
                </View>
                <TextInput
                  style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                  placeholder={translations.get('city').val()}
                  key={translations.get('city').val()}
                  value={this.state.city}
                  onChangeText={(text) => {
                    this.setState({
                      city: text
                    })
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
                <View style={{ padding: calWidth(10) }}>

                  <Image source={require('assets/icons/pin_map.png')} style={{}} />
                </View>
                <TextInput
                  style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                  placeholder={translations.get('area').val()}
                  key={translations.get('area').val()}
                  value={this.state.area}
                  onChangeText={(text) => {
                    this.setState({
                      area: text
                    })
                  }}
                />
              </View>



            </View>

            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginLeft: calWidth(24), marginVertical: calWidth(12) }}>
                <View style={{ height: calWidth(48) }}>

                  {/* <Image source={require('assets/icons/pin_map.png')} style={{}} /> */}
                </View>
                <TextInput
                  style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                  placeholder={translations.get('Building').val()}
                  key={translations.get('Building').val()}
                  value={this.state.apartment_number}
                  onChangeText={(text) => {
                    this.setState({
                      apartment_number: text
                    })
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
                <View style={{ height: calWidth(48) }}>

                  {/* <Image source={require('assets/icons/pin_map.png')} style={{}} /> */}
                </View>
                <TextInput
                  style={{ flex: 1, textAlign: false ? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
                  placeholder={translations.get('floor').val()}
                  key={translations.get('floor').val()}
                  value={this.state.floor}
                  onChangeText={(text) => {
                    this.setState({
                      floor: text
                    })
                  }}
                />
              </View>



            </View>


            {/* <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
            <View style={{ padding: calWidth(10) }}>

              <Image source={require('assets/icons/pin_map.png')} style={{}} />
            </View>
            <TextInput
              style={{ flex: 1, textAlign: false? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
              placeholder={translations.get('apartment_number').val()}
              value={this.state.apartment_number}
              onChangeText={(text) => {
                this.setState({
                  apartment_number: text
                })
              }}
            />
          </View> */}
            {/* <View style={{ flexDirection: 'row', backgroundColor: '#E6E6E6', borderRadius: calWidth(10), flex: 1, marginHorizontal: calWidth(24), marginVertical: calWidth(12) }}>
            <View style={{ padding: calWidth(10) }}>

              <Image source={require('assets/icons/pin_map.png')} style={{}} />
            </View>
            <TextInput
              style={{ flex: 1, textAlign: false? 'right' : 'left', padding: calWidth(10), fontSize: calWidth(14), color: '#000' }}
              placeholder={translations.get('area').val()}
              value={this.state.area}
              onChangeText={(text) => {
                this.setState({
                  area: text
                })
              }}
            />
          </View> */}

            {this.state.enabled ? <TouchableOpacity
              onPress={() => {
                push(this.props.componentId, screenIds.SELECT_LOCATION_ON_MAP, {
                  latitude: this.state.latitude != "" ? this.state.latitude : 31.9911,
                  longitude: this.state.longitude != "" ? this.state.longitude : 35.8683,
                  onChange: ({ latitude, longitude }) => {
                    this.setState({
                      latitude,
                      longitude
                    }, () => {
                      this.moveToPoint({
                        latitude,
                        longitude
                      })
                      this.getLocationName(`${latitude},${longitude}`)

                    })
                  }
                })
              }}
              style={{ padding: calWidth(24), paddingTop: calWidth(32) }}>
              <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000', textAlign: 'center' }}>{translations.get('select_on_map').val()}</PoppinsSemiBold>
              <View style={{ flex: 1, height: calWidth(300), borderRadius: calWidth(10) }}>
                {this.state.latitude != "" ? <MapView
                  ref={this.mapNormal}
                  style={{ flex: 1, }}
                  initialRegion={{
                    latitude: parseFloat(this.state.latitude != "" ? this.state.latitude : 31.9911),
                    longitude: parseFloat(this.state.longitude != "" ? this.state.longitude : 35.8683),
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                  }}
                  rotateEnabled={false}
                  // provider={'google'}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  scrollEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(this.state.latitude || 0),
                      longitude: parseFloat(this.state.longitude || 0)
                    }}
                    image={require('assets/icons/selcet_map_pin.png')}
                    centerOffset={{ x: -16, y: -20 }}
                  />
                </MapView> : null}
              </View>
            </TouchableOpacity> : <View style={{ padding: calWidth(32), justifyContent: 'center', alignItems: 'center' }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#000', marginBottom: calWidth(8) }}>{translations.get('please_enable_location').val()}</PoppinsRegular>
              <TouchableOpacity
                onPress={() => {
                  this.requestFineLocation()
                }}
                style={{ marginBottom: 60, height: calWidth(48), backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), marginHorizontal: calWidth(24), justifyContent: 'center', alignItems: 'center', paddingHorizontal: calWidth(12) }}>
                <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff', }}>{translations.get('try_again').val()}</PoppinsRegular>
              </TouchableOpacity>
            </View>
            }
            <TouchableOpacity
              style={{ marginBottom: 60, height: calWidth(48), backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), marginHorizontal: calWidth(24), justifyContent: 'center', alignItems: 'center' }}
              onPress={() => {
                this.props.saveAddress({
                  "name": this.state.address_name,
                  "state": this.state.city,
                  "city": this.state.city,
                  "area": this.state.area,
                  "street": this.state.street_address,
                  "lat": this.state.latitude,
                  "long": this.state.longitude,
                  "building": this.state.apartment_number,
                  floor: this.state.floor,
                  token: this.props.token,
                  edit: this.props.edit,
                  id: this.props.item ? this.props.item._id : ''
                })
              }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('saving').val()}</PoppinsRegular>
            </TouchableOpacity>
            <View style={{ height: 50 }}></View>
          </ScrollView>
          {this.props.saveAddressSelector.pending ? <OverLay /> : null}
        </View >
      </Root>
    );
  }
}

export default AddAdressScreen;
