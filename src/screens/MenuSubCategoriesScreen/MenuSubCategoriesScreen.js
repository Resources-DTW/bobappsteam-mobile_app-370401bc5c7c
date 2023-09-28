// @flow

import { Container } from 'native-base';
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import Header from 'src/components/Header';
import MainContainer from 'src/components/MainContainer';
import SubCategory from 'src/components/SubCategory';
import VerticalItemsCarosel from 'src/components/VerticalItemsCarosel';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import { pop, push, screenIds } from 'src/navigation';
import { Api } from 'src/services';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calHeight, calWidth } from 'src/utils/helpers';

class MenuSubCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_categories: [],
      selectedCat: props.cat._id,
      loading: true,
      showVerticalList: false,
      isRefreshing: false,
      main_sub_categories: [],
      renderCategories: [],
      loaded: 0
    }
    this.navigationEvents = Navigation.events().bindComponent(this);

  }
  componentDidAppear() {
    this.props.showHideFooterAction(true)
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.props.categories) {
        this.setState({
          sub_categories: this.props.categories.length ? [...this.props.categories] : [],
          main_sub_categories: this.props.categories.length ? [...this.props.categories] : [],
          loading: false,
          isRefreshing: false,
          showVerticalList: this.props.categories.length == 0,
          renderCategories: (this.props.categories.length ? [...this.props.categories] : []).slice(0, 3)
        })
      } else {
        this.getSubCats()
      }
    }, 200);
  }

  getSubCats = async () => {

    let response = {}
    if (this.props.cat?.main) {
      response = await Api.getCateogriesCall({ token: this.props.token, offer_only: true });

    } else {
      response = await Api.getSubCatsCall({ token: this.props.token, page: 1, cat_id: this.props.cat?.sub_cat ? this.props.cat?.sub_cat : this.props.cat._id == 'all' ? null : this.props.cat._id });
    }
    if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
      this.setState({
        sub_categories: response.data.data.length ? [...response.data.data] : [],
        main_sub_categories: response.data.data.length ? [...response.data.data] : [],
        loading: false,
        showVerticalList: response.data.data.length == 0,
        isRefreshing: false,
        renderCategories: (response.data.data.length ? [...response.data.data] : []).slice(0, 3)
      })
    } else {
      this.setState({
        showVerticalList: true,
        loading: false,
        isRefreshing: false
      })
    }
  }

  renderSubCat = (cat) => {
    return (
      <SubCategory
        componentId={this.props.componentId}
        cat={{
          ...cat,
          _id: this.props?.cat?._id,
          sub_cat: cat?._id
        }}
        isOffer={this.props.isOffer}
        onLoad={() => {
          // console.warn('fff')
          this.setState(prevState => ({
            loaded: prevState.loaded + 1
          }))
        }}
      />
    )
  }

  renderSubCats = () => {
    if (this.state.main_sub_categories.length > 0) {
      return (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {this.state.main_sub_categories.map((cat, index) => this.renderCategory(cat, index))}
          </ScrollView>
        </View>)
    }
  }

  renderCategory = (cat, index, subCat = false) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id: id } = cat || {}

    return (
      <TouchableOpacity
        disabled={name == 'ALL'}
        key={index}
        activeOpacity={1}
        onPress={() => {
          push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, {
            cat: {
              ...cat,
              _id: this.props.cat?._id,
              sub_cat: cat._id
            }, isOffer: this.props.isOffer
          }, {}, null, false)
        }}
        style={{
          backgroundColor: true ? Colors.mainColor1 : '#B3B1B2',
          marginLeft: calWidth(8), marginRight: index == this.state.sub_categories.length - 1 ? calWidth(8) : 0, borderRadius: calWidth(5), justifyContent: 'center', alignItems: 'center', marginBottom: calWidth(8),
          paddingHorizontal: calWidth(16),
          paddingVertical: calWidth(8)
        }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: true ? "#fff" : '#fff' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  handlScroll = () => {
    // if (this.props.merchant.parsingFeature['Category_Scroll_Home']) {
    if (this.state.renderCategories.length != this.state.sub_categories.length && this.state.loaded == this.state.renderCategories.length)
      this.setState(prevState => ({
        canLoadMore: false,
        renderCategories: prevState.sub_categories.slice(0, prevState.renderCategories.length + 2)
      }))
    // }
  }

  render() {
    const { name_ar = "", name = "", _id: id } = this.props.cat || {}
    return (
      <View style={{ backgroundColor: Colors.mainColor3, flex: 1 }}>
        <Header
          title={context.isRTL() ? name_ar ? name_ar : name : name}
          componentId={this.props.componentId}
          hideBack={this.props.hideBack}
        />
        {this.renderSubCats()}
        {this.state.loading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color={Colors.mainColor2} />
          </View>
          : this.state.showVerticalList ?
            <VerticalItemsCarosel
              cat={this.props.cat}
              componentId={this.props.componentId}
              isOffer={this.props.isOffer}
            />
            :
            <ScrollView
              onScroll={this.handlScroll}
              refreshControl={
                <RefreshControl refreshing={this.state.isRefreshing}
                  onRefresh={() => {
                    this.setState({
                      isRefreshing: true,
                      sub_categories: [],
                      renderCategories: []
                    }, () => {
                      if (this.props.categories) {
                        this.setState({
                          sub_categories: this.props.categories.length ? [...this.props.categories] : [],
                          main_sub_categories: this.props.categories.length ? [...this.props.categories] : [],
                          loading: false,
                          isRefreshing: false,
                          showVerticalList: this.props.categories.length == 0,
                          renderCategories: (this.props.categories.length ? [...this.props.categories] : []).slice(0, 3)
                        })
                      } else {
                        this.getSubCats()
                      }
                    })
                  }}
                />
              }
            >
              {this.state.sub_categories.map(cat => this.renderSubCat(cat))}
              <View style={{ height: calWidth(80) }} />
            </ScrollView>}
      </View>
    );
  }
}

export default MenuSubCategoriesScreen;
