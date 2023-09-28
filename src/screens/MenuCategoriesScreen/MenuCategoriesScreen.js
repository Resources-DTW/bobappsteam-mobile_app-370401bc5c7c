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
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import Header from 'src/components/Header';
import MainContainer from 'src/components/MainContainer';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import { pop, push, screenIds } from 'src/navigation';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calHeight, calWidth } from 'src/utils/helpers';

class MenuCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isRefreshing: false
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }
  componentDidAppear() {
    if (this.props.hideBack)
      this.props.showHideFooterAction(true)
  }

  componentDidMount() {
    if (this.props.categories) {

      setTimeout(() => {
        this.setState({
          categories: this.props.categories.length % 2 == 0 ? this.props.categories : [...this.props.categories, { empty: true }]
        })
      }, 300);
    } else {
      this.props.getMenuCategories({ token: this.props.token })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.menuCategories.success != prevProps.menuCategories.success && this.props.menuCategories.success) {
      this.setState({
        categories: this.props.menuCategories.list.length % 2 == 0 ? this.props.menuCategories.list : [...this.props.menuCategories.list, { empty: true }],
        isRefreshing: false
      })
    }
  }

  renderCategory = ({ item, index }) => {
    if (item.empty) return (<View style={{ flex: 1, margin: calWidth(4), padding: calWidth(10) }} />)
    const { name_ar = "", name = "", _id = "", thumbnail = "" } = item || {}
    const { logo = "", splash_logo = "" } = this.props.merchant || {}
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (this.props.merchant?.parsingFeature['menu_categories']) {
            push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, { cat: item, isOffer: this.props.isOffer }, {}, null, false)
          }
          else if (this.props.merchant?.parsingFeature['menu_category_2']) {
            push(this.props.componentId, screenIds.MENU_SCREEN, { cat: item, isOffer: this.props.isOffer, showBack: true }, {}, null, false)
          }
          else if (this.props.merchant?.parsingFeature['category_slider_2']) {
            push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
              cat: {
                ...item
              },
              showFilter: true,
              isOffer: this.props.isOffer
            })
          }
          else {
            push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, { cat: item, isOffer: this.props.isOffer }, {}, null, false)
          }
        }}
        style={{
          flex: 1,
          margin: calWidth(4),
          backgroundColor: '#fff',
          borderRadius: calWidth(6),
          shadowColor: "#717171",
          shadowOpacity: 0.16,
          shadowRadius: 4,
          shadowOffset: {
            height: 2,
            width: 0
          },
          elevation: 2,
          padding: calWidth(10)
        }}>
        <View style={{ width: '100%', height: calWidth(140), marginBottom: calWidth(4) }}>
          <FastImage source={{ uri: thumbnail != "" ? thumbnail : splash_logo }} style={{
            width: '100%', height: '100%',
            borderRadius: calWidth(24)
          }} resizeMode={thumbnail != "" ? 'cover' : "contain"} />
        </View>
        <PoppinsRegular style={{ fontSize: calWidth(18), textAlign: 'center', color: '#2B2B2A' }}>{context.isRTL() ? name_ar ? name_ar : name : name}</PoppinsRegular>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.mainColor3 }}>
        <Header
          title={translations.get('categories').toUpperCase()}
          componentId={this.props.componentId}
          hideBack={this.props.hideBack}
        />

        <FlatList
          data={this.state.categories}
          renderItem={this.renderCategory}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: calWidth(12) }}
          ListFooterComponent={() => {
            return <View style={{ height: calWidth(80) }} />
          }}
          refreshControl={
            <RefreshControl refreshing={this.state.isRefreshing}
              onRefresh={() => {
                this.setState({
                  isRefreshing: true,
                  categories: []
                }, () => {
                  this.props.getMenuCategories({ token: this.props.token })
                })
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

export default MenuCategoriesScreen;
