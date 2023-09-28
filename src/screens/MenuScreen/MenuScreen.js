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
import MenuCategoriesScreen from '../MenuCategoriesScreen';
import EasyCard from 'src/components/EasyCard';
import { dimensionsCalculation } from '../ImageViewScreen/ImageViewScreen';
import CategoriesSection from 'src/components/CategoriesSection';
import CardTypeThree from 'src/components/CardTypeThree';

class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: 'normal',
      categories: [],
      selectedCat: props.cat?._id ? props.cat._id : 'all',
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
      lastPostion: 0,
      showFilter: true,
      subCats: [],
      selectedSubCat: '',
      subCat: null
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
    if (this.props.cat) {
      this.getBrands(1, this.props.cat._id, true, true);
      this.fetchData(this.props.cat._id);
    } else {
      this.props.getMenuCategories({ token: this.props.token })
      this.fetchData('all');
      this.getBrands();
    }
  }

  onLayout = (fource = false) => {
    if (Platform.OS == 'ios' && fource)
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }

  getBrands = async (page = 1, cat_id = null, subCat = false, levelOne = false) => {
    const response = await Api.getSubCatsCall({ token: this.props.token, page: page, cat_id: cat_id == 'all' ? null : cat_id });
    if (response && response.data && response.data.data) {
      if (levelOne) {
        this.setState({ categories: response.data.data.length ? [{ name: 'ALL', _id: this.props.cat?._id ? this.props.cat?._id : 'all', name_ar: 'الكل' }, ...response.data.data] : [] })
      } else {
        this.setState({
          brands: response.data.data,
          subCats: subCat && cat_id ? this.props.cat ? response.data.data.length ? [{ name: 'ALL', _id: 'all', name_ar: 'الكل' }, ...response.data.data] : response.data.data : response.data.data : [],
        })
      }
    }
  }
  _fetchData = (selectedCat, page = 1, subCat = null) => {
    if (this.props.cat)
      this.setState({ selectedCat: this.props.cat?._id && !subCat ? this.props.cat?._id : selectedCat, page: page, subCat: this.props.cat?._id && !subCat ? selectedCat : subCat }, () => {
        this.fetchData()
      })
    else {
      this.setState({ selectedCat: this.props.cat?._id && !subCat ? this.props.cat?._id : selectedCat, page: page, subCat: this.props.cat?._id && !subCat ? selectedCat : subCat }, () => {
        this.fetchData()
      })
    }
  }
  fetchData = async (selectedCat, page = 1, subCat = null) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsByCategoryCall({ id: this.state.selectedCat, sub_cat: this.state.subCat, token: this.props.token, page: page })
    if (response && response.data && response.data.data) {
      const newData = response.data.data
      if (this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3']) {
        if (newData.length % 2 == 1) {
          newData.push({ empty: true, hide: true })
        }
      }
      // this.onLayout()
      this.setState({
        list: page == 1 ? response.data.data : [
          ...this.state.list,
          ...newData
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
    if (this.props.menuCategories.success != prevProps.menuCategories.success && this.props.menuCategories.success) {

      this.setState({
        categories: this.props.merchant?.parsingFeature['category_page_2'] ? this.props.menuCategories.list : [{ name: 'ALL', _id: this.props.cat?._id ? this.props.cat?._id : 'all', name_ar: 'الكل' }, ...this.props.menuCategories.list]
      })
    }

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

          this.fetchData("any", this.state.page + 1)
        }
      }
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

  handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.y;
    if (Math.abs(contentOffset - this.state.lastPostion) > 50) {
      if (this.state.lastPostion < contentOffset && this.state.showFilter) {
        this.onLayout(true)
        this.setState({
          lastPostion: contentOffset,
          showFilter: this.state.list?.length > 2 ? false : true
        })
      } else if (!this.state.showFilter && contentOffset < this.state.lastPostion) {
        this.onLayout(true)
        this.setState({
          lastPostion: contentOffset,
          showFilter: true
        })
      }
      this.state.lastPostion = contentOffset
    }
    if (contentOffset < 100) {
      this.setState({
        showFilter: true
      })
    }
  }

  renderHeader = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: calHeight(16), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.shadeColor3 ? Colors.shadeColor3 : '#5C5C5C' }}>{translations.get('items').val()}</PoppinsSemiBold>
      {this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? null : <View style={{ flexDirection: 'row' }}>
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
            {this.state.container == 'normal' ? <FastImage source={require('assets/icons/normal_selected.png')} style={{ width: '100%', height: '100%', }} tintColor={Colors.mainColor1} resizeMode="contain" /> :
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
            {this.state.container == 'list' ? <FastImage source={require('assets/icons/list_selected.png')} style={{ width: '100%', height: '100%' }} tintColor={Colors.mainColor1} resizeMode="contain" /> :
              <FastImage source={require('assets/icons/list.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />}
          </View>
        </TouchableOpacity>
      </View>
      }
    </View>
  )

  renderCategories = () => {
    return <CategoriesSection
      categories={this.state.categories}
      subCats={this.state.subCats}
      selectedSubCat={this.state.selectedSubCat}
      showFilter={this.state.showFilter}
      fetchData={this._fetchData}
      selectedCat={(cat) => null}
      cat={this.props.cat}
    />
  }

  renderFilter = () => {
    if (this.props.merchant?.parsingFeature['sub_category_with_icons'])
      return (
        <View
          pointerEvents={'box-none'}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 555, justifyContent: 'center', bottom: this.state.showFilter ? 0 : -200 }}>
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

    return (
      <>
        <MainContainer search={this.props.hideBack} componentId={this.props.componentId} selected={2} cutHeader={true} showBack={this.props.hideBack ? false : true}>
          {this.renderCategories()}

          <FlatList
            style={{ backgroundColor: Colors.mainColor3 }}
            ListHeaderComponent={this.renderHeader}
            data={this.state.list}
            ListEmptyComponent={() => {
              if (this.state.isRefreshing) return null
              if (this.state.loading) {
                return (<View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                  <ActivityIndicator size="large" />
                </View>)
              }
              return <View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#5C5C5C', textAlign: 'center' }}>{translations.get('no_result').val()}</PoppinsSemiBold>
              </View>;
            }}
            renderItem={this.renderCard}
            showsVerticalScrollIndicator={false}
            key={this.state.container}
            keyExtractor={(item, index) => item._id + this.state.selectedCat + index}
            ListFooterComponent={() => {
              return <View style={{ height: calWidth(80) }} />
            }}
            refreshControl={
              <RefreshControl refreshing={this.state.isRefreshing}
                onRefresh={() => {
                  this.onLayout()
                  this.setState({
                    isRefreshing: true,
                    list: [],
                  }, () => {
                    this.fetchData("any", 1)
                  })
                }}
              />
            }
            onEndReached={this.fetchMore}
            onScroll={this.handleScroll}
            numColumns={this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? 2 : 1}
            contentContainerStyle={[this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? { paddingHorizontal: calWidth(12) } : {}]}
            // scrollEventThrottle={100}
            scrollEventThrottle={5}
          // bounces={false}
          />


        </MainContainer >
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

export default MenuScreen;
