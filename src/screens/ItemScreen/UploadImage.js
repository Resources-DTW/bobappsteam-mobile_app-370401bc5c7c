import React, { useCallback } from 'react';
import { Alert, Image, View, TouchableOpacity } from 'react-native';
import translations from 'src/localization/Translations';
import ImagePicker from 'react-native-image-crop-picker';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { calWidth } from 'src/utils/helpers';
import { useSelector } from 'react-redux';
import ImageEditor from "@react-native-community/image-editor";

const UploadImage = (props) => {

  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}

  const { setImage, image = null } = props;
  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      compressImageQuality: 0.8,
      includeBase64: true,

    }).then(async image => {
      var uri = await ImageEditor.cropImage(image.path, {
        size: {
          width: image.width,
          height: image.height
        },
        offset: {
          x: 0,
          y: 0
        },
        displaySize: {
          width: 200,
          height: 200
        },
        resizeMode: 'cover'
      });
      setImage({ ...image, path: uri });
    }).catch(error => {

    });
  }, [setImage])


  const openGallery = useCallback(() => {
    ImagePicker.openPicker({
      multiple: false,
      sortOrder: 'asc',
      mediaType: 'photo',
      includeBase64: true,
      compressImageQuality: 0.8,
    }).then(async image => {
      var uri = await ImageEditor.cropImage(image.path, {
        size: {
          width: image.width,
          height: image.height
        },
        offset: {
          x: 0,
          y: 0
        },
        displaySize: {
          width: 200,
          height: 200
        },
        resizeMode: 'cover'
      });
      setImage({ ...image, path: uri });
    }).catch(error => {
    })
  }, [setImage]);



  const _uploadImage = useCallback(() => {
    Alert.alert(
      translations.get('change_image').val(),
      '',
      [
        { text: translations.get('camera').val(), onPress: openCamera },
        { text: translations.get('gallary').val(), onPress: openGallery },
        {
          text: translations.get('cancel').val(),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },

      ],
      { cancelable: false },
    );
  }, [openCamera, openGallery]);
  if (parsingFeature['item_upload_image'])
    return (<View style={{ justifyContent: 'center', alignItems: 'center' }}>

      <TouchableOpacity
        onPress={_uploadImage}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <PoppinsSemiBold style={{ fontSize: calWidth(16), marginBottom: calWidth(4) }}>{translations.get('upload_your_image').val()}</PoppinsSemiBold>
        <Image source={image && image?.path ? { uri: image?.path } : require('assets/icons/uploadimage.png')} style={{ width: 120, height: 60, resizeMode: "contain" }} />
      </TouchableOpacity>
    </View>)

  return null;
}

export default UploadImage;