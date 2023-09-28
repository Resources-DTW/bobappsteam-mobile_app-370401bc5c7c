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
  ScrollView,
  Platform,

} from 'react-native';
import MainCard from '../MainCard';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { calWidth, calHeight } from 'src/utils/helpers';
import Colors from 'src/theme';
import translations from 'src/localization/Translations';
import context from 'src/utils/context';
import colors from 'src/theme/colors';
import { Api } from 'src/services';
const { width } = Dimensions.get('window');
class HorizontalCarosel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      list: context.isRTL() && Platform.OS == 'android' ? [...props.list].reverse() : [...props.list]
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.list.length != this.state.list.length && this.props.list.length > 0) {
      this.setState({
        list: context.isRTL() && Platform.OS == 'android' ? [...this.props.list].reverse() : [...this.props.list]
      })
    }
  }
  componentDidMount() {
    if (this.props.query) {
      this.fetchDataWithQuery(this.props.query)
    }
  }
  fetchDataWithQuery = async (query = "", page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsCall({ query: query, page: page, limit: 8, token: this.props.token, });
    if (response && response.data && response.data.data) {
      this.setState({
        list: context.isRTL() && Platform.OS == 'android' ? [...response.data.data].reverse() : [...response.data.data]
      })
      if (this.props.onLoad) {
        this.props.onLoad()
      }
    } else {
      if (this.props.onLoad) {
        this.props.onLoad()
      }
      this.setState({
        list: [],
        loading: false,
        isRefreshing: false,
        isLoading: false
      })
    }
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length) {
      this.setState({
        index: context.isRTL() ? (this.state.list.length - 1) - viewableItems[0].index : viewableItems[0].index,
        newIndex: (this.state.list.length - 1) - viewableItems[0].index,
      })
    }
  }
  render() {
    if (this.state.list.length > 0)
      return (
        <View style={[Platform.OS == 'ios' ? { direction: 'ltr' } : {}, { marginBottom: calWidth(16) }]}>
          <View style={{ flexDirection: Platform.OS == 'ios' && context.isRTL() ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: calHeight(10) }}>
            {/* <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#5C5C5C' }}>{translations.get('most_selling').val()}</PoppinsSemiBold> */}
            <View style={[{ paddingHorizontal: calWidth(24), paddingVertical: calWidth(8), borderRadius: calWidth(13), left: -13 },
            this.props.merchant?.parsingFeature['inbox_home_color'] ? { backgroundColor: Colors.mainColor1 } : {}]}>
              <PoppinsSemiBold style={[{ fontSize: calWidth(16) }, this.props.merchant?.parsingFeature['inbox_home_color'] ? { color: Colors.mainColor3 } : { color: colors.shadeColor3 != "" ? colors.shadeColor3 : '#5C5C5C' }]}>{this.props.title ? this.props.title : translations.get('most_selling').val()}</PoppinsSemiBold>
            </View>
            {/* <PoppinsRegular style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>View All ></PoppinsRegular> */}
          </View>
          <FlatList
            data={this.state.list}
            renderItem={({ item }) => <MainCard componentId={this.props.componentId} item={item} reverse={Platform.OS == 'ios' && context.isRTL()} />}
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
            keyExtractor={(item, index) => item._id + "mmdsjksd"}
            {...Platform.OS == 'android' ? {
              contentContainerStyle: { flexDirection: context.isRTL() ? 'row-reverse' : 'row' }
            } : context.isRTL() ?
              {
                inverted: true,
              } : {}
            }
          />
          <View style={{ position: 'absolute', zIndex: 32323, bottom: 0, alignSelf: 'center', flexDirection: 'row', }}>
            {this.state.list.map((slide, ii) => {
              return (<View style={{ marginHorizontal: calWidth(2), backgroundColor: this.state.index == ii ? '#1D2935' : '#CECECE', width: calWidth(6), height: calWidth(6), borderRadius: calWidth(3) }} />)
            })}
          </View>
        </View>
      );
    return (null);
  }
}

export default HorizontalCarosel;
