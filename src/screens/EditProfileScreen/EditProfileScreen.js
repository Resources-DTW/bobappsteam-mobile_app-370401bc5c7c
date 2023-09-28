// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Container } from 'native-base';
import { calWidth, showToastError, showToastItemSuccess } from 'src/utils/helpers';
import { pop } from 'src/navigation';
import translations from 'src/localization/Translations';
import Colors from 'src/theme';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import FastImage from 'react-native-fast-image';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import context from 'src/utils/context';
import { Picker } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import { OverLay } from 'src/components/OverLay';
import { Api } from 'src/services';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');
const dimensionsCalculation = (IPhonePixel) => {
  return width * IPhonePixel / 375
}


class EditProfileScreen extends PureComponent {

  constructor(props) {
    super(props);
    const { full_name = "", email = "", birth_date = "", phone = "", gender = "" } = props.user || {}
    this.state = {
      name: full_name,
      email: email,
      birth_date: birth_date,
      phone: phone,
      gender: gender,
      loading: false,
      image: null
    }

  }

  openCamera = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.8,
      includeBase64: true,
      width: 400, height: 400

    }).then(image => {
      this.setState({
        image: image
      })
    }).catch(error => {
      // this.setState({
      //   isModalVisible: false
      // })
    })
  }

  openGallery = () => {
    ImagePicker.openPicker({
      multiple: false,
      sortOrder: 'asc',
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.8,
      width: 400, height: 400
    }).then(image => {
      this.setState({
        image: image
      })

    }).catch(error => {
    })
  }


  handleDatePicked = date => {

    this.setState({ birth_date: date });
  };

  handleEdit = async () => {
    this.setState({
      loading: true
    })

    // var form = new FormData();
    let data = null
    if (this.state.image) {
      if (!this.state.image.path.startsWith("file://")) {
        this.state.image.path = "file://" + this.state.image.path
      }
      data = {
        uri: this.state.image.path,
        name: this.state.image.filename || 'image' + '.JPG',
        type: this.state.image.mime,
      }
    }
    // form.append('image', data);
    var avatar = {}
    if (data) {
      avatar = {
        avatar: data
      }
    }

    const response = await Api.updateInfoCall({
      "full_name": this.state.name,
      "gender": this.state.gender,
      "birth_date": this.state.birth_date,
      "email": this.state.email,
      "phone": this.state.phone,
      token: this.props.token,
      ...avatar
    });
    if (response && response.data && response.data.status == 200) {
      this.setState({ loading: false })
      this.props.getProfileData({ token: this.props.token })

      showToastItemSuccess(translations.get('edit_success').val())
    } else {
      this.setState({ loading: false })
      showToastError(translations.get('something_worng').val())
    }

  }
  render() {
    let list = [];

    if (Platform.OS === 'android') {
      list.push(<Picker.Item label={translations.get('male').val()} value="male" />)
      list.push(<Picker.Item label={translations.get('female').val()} value="female" />)
    } else {
      list.push(<Picker.Item label={translations.get('male').val()} value="male" />)
      list.push(<Picker.Item label={translations.get('female').val()} value="female" />)
    }
    const { avatar = "" } = this.props.user || {}
    const { logo = "", splash_logo = "" } = this.props.merchant || {}

    return (<View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
        <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
          <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
        </TouchableOpacity>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('Edit_Profile').val()}</PoppinsSemiBold>
      </View>
      <ScrollView>


        <View style={{ justifyContent: 'center', alignItems: 'center', padding: calWidth(24) }}>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Alert.alert(
                translations.get('change_image').val(),
                '',
                [
                  { text: translations.get('camera').val(), onPress: this.openCamera },
                  { text: translations.get('gallary').val(), onPress: this.openGallery },
                  {
                    text: translations.get('cancel').val(),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },

                ],
                { cancelable: false },
              );
            }}
            style={{ width: calWidth(92), height: calWidth(92) }}>
            <FastImage source={this.state.image ? { uri: this.state?.image?.path } : avatar != "" ? { uri: avatar } : { uri: splash_logo }} style={{ width: '100%', height: '100%', borderRadius: calWidth(92) }} resizeMode={avatar != "" || this.state.image ? 'cover' : 'contain'} >
            </FastImage>
            {/* <View style={{
              position: 'absolute', zIndex: 22, bottom: -calWidth(8), right: -calWidth(8), width: calWidth(36), height: calWidth(36), backgroundColor: '#F2F2F2', borderRadius: calWidth(18),
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image source={require('assets/icons/edit.png')} />
            </View> */}
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191' }}>{translations.get('name').val()}</PoppinsRegular>
          <TextInput
            style={{
              textAlign: context.isRTL() ? 'right' : 'left',
              fontSize: calWidth(16),
              color: '#434343',
              borderBottomColor: 'rgba(51,142,0,0.13)', borderBottomWidth: 1,
              paddingVertical: calWidth(8)
            }}
            placeholder={translations.get('enter_name').val()}
            value={this.state.name}
            onChangeText={(text) => {
              this.setState({
                name: text
              })
            }}
          />
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191' }}>{translations.get('gender').val()}</PoppinsRegular>
          {/* <View style={{ paddingHorizontal: Platform.OS == 'android' ? dimensionsCalculation(8) : 0 }}> */}

          <Picker
            mode="dropdown"
            style={{ width: '100%', borderRadius: dimensionsCalculation(4), borderBottomColor: 'rgba(51,142,0,0.13)', borderBottomWidth: 1, }}
            textStyle={{ color: '#434343', textAlign: 'left', paddingLeft: 0 }}
            placeholder={translations.get('choose_gender').val()}
            placeholderStyle={{ color: "#ACB1C0", fontSize: dimensionsCalculation(16), }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.gender}
            onValueChange={(text) => {
              this.setState({
                gender: text
              })
            }}
          >
            {list}
          </Picker>
          {/* </View> */}
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191' }}>{translations.get('email').val()}</PoppinsRegular>
          <TextInput
            style={{
              textAlign: context.isRTL() ? 'right' : 'left',
              fontSize: calWidth(16),
              color: '#434343',
              borderBottomColor: 'rgba(51,142,0,0.13)', borderBottomWidth: 1,
              paddingVertical: calWidth(8)
            }}
            placeholder={translations.get('enter_your_email').val()}
            value={this.state.email}
            onChangeText={(text) => {
              this.setState({
                email: text
              })
            }}
          />
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191' }}>{translations.get('phone').val()}</PoppinsRegular>
          <TextInput
            editable={false}
            style={{
              textAlign: context.isRTL() ? 'right' : 'left',
              fontSize: calWidth(16),
              color: '#434343',
              borderBottomColor: 'rgba(51,142,0,0.13)', borderBottomWidth: 1,
              paddingVertical: calWidth(8)
            }}
            placeholder={translations.get('enter_phone').val()}
            value={this.state.phone}
            onChangeText={(text) => {
              this.setState({
                phone: text
              })
            }}
          />
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>
          <PoppinsRegular style={{ fontSize: calWidth(16), color: '#919191' }}>{translations.get('birthday').val()}</PoppinsRegular>
          <DatePicker
            androidMode='spinner'
            locale={context.isRTL() ? 'ar-jo' : 'en-us'}
            style={{ width: '100%', borderBottomColor: 'rgba(51,142,0,0.13)', borderBottomWidth: 1, textAlign: 'left' }}
            date={this.state.birth_date}
            mode="date"
            placeholder={translations.get('choose_date').val()}
            format="YYYY-MM-DD"
            confirmBtnText={translations.get('done').val()}
            cancelBtnText={translations.get('close').val()}
            customStyles={{
              dateIcon: {
                width: 0, height: 0
              },
              dateInput: {
                // marginLeft: 36
                borderColor: '#fff', borderWidth: 1
              },
              dateText: {
                textAlign: 'left',
                width: '100%',
                fontSize: calWidth(16),
                color: '#434343',
              },
              placeholderText: {
                textAlign: 'left',
                width: '100%',
                fontSize: calWidth(16),
              }
            }}
            onDateChange={(date) => { this.handleDatePicked(date) }}
          />
        </View>
        <View style={{ paddingHorizontal: calWidth(24), marginBottom: dimensionsCalculation(24), }}>

          <TouchableOpacity
            onPress={this.handleEdit}
            style={{
              width: '100%',
              height: calWidth(57),
              backgroundColor: Colors.mainColor2,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: calWidth(10),
              marginBottom: calWidth(8),
              paddingHorizontal: calWidth(16)
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <View style={{ width: calWidth(24), height: calWidth(24) }}>

                <Image source={require('assets/icons/checkout.png')} style={{ tintColor: '#fff', width: '100%', height: '100%' }} resizeMode="contain" />
              </View>

              <PoppinsRegular style={{ fontSize: calWidth(19), color: "#fff", marginLeft: calWidth(8) }}>{translations.get('saving').val()}</PoppinsRegular>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {this.state.loading ? <OverLay /> : null}
    </View>)
  }
}

export default EditProfileScreen;
