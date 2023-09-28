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
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { Root, Footer, Container } from 'native-base';
import MainFooter from '../MainFooter';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { showModal, screenIds, dissmisAndShowModal, pop, push } from 'src/navigation';
import context from 'src/utils/context';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import HorizontalItemsCarosel from '../HorizontalItemsCarosel';
import { Api } from 'src/services';
import EasyCard from '../EasyCard';
import CardTypeThree from '../CardTypeThree';

class VerticalItemsCarosel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cat: props.cat,
      hide: false,
      list: [],
      page: 0,
      nextPage: 0,
      total_count: 0,
      isLoading: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.fetchData(this.props.cat._id)
    }, 0);
  }
  fetchData = async (selectedCat, page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsByCategoryCall({ id: this.props.cat?._id, sub_cat: this.props.cat?.sub_cat ? this.props.cat?.sub_cat : null, token: this.props.token, page: page, offer_only: this.props.isOffer, })
    if (response && response.data && response.data.data) {
      const newData = response.data.data;
      if (newData.length % 2 == 1) {
        newData.push({ hide: true, empty: true })
      }
      this.setState({
        list: [
          ...this.state.list,
          ...newData
        ],
        loading: false,
        isRefreshing: false,
        page: page,
        nextPage: page + 1,
        total_count: response.data.total_count,
        isLoading: false,
        hide: page == 1 ? response.data.data.length == 0 : false
      })
    } else {
      this.setState({
        loading: false,
        isRefreshing: false,
        isLoading: false,
        hide: page == 1 ? true : false
      })
    }
  }
  fetchMore = () => {
    if (!this.state.isLoading) {
      if (this.state.page < this.state.nextPage) {
        if (this.state?.list?.length < this.state.total_count) {
          this.fetchData(this.props.cat._id, this.state.page + 1)
        }
      }
    }
  }

  renderItem = ({ item }) => {
    if (this.props.merchant?.parsingFeature['item_card_3']) return <CardTypeThree componentId={this.props.componentId} item={item} flex={true} />
    else return <EasyCard componentId={this.props.componentId} item={item} flex={true} />
  }

  render() {
    if (this.state.hide) return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <PoppinsRegular style={{ fontSize: calWidth(16) }}>
          {this.props.isOffer ? translations.get('no_offers').val() : translations.get('no_result').val()}
        </PoppinsRegular>
      </View>
    )
    return (
      <FlatList
        data={this.state.list}
        renderItem={this.renderItem}
        ListEmptyComponent={() => {
          return (<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: calHeight(210), }}>
            <ActivityIndicator size="large" />
          </View>)
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item._id + "mmdsjksd" + index}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: calWidth(14) }}
        ListFooterComponent={() => <View style={{ height: calWidth(80) }} />}
        onEndReached={this.fetchMore}
        removeClippedSubviews={true}
      />
    )
  }
}

export default VerticalItemsCarosel;
