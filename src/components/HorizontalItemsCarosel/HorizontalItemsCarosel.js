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
import EasyCard from '../EasyCard';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { calWidth, calHeight } from 'src/utils/helpers';
import Colors from 'src/theme';
import translations from 'src/localization/Translations';
import context from 'src/utils/context';
import { Api } from 'src/services';
import { push, screenIds } from 'src/navigation';
import colors from 'src/theme/colors';
import CardTypeThree from '../CardTypeThree';
const { width } = Dimensions.get('window');
class HorizontalItemsCarosel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      list: context.isRTL() && Platform.OS == 'android' ? [...props.list || []].reverse() : [...props.list || []]
    }
  }
  componentDidMount() {
    if (this.props.cat) {
      this.fetchData(this.props.cat?._id)
    }
    if (this.props.query) {
      this.fetchDataWithQuery(this.props.query)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.list?.length != prevProps.list?.length && this.state.list != this.props.list) {
      this.setState({
        list: context.isRTL() && Platform.OS == 'android' ? [...this.props.list].reverse() : [...this.props.list]
      })
    } else if (this.props.list?.length == prevProps.list?.length && (prevProps.list?.length && prevProps.list?.[0]?.empty) && this.state.list != this.props.list) {
      this.setState({
        list: context.isRTL() && Platform.OS == 'android' ? [...this.props.list].reverse() : [...this.props.list]
      })
    }
  }

  fetchData = async (selectedCat, page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsByCategoryCall({ id: selectedCat, token: this.props.token, page: page, limit: 8 })
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

  render() {
    const { name_ar = "", name = "", _id: id } = this.props.cat || {}
    if (this.state.list.length > 0)
      return (
        <View style={Platform.OS == 'ios' ? { direction: 'ltr' } : {}}>
          <View style={{ flexDirection: Platform.OS == 'ios' && context.isRTL() ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: calHeight(10) }}>
            {this.props.noTitle ? null :
              <View style={[{ paddingHorizontal: calWidth(24), paddingVertical: calWidth(8), borderRadius: calWidth(13), left: -13 },
              this.props.merchant?.parsingFeature['inbox_home_color'] ? { backgroundColor: Colors.mainColor1 } : {}]}>
                <PoppinsSemiBold style={[{ fontSize: calWidth(16) }, this.props.merchant?.parsingFeature['inbox_home_color'] ? { color: Colors.mainColor3 } : { color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C' }]}>{this.props.cat ? context.isRTL() ? name_ar : name : this.props.title ? this.props.title : translations.get('most_selling').val()}</PoppinsSemiBold>
              </View>
              // <PoppinsSemiBold style={{ fontSize: calWidth(16), color:Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C' }}>{this.props.cat ? context.isRTL() ? name_ar : name : translations.get('most_selling').val()}</PoppinsSemiBold>
            }
            {this.props.cat ? <TouchableOpacity
              onPress={() => {
                push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
                  cat: {
                    ...this.props.cat
                  },
                  showFilter: true
                })
              }}
              style={{ flexDirection: context.isRTL() ? 'row-reverse' : 'row', alignItems: 'center', paddingHorizontal: calWidth(24) }}>
              <PoppinsRegular style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('see_all').val()}</PoppinsRegular>
              <Image source={require('assets/icons/go.png')} style={[{}, context.isRTL() ? { transform: [{ rotate: "180deg" }], marginRight: calWidth(4) } : { marginLeft: calWidth(4) }]} />
            </TouchableOpacity> : null}
          </View>
          <FlatList
            data={this.state.list}
            renderItem={({ item }) => {
              if (this.props.merchant?.parsingFeature['item_card_3']) return <CardTypeThree componentId={this.props.componentId} item={item} reverse={Platform.OS == 'ios' && context.isRTL()} />
              else return <EasyCard componentId={this.props.componentId} item={item} reverse={Platform.OS == 'ios' && context.isRTL()} />
            }}
            ListEmptyComponent={() => {
              return (<View style={{ width: width, justifyContent: 'center', alignItems: 'center', height: calHeight(210), }}>
                <ActivityIndicator size="large" />
              </View>)
            }}
            ListHeaderComponent={() => <View style={{ width: calWidth(12) }} />}
            ListFooterComponent={() => <View style={{ width: calWidth(12) }} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item._id + "mmdsjksd" + index}
            getItemLayout={(data, index) => ({ index, length: calWidth(136), offset: (calWidth(136) * index) })}
            {...Platform.OS == 'android' ? {
              contentContainerStyle: { flexDirection: context.isRTL() ? 'row-reverse' : 'row' }
            } : context.isRTL() ?
              {
                inverted: true,
              } : {}
            }
          />
        </View>
      );
    return (null);
  }
}

export default HorizontalItemsCarosel;
