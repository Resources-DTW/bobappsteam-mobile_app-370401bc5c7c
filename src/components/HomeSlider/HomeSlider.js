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
  Alert,

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
import { push, screenIds } from 'src/navigation';
const { width } = Dimensions.get('window');
class HomeSlider extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      index: 0,
      newIndex: 0
    }
  }

  componentDidMount() {
    this.fetchData()
    if (this.props.merchant?.parsingFeature?.['timer_slider']) {
      setTimeout(() => {
        this.startTimer()
      }, 2000);
    }
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
  fetchData = async () => {
    const response = await Api.getSlidesCall({ token: this.props.token })
    if (response && response.data && response.data.data) {
      this.setState({
        items: response.data.data
      })
    }
  }

  handlePress = (item) => {
    const { item_id = "", category_id = "", sub_category_id = "", text = "", text_ar = "", title_ar = "", title = "" } = item || {}
    if (item_id != "") {
      push(this.props.componentId, screenIds.ITEM_SCREEN, { item: { _id: item_id, }, getItem: true })
    } else if (category_id != "") {
      if (this.props.merchant?.parsingFeature['menu_categories']) {
        push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, {
          cat: {
            _id: category_id
          },
        }, {}, null, false)
      }
      else if (this.props.merchant?.parsingFeature['menu_category_2']) {
        push(this.props.componentId, screenIds.MENU_SCREEN, {
          cat: {
            _id: category_id
          }, showBack: true
        }, {}, null, false)
      }
      else {
        push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
          cat: {
            _id: category_id
          },
          showFilter: true
        })
      }
    } else if (sub_category_id != "") {
      push(this.props.componentId,
        screenIds.CATEGORY_SCREEN, {
        cat: {
          _id: sub_category_id,
        }
      })
    } else if (text != "" || text_ar != "") {
      Alert.alert(context.isRTL() ? title_ar : title, context.isRTL() ? text_ar : text)
    }
  }

  renderItem = ({ item, index }) => {
    const {
      title = "",
      title_ar = "",
      text = "",
      text_ar = "",
      image = "",
      item_id = ""
    } = item || {}
    if (this.props.merchant.parsingFeature['slider_type_3']) {
      return (
        <View style={{ marginHorizontal: calWidth(12), marginBottom: calWidth(24) }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.handlePress(item)
            }}
            style={{ width: calWidth(350), height: calWidth(180) }}>
            <FastImage source={{ uri: image }} style={{ width: '100%', height: '100%', }} resizeMode='stretch' >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: calWidth(12), }}>
                <PoppinsRegular style={{ fontSize: calWidth(22), color: '#fff', textAlign: 'center', marginBottom: calWidth(22) }}>{context.isRTL() ? title_ar : title}</PoppinsRegular>
                <PoppinsRegular style={{ fontSize: calWidth(15), color: '#fff', textAlign: 'center', marginBottom: calWidth(22) }}>{context.isRTL() ? text_ar : text}</PoppinsRegular>
              </View>
            </FastImage>
          </TouchableOpacity>
        </View >
      )
    } else
      if (this.props.merchant.parsingFeature['slider_type_1']) {
        return (
          <View style={{ marginHorizontal: calWidth(24), marginBottom: calWidth(24) }}>
            <View style={{ width: calWidth(328), height: calWidth(175), backgroundColor: Colors.mainColor1, borderRadius: calWidth(22) }}>
              <View style={{ position: 'absolute', height: '100%', width: calWidth(225), borderRadius: calWidth(22), alignSelf: 'flex-end' }}>
                <FastImage source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: calWidth(22) }} />
              </View>
              <View style={{ flex: 1, alignSelf: 'flex-start', paddingLeft: calWidth(24), justifyContent: 'center' }}>
                {title_ar != "" && title != "" ? <PoppinsRegular style={{ fontSize: calWidth(10), color: Colors.shadeColor1, marginBottom: calWidth(12) }}>{context.isRTL() ? title_ar : title}</PoppinsRegular> : null}
                <View style={{ width: '50%' }}>

                  <PoppinsBold style={{ fontSize: calWidth(16), color: Colors.shadeColor3, marginBottom: calWidth(20) }}>{context.isRTL() ? text_ar : text}</PoppinsBold>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    this.handlePress(item)
                  }}

                  style={{ backgroundColor: Colors.shadeColor1, borderRadius: calWidth(2), height: calWidth(22), width: calWidth(70), justifyContent: 'center', alignItems: 'center' }}>
                  <PoppinsBold style={{ color: Colors.shadeColor2, fontSize: calWidth(10) }}>{translations.get('shop_now').val()}</PoppinsBold>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else {
        return (
          <View style={{ marginHorizontal: calWidth(24), marginBottom: calWidth(24) }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.handlePress(item)
              }}
              style={{ width: calWidth(328), height: calWidth(190), borderRadius: calWidth(22) }}>
              <FastImage source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: calWidth(22) }} resizeMode='stretch' />
            </TouchableOpacity>
          </View>
        )
      }

  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length) {
      this.setState({
        index: context.isRTL() ? (this.state.items.length - 1) - viewableItems[0].index : viewableItems[0].index,
        newIndex: context.isRTL() ? (this.state.items.length - 1) - viewableItems[0].index : viewableItems[0].index,
      })
    }
  }
  render() {
    return (
      <View style={{ marginBottom: calWidth(12) }}>
        <FlatList
          ref={ref => {
            this.flatList_Ref = ref;  // <------ ADD Ref for the Flatlist 
          }}
          data={this.state.items}
          renderItem={this.renderItem}
          ListEmptyComponent={() => {
            return (<View style={{ width: width, justifyContent: 'center', alignItems: 'center', height: calHeight(210), }}>

              <ActivityIndicator size="large" />
            </View>)
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
        />
        <View style={{ position: 'absolute', zIndex: 32323, bottom: 0, alignSelf: 'center', flexDirection: 'row', }}>
          {this.state.items.map((slide, ii) => {
            if (this.props.merchant.parsingFeature['slider_type_2'] || this.props.merchant.parsingFeature['slider_type_3']) {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: Colors.mainColor1, width: calWidth(33), height: calWidth(5), borderRadius: calWidth(3), opacity: this.state.index == ii ? 1 : 0.3 }} />)
            } else if (this.props.merchant.parsingFeature['slider_type_1']) {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: this.state.index == ii ? Colors.mainColor1 : '#CECECE', width: calWidth(6), height: calWidth(6), borderRadius: calWidth(3) }} />)
            } else {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: Colors.mainColor1, width: calWidth(33), height: calWidth(5), borderRadius: calWidth(3), opacity: this.state.index == ii ? 1 : 0.3 }} />)
            }
          })}
        </View>
      </View>
    );
  }
}

export default HomeSlider;
