// @flow

import React, { PureComponent } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  UIManager,
  LayoutAnimation,
  Image,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import FastImage from 'react-native-fast-image';
import { push, screenIds, showModal } from 'src/navigation';
import { calWidth } from 'src/utils/helpers';
import Colors from 'src/theme';
const { width } = Dimensions.get('window');
class FullCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      index: 0
    }
  }
  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeInEaseOut', 'scaleXY')
      );
  }

  componentDidMount() {
    this.setState({ slides: this.props.slides })
  }

  componentDidUpdate(prevProps) {

  }

  renderCard = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.handlePress(item)}
        style={[{ height: calWidth(273), width: width, }, this.props.style]}>
        <FastImage nativeID={`image${item}Dest`} source={{ uri: item }} style={{ width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }} resizeMode='contain' >

        </FastImage>

      </TouchableOpacity>
    )
  }

  handlePress = (item) => {
    const { is_category = false, url = "" } = item || {};
    // if (is_category) {
    //   push(this.props.componentId, screenIds.CATEGORY_SCREEN, { id: url })
    // } else {
    //   Linking.canOpenURL(url).then(() => {
    //     Linking.openURL(url)
    //   })
    // }
    showModal(screenIds.IMAGE_VIEW_SCREEN, { images: this.props.slides })
  }
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length)
      this.setState({ index: (this.props.slides.length - 1) - viewableItems[0].index })
    // this.setState({ viewableItems: viewableItems })
  }
  render() {

    if (this.props.slides.length === 0)
      return null;
    return (
      <View>
        <FlatList
          data={this.props.slides}
          renderItem={this.renderCard}
          horizontal
          pagingEnabled
          inverted
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={this.onViewableItemsChanged}
          keyExtractor={(item, index) => index + "dsd"}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
        />
        <View style={{ position: 'absolute', zIndex: 2112, bottom: calWidth(12), alignSelf: 'center', flexDirection: 'row' }}>
          {this.props.slides.map((slide, ii) => {
            return (<View key={ii} style={{ marginHorizontal: calWidth(2), backgroundColor: this.state.index == ii ? Colors.mainColor1 : 'rgba(255,255,255,1)', width: calWidth(8), height: calWidth(8), borderRadius: calWidth(4) }} />)
          })}
        </View>

      </View>
    );
  }
}

export default FullCarousel;
