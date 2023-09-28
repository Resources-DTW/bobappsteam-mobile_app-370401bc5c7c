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
  TextInput,
  FlatList,
  ScrollView
} from 'react-native';
import { goToApp, pop, dismissModal } from '../../navigation';
import { Header, Container } from 'native-base';
const { width, height } = Dimensions.get('window');
export const dimensionsCalculation = (IPhonePixel) => {

  return width < height ? width * (IPhonePixel * 3) / 375 : height * (IPhonePixel * 3) / 375
}

import ImageViewer from '../../components/ImageSwiper';
import context from 'src/utils/context';

const images = [{
  // Simplest usage.
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
  // width: number
  // height: number
  // Optional, if you know the image size, you can set the optimization performance

  // You can pass props to <Image />.
  props: {
    // headers: ...
  }
}, {
  url: '',
  props: {
    // Or you can set source directory.
    // source: require('assets/images/rectangle.png')
  }
}]

class ImageViewScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      images: props.images.map(im => ({ url: im, }))
    }
  }
  componentDidMount() {

  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Header style={{ backgroundColor: 'transparent', borderBottomWidth: 0, justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: dimensionsCalculation(6.7) }} >
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => dismissModal(this.props.componentId)}>
            <View style={{ width: dimensionsCalculation(6.7), height: dimensionsCalculation(6.7) }}>

              <Image source={require('assets/icons/close.png')} style={{ tintColor: '#fff', width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
          </TouchableOpacity>
        </Header>
        {/* <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}>
          {this.state.images.map((img, i) => {
            return (
              // <View style={{ justifyContent: 'center', alignItems: 'center', }}>
              <ImageZoom
                key={i + "image"}
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height}
                imageWidth={Dimensions.get('window').width}
                imageHeight={300}
              >
                <FastImage style={{ width: Dimensions.get('window').width, height: '100%' }} resizeMode="contain"
                  source={{ uri: img.url }} />
              </ImageZoom>
              // </View>
            )
          })}
        </ScrollView> */}

        <ImageViewer lang={context.getCurrentLanguage()} imageUrls={this.state.images} />
      </View>
    );
  }
}

export default ImageViewScreen;
