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
  TextInput,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { pop } from 'src/navigation';
import translations from 'src/localization/Translations';
import MapView, { Marker } from 'react-native-maps';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import axios from 'axios'
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import context from 'src/utils/context';
import Geolocation from '@react-native-community/geolocation';

class SelectLocationOnMapScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictions: [],
      latitude: props.latitude,
      longitude: props.longitude,
      search: '',

    }
    this.mapNormal = React.createRef();

  }
  componentDidMount() {
  }

  getPlaces = async (input) => {
    const { lat, lng } = this.props;
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDHUWPfalHhfjfnxRcyd-PfIUN_sMhdxo4&input=${input}&location=${this.state.latitude},${this.state.longitude}&radius=2000&&language=${context.getCurrentLanguage()}`
    );
    this.setState({ predictions: result.data.predictions });
  }

  showDirectionsOnMap = async (prediction) => {
    try {
      const { place_id, structured_formatting = {} } = prediction || {}
      this.setState({ predictions: [], search: structured_formatting.main_text })
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyDHUWPfalHhfjfnxRcyd-PfIUN_sMhdxo4&place_id=${place_id}&language=${context.getCurrentLanguage()}`
      );
      const { location } = result.data.result.geometry || {}
      this.moveToPoint({ latitude: location.lat, longitude: location.lng })
      Keyboard.dismiss()
    } catch (err) {
      // alert(JSON.stringify(err.message));
    }
  }

  moveToPoint = async ({ latitude, longitude }) => {

    const region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    };
    this.mapNormal.current.animateToRegion(region, 500);
  };

  handleChangeRegion = (regoin) => {
    this.setState({
      latitude: parseFloat(regoin.latitude.toFixed(6)),
      longitude: parseFloat(regoin.longitude.toFixed(6))
    })
  }

  currentLocationBtn = async () => {

    Geolocation.getCurrentPosition(position => {
      this.moveToPoint({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });

  };

  render() {
    const {
      suggestionStyle,
      main_textStyle,
      secondary_textStyle,
      placeInputStyle
    } = styles;
    const predictions = this.state.predictions.map((prediction, index) => {
      const { id, structured_formatting } = prediction;
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={id}
          onPress={() => this.showDirectionsOnMap(prediction)}
        >
          <View style={[suggestionStyle, index == 0 ? { borderTopWidth: 0 } : {}]}>
            <Text style={main_textStyle}>
              {structured_formatting.main_text}
            </Text>
            <Text style={secondary_textStyle}>
              {structured_formatting.secondary_text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View style={{ width: '100%', height: '100%', backgroundColor: '#fff' }} >
        <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('map').val()}</PoppinsSemiBold>
        </View>
        <View style={{ backgroundColor: Colors.mainColor2, paddingHorizontal: calWidth(24), paddingBottom: calWidth(8) }}>

          <View style={{
            height: calWidth(50), backgroundColor: '#fff', borderRadius: calWidth(10),
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: {
              height: 0,
              width: 0
            },
            elevation: 2,
          }}>

            <TextInput
              style={{ flex: 1, paddingHorizontal: calWidth(12) }}
              onChangeText={(text) => {
                this.getPlaces(text)
                this.setState({
                  search: text
                })
              }}
              value={this.state.search}
            />
          </View>
        </View>

        <View style={{ zIndex: 3223, position: 'absolute', top: Platform.OS == 'ios' ? calWidth(100) : calWidth(60), left: calWidth(58), right: calWidth(50) }}>
          {/* <View style={{ height: 200, width: '100%', backgroundColor: 'red' }}></View> */}
          {predictions.length == 0 ? null : predictions}
        </View>
        <View style={{ flex: 1 }}>

          <MapView
            ref={this.mapNormal}
            // provider={'google'}
            style={{ flex: 1, }}
            initialRegion={{
              latitude: parseFloat(this.state.latitude != "" ? this.state.latitude : 31.9911),
              longitude: parseFloat(this.state.longitude != "" ? this.state.longitude : 35.8683),
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            }}
            // showsUserLocation={false}
            // followsUserLocation={false}
            // showsMyLocationButton={false}
            // showsBuildings={true}
            // showsPointsOfInterest={true}
            // userLocationAnnotationTitle={true}
            // // onRegionChangeComplete={this.props.onRegionChange}
            // zoomControlEnabled={false}
            // // zoomEnabled={false}
            // showsUserLocation={false}
            // // mapPadding={Platform.OS == 'ios' ? {} : { top: 0, right: calWidth(76), bottom: 0, left: calWidth(76), }}
            // loadingEnabled
            onRegionChange={this.handleChangeRegion}

          >

          </MapView>
          <View style={{
            left: '50%',
            marginLeft: -8,
            marginTop: -30,
            position: 'absolute',
            top: '50%'
          }}>
            <Image
              style={{
                tintColor: 'red'
              }}
              source={require('assets/icons/map2.png')} />
          </View>
        </View>
        <View style={{
          width: calWidth(54),
          height: calWidth(54),
          position: 'absolute',
          bottom: calWidth(140),
          left: calWidth(16),
          borderRadius: calWidth(4),
        }}>
          <TouchableOpacity
            onPress={this.currentLocationBtn}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: calWidth(4),
              shadowColor: "#000000",
              shadowOpacity: 0.16,
              shadowRadius: 6,
              shadowOffset: {
                height: 3,
                width: 0
              },
              elevation: 2,
            }}>

            <View style={{ width: calWidth(24), height: calWidth(24), justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('assets/icons/pin_location.png')} style={{ width: '100%', height: '100%', tintColor: Colors.mainColor1 }} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ padding: calWidth(24), backgroundColor: '#fff', paddingBottom: calWidth(60) }}>
          <TouchableOpacity onPress={() => {
            this.props.onChange({
              latitude: this.state.latitude,
              longitude: this.state.longitude
            })
            pop(this.props.componentId)
          }} style={{ height: calWidth(48), backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center' }}>
            <PoppinsRegular style={{ color: '#fff', fontSize: calWidth(16) }}>{translations.get('apply').val()}</PoppinsRegular>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeInputStyle: {
    height: 40,
    marginTop: 16,
    padding: 5,
    backgroundColor: "white",
    color: '#000',
    textAlign: 'left',
    fontSize: 16,
    borderRadius: 3,
    borderColor: '#777',
    borderWidth: 1,
    marginHorizontal: 20,
    width: '90%',
    alignSelf: 'center'
  },
  secondary_textStyle: {
    color: "#777",
    textAlign: 'left',
    fontSize: (12)
  },
  main_textStyle: {
    color: "#000",
    textAlign: 'left',
    fontSize: (14)
  },
  suggestionStyle: {
    borderTopWidth: 0.5,
    backgroundColor: "white",
    borderColor: "#777",
    padding: 15,
    width: '100%'
  }
});

export default SelectLocationOnMapScreen;
