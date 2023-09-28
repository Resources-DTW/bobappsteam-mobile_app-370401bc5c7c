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
  FlatList,
  ActivityIndicator,

} from 'react-native';
import MainCard from '../MainCard';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { calWidth, calHeight } from 'src/utils/helpers';
import Colors from 'src/theme';
import translations from 'src/localization/Translations';
import { Api } from 'src/services';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import FastImage from 'react-native-fast-image';
import context from 'src/utils/context';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
class ShareOrderSlider extends Component {
  constructor() {
    super();
    this.state = {
      items: [{
        id: 'send',
        title: 'Send the link to your friends through WhatsApp.',
        title_ar: 'ارسل الرابط لاصدقائك من خلال الواتس اب.',
        image: require('assets/shareOrderLoti/friends.json'),
      }, {
        id: 'selectItems',
        title: 'They will select the items & send it to your shopping cart',
        title_ar: 'سوف يختارون المنتجات ويتم اضافتها الى سلتك.',
        image: require('assets/shareOrderLoti/selectItems.json'),
      }, {
        id: 'social',
        title: 'your shopping cart will be added from your friends',
        title_ar: 'سيتم تعبئة السلة من خلال اصدقائك.',
        image: require('assets/shareOrderLoti/social.json'),
      }],
      index: 0,
      newIndex: 0
    }
  }

  componentDidMount() {
  }

  startTimer = () => {
    if (!this.Timer) {
      this.Timer = setInterval(() => {
        this.setState({
          newIndex: this.state.newIndex < this.state.items.length - 1 ? this.state.newIndex + 1 : 0
        }, () => {
          this.flatList_Ref && this.flatList_Ref?.scrollToIndex({
            animated: this.state.newIndex == 0 ? false : true, index: context.isRTL() ? (this.state.items.length - 1 - this.state.newIndex) : this.state.newIndex
          });
        })

      }, 3000)
    }
  }

  componentWillUnmount() {
    if (this.Timer)
      clearInterval(this.Timer)
  }

  renderItem = ({ item, index }) => {
    const {
      title = "",
      title_ar = "",
      text = "",
      text_ar = "",
      image = "",
      item_id = "",
    } = item || {}
    return (<View style={{ flex: 1, marginBottom: calWidth(20) }}>
      <View style={{ width: calWidth(280), height: calWidth(300), }}>
        <LottieView
          ref={animation => {
            this['animation' + index] = animation;
          }}
          source={image}
          style={{ width: calWidth(260), height: '100%', }}
        // loop
        // autoPlay={this.state.index == index ? true : false}
        />
      </View>
      <View style={{ width: calWidth(280), alignSelf: 'center' }}>

        <PoppinsBold style={{ fontSize: calWidth(18), color: '#000000', textAlign: 'center' }}>{context.isRTL() ? title_ar : title}</PoppinsBold>
      </View>
    </View>)
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length) {
      this.setState({
        index: context.isRTL() ? (this.state.items.length - 1) - viewableItems[0].index : viewableItems[0].index,
        newIndex: context.isRTL() ? (this.state.items.length - 1) - viewableItems[0].index : viewableItems[0].index,
      }, () => {
        for (let i = 0; i < 3; i++) {
          this['animation' + i].pause()
        }
        this['animation' + this.state.newIndex].resume()
      })
    }
  }
  render() {
    return (
      <View style={{ marginBottom: calWidth(12), }}>
        <FlatList
          ref={ref => {
            this.flatList_Ref = ref;  // <------ ADD Ref for the Flatlist 
          }}
          data={this.state.items}
          renderItem={this.renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10
          }}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={{ position: 'absolute', zIndex: 32323, bottom: 0, alignSelf: 'center', flexDirection: 'row', }}>
          {this.state.items.map((slide, ii) => {
            if (true) {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: this.state.index == ii ? '#73F65E' : '#E0E0E0', width: calWidth(16), height: calWidth(5), borderRadius: calWidth(3), }} />)
            } else {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: this.state.index == ii ? Colors.mainColor1 : '#CECECE', width: calWidth(6), height: calWidth(6), borderRadius: calWidth(3) }} />)
            }
          })}
        </View>
      </View>
    );
  }
}

export default ShareOrderSlider;
