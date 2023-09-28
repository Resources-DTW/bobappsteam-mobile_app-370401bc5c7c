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
import { showOverlay, screenIds, pop, push } from 'src/navigation';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { Container } from 'native-base';
import EasyCard from 'src/components/EasyCard';
import CardTypeThree from 'src/components/CardTypeThree';
import CategoriesSection from 'src/components/CategoriesSection';
class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: 'normal',
      categories: [],
      loading: false,
      list: [],
      isRefreshing: false,
      page: 0,
      nextPage: 0,
      total_count: 0,
      isLoading: false,
      brands: [],
      subCats: [],
      selectedCat: props.cat._id,
      subCat: null,
    }
  }
  componentDidMount() {
    this.fetchData(this.state.selectedCat);
    if (this.props.showFilter)
      this.getBrands(1, this.state.selectedCat);
  }
  getBrands = async (page = 1, cat_id = null) => {
    const response = await Api.getSubCatsCall({ token: this.props.token, page: page, cat_id: cat_id == 'all' ? null : cat_id });
    if (response && response.data && response.data.data) {
      this.setState({
        brands: response.data.data,
        subCats: response.data.data
      })
    }
  }
  renderBrand = ({ item, index }) => {
    const { logo = "", splash_logo = "" } = this.props.merchant || {}

    const { thumbnail = "", name_ar = "", name = "", _id = "" } = item || {}
    return (
      <TouchableOpacity
        onPress={() => {
          push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
            cat: {
              _id: this.state.selectedCat,
              sub_cat: _id,
              name, name_ar
            }
          })

        }}
        activeOpacity={1}
        style={{ marginLeft: index == 0 ? calWidth(20) : calWidth(6), marginRight: this.state.brands.length - 1 == index ? calWidth(20) : 0 }}>
        <View style={{ width: calWidth(98), height: calWidth(46), borderRadius: calWidth(10), backgroundColor: '#FFFFFF', marginBottom: calWidth(4), padding: calWidth(4) }}>
          <FastImage source={{ uri: thumbnail != "" ? thumbnail : splash_logo }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
        </View>

        <PoppinsSemiBold style={{ fontSize: calWidth(9), color: '#fff', textAlign: 'center' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }
  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }

  _fetchData = (selectedCat, page = 1, subCat = null) => {
    this.setState({ selectedCat: selectedCat, page: page, subCat: subCat }, () => {
      this.fetchData()
    })
  }

  fetchData = async (selectedCat, page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsByCategoryCall({ id: this.state.selectedCat, sub_cat: this.state.subCat, token: this.props.token, page: page, })
    if (response && response.data && response.data.data) {
      this.onLayout()
      this.setState({
        list: page == 1 ? response.data.data : [
          ...this.state.list,
          ...response.data.data
        ],
        loading: false,
        isRefreshing: false,
        page: page,
        nextPage: page + 1,
        total_count: response.data.total_count,
        isLoading: false
      })
    } else {
      this.onLayout()
      this.setState({
        loading: false,
        isRefreshing: false,
        isLoading: false
      })
    }
  }

  componentDidUpdate(prevProps) {

  }

  renderCard = ({ item }) => {
    if (this.props.merchant?.parsingFeature['item_card_3']) {
      return <CardTypeThree componentId={this.props.componentId} item={item} flex={true} margin={true} />
    }
    else if (this.props.merchant?.parsingFeature['item_card_2']) {
      return <EasyCard componentId={this.props.componentId} item={item} flex={true} margin={true} />
    } else {
      if (this.state.container == 'normal')
        return <MainCard componentId={this.props.componentId} item={item} />
      else
        return <ListCard componentId={this.props.componentId} item={item} />
    }
  }
  fetchMore = () => {
    if (!this.state.isLoading) {
      if (this.state.page < this.state.nextPage) {
        if (this.state?.list?.length < this.state.total_count) {
          this.fetchData('any', this.state.page + 1)
        }
      }
    }
  }

  renderSubCats = () => {
    if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
      return (
        <CategoriesSection
          categories={[]}
          subCats={[]}
          fetchData={this._fetchData}
          selectedCat={(cat) => null}
          cat={this.props.cat}
          style={{ paddingTop: calWidth(12), backgroundColor: Colors.mainColor3 }}
        />
      )
    }
    return null;
  }

  renderFilter = () => {
    if (this.props.merchant?.parsingFeature['sub_category_with_icons'])
      return (
        <View
          pointerEvents={'box-none'}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 555, justifyContent: 'center', bottom: this.props.showFilter ? -100 : -200 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.onLayout()
              this.setState({
                open: !this.state.open
              })
            }} style={{
              position: 'absolute', bottom: calWidth(64) + 60,
              width: this.state.open ? calWidth(332) : calWidth(160),
              height: this.state.open ? calWidth(130) : calWidth(44),
              borderRadius: calWidth(13),
              alignSelf: 'center',
              shadowColor: "#000",
              shadowOpacity: 0.16,
              shadowRadius: 6,
              shadowOffset: {
                height: 3,
                width: 0
              },
              elevation: 2,

            }}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              colors={['#40403D', '#0D0D0C']}
              style={{
                position: 'absolute',
                flex: 1,
                // opacity: 0.24,
                zIndex: 1,
                width: '100%',
                height: '100%',
                borderRadius: calWidth(13),
                paddingHorizontal: this.state.open ? 0 : calWidth(30),
              }}>
              {this.state.open ? <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: calWidth(10) }}>
                  <View style={{ width: calWidth(98), borderBottomColor: '#FED001', borderBottomWidth: 0.65, justifyContent: 'center', alignItems: 'center', paddingBottom: calWidth(2) }}>

                    <PoppinsSemiBold style={{ fontSize: calWidth(17), color: '#fff' }}>{translations.get('filter').val()}</PoppinsSemiBold>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {}, {}, '', false)}
                    style={{ width: calWidth(98), borderBottomColor: '#FED001', borderBottomWidth: 0.65, justifyContent: 'center', alignItems: 'center', paddingBottom: calWidth(2) }}>

                    <PoppinsSemiBold style={{ fontSize: calWidth(17), color: '#fff' }}>{translations.get('view_all').val()}</PoppinsSemiBold>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={this.state.brands}
                  renderItem={this.renderBrand}
                  keyExtractor={(item, index) => index + "sss"}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}

                />
              </View> :
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1
                  }}>
                  <PoppinsSemiBold style={{ fontSize: calWidth(17), color: '#fff' }}>{translations.get('filter').val()}</PoppinsSemiBold>
                  <Image source={require('assets/icons/tune-24px.png')} />
                </View>
              }

            </LinearGradient>
          </TouchableOpacity>
        </View>
      )

    return null;
  }

  render() {
    const { list = [] } = this.state
    const { name = "", name_ar = "" } = this.props.cat || {}
    return (
      <>
        <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
          <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
            <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
              <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
            </TouchableOpacity>
            <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
          </View>
          {this.renderSubCats()}
          <FlatList
            style={{ backgroundColor: Colors.mainColor3 }}
            ListHeaderComponent={() => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: calHeight(24), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.shadeColor3 ? Colors.shadeColor3 : '#5C5C5C' }}>{translations.get('items').val()}</PoppinsSemiBold>
                {this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ marginHorizontal: calWidth(10) }}
                    onPress={() => {
                      if (this.state.container != "normal") {
                        this.onLayout()
                        this.setState({
                          container: 'normal'
                        })
                      }
                    }}>
                    <View style={{ width: calWidth(24), height: calWidth(24) }}>
                      {this.state.container == 'normal' ? <FastImage source={require('assets/icons/normal_selected.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" tintColor={Colors.mainColor1} /> :
                        <FastImage source={require('assets/icons/normal.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    if (this.state.container != "list") {
                      this.onLayout()
                      this.setState({
                        container: 'list'
                      })
                    }

                  }}>
                    <View style={{ width: calWidth(24), height: calWidth(24) }}>
                      {this.state.container == 'list' ? <FastImage source={require('assets/icons/list_selected.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" tintColor={Colors.mainColor1} /> :
                        <FastImage source={require('assets/icons/list.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />}
                    </View>
                  </TouchableOpacity>
                </View> : null
                }
              </View>
            )
            }
            data={this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? this.state.list.length % 2 == 0 ? this.state.list : [...this.state.list, { empty: true, hide: true }] : this.state.list}
            ListEmptyComponent={() => {
              if (this.state.isRefreshing) return null
              if (this.state.loading) {
                return (<View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                  <ActivityIndicator size="large" />
                </View>)
              }
              return <View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#5C5C5C', textAlign: 'center' }}>{translations.get('no_offers').val()}</PoppinsSemiBold>
              </View>;
            }}
            ListFooterComponent={() => <View style={{ height: calWidth(40) }} />}
            renderItem={this.renderCard}
            showsVerticalScrollIndicator={false}
            key={this.state.container}
            keyExtractor={(item, index) => item._id + index}
            refreshControl={
              <RefreshControl refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.onLayout()
                  this.setState({
                    isRefreshing: true,
                    list: []
                  }, () => {
                    this.fetchData('any')
                  })
                }}
              />
            }
            onEndReached={this.fetchMore}
            numColumns={this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? 2 : 1}
            contentContainerStyle={[this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? { paddingHorizontal: calWidth(12) } : {}]}

          />

        </View >
        {this.state.open && <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.onLayout()
            this.setState({ open: false })
          }} style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 444, backgroundColor: 'rgba(0,0,0,0.2)', }}></TouchableOpacity>}
        {this.renderFilter()}
      </>
    );
  }
}

export default CategoryScreen;
