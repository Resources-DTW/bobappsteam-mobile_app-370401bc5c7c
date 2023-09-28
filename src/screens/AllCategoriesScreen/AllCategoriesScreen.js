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
  RefreshControl,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import MainContainer from 'src/components/MainContainer';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import OrderHome from 'src/components/OrderHome';
import MainCard from 'src/components/MainCard';
import HorizontalCarosel from 'src/components/HorizontalCarosel';
import ListCard from 'src/components/ListCard';
import { Api } from 'src/services';
import { Navigation } from 'react-native-navigation'
import { showOverlay, screenIds, push } from 'src/navigation';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { PoppinsBold } from 'src/fonts/PoppinsBold';

class AllCategoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: 'normal',
      categories: [],
      selectedCat: 'all',
      loading: false,
      list: [],
      isRefreshing: false,
      statusBarHeight: 0,
      TopBarHeight: 0,
      page: 0,
      nextPage: 0,
      total_count: 0,
      isLoading: false,
      brands: [],
      selected: props.selected ? props.selected : 'brands',
      brandsList: []
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }
  componentDidAppear() {
    this.props.showHideFooterAction(true)
  }
  getConstants = async () => {
    const {
      statusBarHeight,
      TopBarHeight,
      BottomTabsHeight
    } = await Navigation.constants();
    this.setState({
      statusBarHeight: statusBarHeight,
      TopBarHeight: TopBarHeight
    })

  }
  componentDidMount() {
    this.getConstants()
    this.props.getMenuCategories({ token: this.props.token })
    this.getBrands();
  }
  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  getBrands = async (page = 1, cat_id = null) => {
    this.setState({ loading: true, isLoading: true })

    const response = await Api.getSubCatsCall({ token: this.props.token, page: page, cat_id: null });
    if (response && response.data && response.data.data) {
      const data = [...this.state.brandsList, ...response.data.data]
      this.setState({
        brands: data.length % 3 == 1 ? [...data, { empty: true }, { empty: true }] : data.length % 3 == 2 ? [...data, { empty: true }] : data,
        brandsList: data,
        loading: false,
        isRefreshing: false,
        page: page,
        nextPage: page + 1,
        total_count: response.data.total_count,
        isLoading: false
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.menuCategories.success != prevProps.menuCategories.success && this.props.menuCategories.success) {
      const data = this.props.menuCategories.list;
      this.setState({
        categories: data.length % 3 == 1 ? [...data, { empty: true }, { empty: true }] : data.length % 3 == 2 ? [...data, { empty: true }] : data,
      })
    }

  }


  renderBrand = ({ item, index }) => {
    if (item.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(8) : 0, }} />)
    const { logo = "", splash_logo = "" } = this.props.merchant || {}
    const { thumbnail = "", name_ar = "", name = "", _id = "" } = item || {}
    return (
      <TouchableOpacity
        onPress={() => {
          push(this.props.componentId,
            screenIds.CATEGORY_SCREEN, {
            cat: {
              _id: 'all',
              sub_cat: _id,
              name,
              name_ar
            }
          })

        }}
        activeOpacity={1}
        style={{ flex: 1, marginBottom: calWidth(24), marginHorizontal: index % 3 == 1 ? calWidth(8) : 0 }}>
        <View style={{
          width: '100%', height: calWidth(55), borderRadius: calWidth(10), backgroundColor: '#F6F6F6', marginBottom: calWidth(8), padding: calWidth(4),
          shadowColor: "#000",
          shadowOpacity: 0.16,
          shadowRadius: 3,
          shadowOffset: {
            height: 1,
            width: 0
          },
          elevation: 2,
        }}>
          <FastImage source={{ uri: thumbnail != "" ? thumbnail : splash_logo }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
        </View>

        <PoppinsSemiBold style={{ fontSize: calWidth(12), color: '#505050', textAlign: 'center' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity >
    )
  }

  renderCategory = ({ item, index }) => {
    if (item.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id = "" } = item || {}
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
            cat: {
              ...item
            },
            showFilter: true
          })
        }}
        style={{ flex: 1, height: calWidth(57), backgroundColor: Colors.mainColor1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, marginBottom: calWidth(20), borderRadius: calWidth(5), justifyContent: 'center', alignItems: 'center' }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: '#FFFFFF' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  renderCategoryWithImgae = ({ item: cat, index }) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id = "", thumbnail = "" } = cat || {}
    const { logo = "", splash_logo = "" } = this.props.merchant || {}

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
            cat: {
              ...cat
            },
            showFilter: true
          })
        }}
        style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, marginBottom: calWidth(12), borderRadius: calWidth(5), justifyContent: 'flex-start', alignItems: 'center', marginVertical: calWidth(16), }}>
        <View style={{
          width: '100%',
          height: calWidth(84),
          backgroundColor: '#fff',
          shadowColor: "#979797",
          shadowOpacity: 0.16,
          shadowRadius: 6,
          shadowOffset: {
            height: 4,
            width: 0
          },
          elevation: 2,
          borderRadius: calWidth(24),
          marginBottom: calWidth(6),
          justifyContent: 'flex-start',
          // backgroundColor: 'red'
        }}>
          <FastImage source={{ uri: thumbnail != "" ? thumbnail : splash_logo }} style={{
            width: '100%', height: '100%',
            borderRadius: calWidth(24)
          }} resizeMode={thumbnail != "" ? 'cover' : "contain"} />
        </View>
        <PoppinsSemiBold numberOfLines={2} style={{ fontSize: calWidth(12), textAlign: 'center', color: '#232323', }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }
  renderItem = ({ item, index }) => {
    if (this.state.selected == 'brands') {
      return this.renderBrand({ item, index })
    } else {
      return this.renderCategoryWithImgae({ item, index })
    }
  }

  fetchMore = () => {
    if (this.state.selected == 'brands') {
      if (!this.state.isLoading) {
        if (this.state.page < this.state.nextPage) {
          if (this.state?.brandsList?.length < this.state.total_count) {
            this.getBrands(this.state.page + 1)
          }
        }
      }
    }
  }

  render() {
    return (
      <MainContainer search={true} componentId={this.props.componentId} selected={2} showBack={true}>
        <View style={[Platform.OS == 'android' ? { width: '100%', backgroundColor: Colors.mainColor3, marginTop: -calWidth(24) } : { zIndex: 233, top: calWidth(90 + this.state.statusBarHeight), position: 'absolute', width: '100%', backgroundColor: 'transparent' }]}>
          <View style={{ width: '100%', height: calWidth(32), backgroundColor: Colors.mainColor3, position: 'absolute' }}></View>
          <View style={{ flexDirection: 'row', paddingHorizontal: calWidth(10) }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.state.selected !== 'brands') {
                  this.onLayout()
                  this.setState({
                    selected: 'brands'
                  })
                }
              }}
              style={{ flex: 1, height: calWidth(35), justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(5), marginRight: calWidth(2), backgroundColor: this.state.selected == 'brands' ? '#40403D' : '#C5C5C5', }}>
              <PoppinsBold style={{ fontSize: calWidth(11), color: this.state.selected == 'brands' ? '#fff' : '#40403D' }}>{translations.get('all_brands').val()}</PoppinsBold>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.state.selected != 'cats') {
                  this.onLayout()
                  this.setState({
                    selected: 'cats'
                  })
                }
              }}
              style={{ flex: 1, height: calWidth(35), justifyContent: 'center', alignItems: 'center', borderRadius: calWidth(5), marginLeft: calWidth(2), backgroundColor: this.state.selected == 'cats' ? '#40403D' : '#C5C5C5', }}>
              <PoppinsBold style={{ fontSize: calWidth(11), color: this.state.selected == 'cats' ? '#fff' : '#40403D' }}>{translations.get('all_cats').val()}</PoppinsBold>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          style={{ backgroundColor: Colors.mainColor3, paddingTop: calWidth(22) }}
          contentContainerStyle={{ paddingHorizontal: calWidth(22) }}
          data={this.state.selected == 'brands' ? this.state.brands : this.state.categories}
          renderItem={this.renderItem}
          numColumns={3}
          ListFooterComponent={() => {
            return <View style={{ height: calWidth(80) }} />
          }}
          keyExtractor={(item) => item._id + "jjjj"}
          onEndReached={this.fetchMore}
        />


      </MainContainer >

    );
  }
}

export default AllCategoriesScreen;
