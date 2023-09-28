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
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight, showToastItemSuccess } from 'src/utils/helpers';
import MainContainer from 'src/components/MainContainer';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import OrderHome from 'src/components/OrderHome';
import MainCard from 'src/components/MainCard';
import HorizontalCarosel from 'src/components/HorizontalCarosel';
import { Api } from 'src/services';
import { screenIds, dismissOverlay, showOverlay, push, showModal, popToRoot } from 'src/navigation';
import { Navigation } from 'react-native-navigation'
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import translations from 'src/localization/Translations';
import { Container } from 'native-base';
import firebase from 'react-native-firebase'
import context from 'src/utils/context';
import HomeSlider from 'src/components/HomeSlider';
import HorizontalItemsCarosel from 'src/components/HorizontalItemsCarosel';
import Toast from 'react-native-simple-toast';
import config from 'src/config';

class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      list: [],
      categories: [],
      selectedCat: {},
      statusBarHeight: 0,
      TopBarHeight: 0,
      slice1: [],
      slice2: [],
      brands: [],
      renderCategories: [],
      loaded: 0,
      clickcount: 0
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }
  componentDidAppear() {
    this.props.showHideFooterAction(true);
    if (Platform.OS == 'android')
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentDidDisappear() {
    if (Platform.OS == 'android')
      this.backHandler && this.backHandler.remove()
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

  componentDidUpdate(prevProps) {
    if (this.props.menuCategories.success != prevProps.menuCategories.success && this.props.menuCategories.success) {
      const cats = this.props.menuCategories.list || [];
      const slice1 = cats.slice(0, parseInt(cats.length / 2))
      const slice2 = cats.slice(parseInt(cats.length / 2), cats.length)
      this.setState({
        categories: cats.length <= 2 ? [...cats, { empty: true, empty: true }] : [...cats],
        slice1: slice1.length <= 2 ? [...slice1, { empty: true, empty: true }] : [...slice1],
        slice2: slice2.length <= 2 ? [...slice2, { empty: true, empty: true }] : [...slice2],
        renderCategories: []
      }, () => {
        if (this.props.merchant.parsingFeature['Category_Scroll_Home']) {
          if (this.state.renderCategories.length != this.state.categories.length && this.state.loaded == this.state.renderCategories.length)
            this.setState(prevState => ({
              canLoadMore: false,
              renderCategories: prevState.categories.slice(0, prevState.renderCategories.length + 2)
            }))
        }
      })

    }
  }

  componentDidMount() {
    // dismissOverlay(screenIds.TOAST_MODAL)
    // showOverlay(screenIds.TOAST_MODAL)
    this.getConstants()
    if (this.props.menuCategories && this.props.menuCategories.list && this.props.menuCategories.list.length) {
      const cats = this.props.menuCategories.list || [];
      const slice1 = cats.slice(0, parseInt(cats.length / 2))
      const slice2 = cats.slice(parseInt(cats.length / 2), cats.length)
      this.setState({
        categories: cats.length <= 2 ? [...cats, { empty: true, empty: true }] : [...cats],
        slice1: slice1.length <= 2 ? [...slice1, { empty: true, empty: true }] : [...slice1],
        slice2: slice2.length <= 2 ? [...slice2, { empty: true, empty: true }] : [...slice2],
        renderCategories: []
      }, () => {
        if (this.props.merchant.parsingFeature['Category_Scroll_Home']) {
          if (this.state.renderCategories.length != this.state.categories.length && this.state.loaded == this.state.renderCategories.length)
            this.setState(prevState => ({
              canLoadMore: false,
              renderCategories: prevState.categories.slice(0, prevState.renderCategories.length + 2)
            }))
        }
      })
    }
    dismissOverlay(screenIds.CUSTOM_FOOTER)
    showOverlay(screenIds.CUSTOM_FOOTER)
    this.fetchData()

    const channel = new firebase.notifications.Android.Channel('fresh-channel', 'Aljunaidi Fresh Channel', firebase.notifications.Android.Importance.High)
      .setDescription('Aljunaidi Fresh channel');
    firebase.notifications().android.createChannel(channel);

    this.checkPermission()
    this.createNotificationListeners(); //add this line
    this.props.getNotification({ token: this.props.token })
    if (this.props.merchant?.parsingFeature['Sub_Category_Slider_Home']) {
      this.getBrands()
    }
  }

  handleBackButton = () => {
    if (this.props.merchant?.parsingFeature['exit_popup']) {
      this.setState({ 'clickcount': this.state.clickcount + 1 })
      this.check();
      return true;
    } else {
      return false;
    }
  }

  check = () => {
    if (this.state.clickcount < 2) {
      Toast.show(`Press back again to exit App `, 2000);
      setTimeout(() => {
        this.setState({ clickcount: 0 })
      }, 2000);
    }
    else if (this.state.clickcount == 2) {
      BackHandler.exitApp()
    }
  }
  getBrands = async (page = 1, cat_id = null, subCat = false) => {
    const response = await Api.getSubCatsCall({ token: this.props.token, page: 1, cat_id: null });
    if (response && response.data && response.data.data) {
      this.setState({
        brands: response.data.data,
        // subCats: subCat && cat_id ? response.data.data : []
      })
    }
  }
  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    dismissOverlay(screenIds.CUSTOM_FOOTER);

  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      const response = await Api.subscribeToNotificationsCall({
        registration_token: fcmToken,
        token: this.props.token
      })
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      this.props.getNotification({ token: this.props.token })
      // alert('onNotification' + notification.data)
      // alert(JSON.stringify(notification.data))
      const { title, body } = notification;
      if (Platform.OS === 'android') {
        // alert(notification.notificationId + "id" + notification.title + 'title' + notification.subtitle + 'subtitle' + notification.body)
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          // show_in_foreground: true,
        })
          .setNotificationId("notificationId")
          .setTitle(notification.title)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('fresh-channel')
          .android.setSmallIcon('ic_launcher');
        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => alert(err));

      } else if (Platform.OS === 'ios') {

        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
        // .ios.setBadge(notification.ios.badge);
        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      }

      // this.showAlert(title, body);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.props.getNotification({ token: this.props.token })

      const { title, body, data } = notificationOpen.notification || {};
      const { data: ItemData = {} } = data || {}
      if (ItemData != "") {
        const pareData = JSON.parse(ItemData)
        const { _id = "" } = pareData || {}
        if (_id != "") {
          this.props.changeSelectedMenu({ index: 3 })
          popToRoot(screenIds.MY_ORDER_SCREEN);
          push(screenIds.MY_ORDER_SCREEN, screenIds.ORDER_DETAILS_SCREEN, { id: _id })
        }
      }

    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.props.getNotification({ token: this.props.token })

      const { title, body, data } = notificationOpen.notification || {};
      const { _id = "" } = data || {}
      if (_id != "") {
        this.props.changeSelectedMenu({ index: 4 })
        popToRoot(screenIds.MY_ORDER_SCREEN);
        push(this.props.componentId, screenIds.ORDER_DETAILS_SCREEN, { id: _id })
      }
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      this.props.getNotification({ token: this.props.token })

      //process data message
    });
  }



  fetchData = async (selectedCat) => {
    this.setState({ loading: true })
    const response = await Api.getItemsCall({ token: this.props.token, })
    if (response && response.data && response.data.data) {
      this.setState({
        list: response.data.data,
        loading: false,
        refreshing: false
      })
    } else {
      this.setState({
        loading: false,
        refreshing: false
      })
    }
  }

  onRefresh = () => {
    this.setState({
      refreshing: true,
      list: []
    })
    this.fetchData()
  }

  renderCat = (cat, index) => {
    if (cat.empty) {
      return (<View style={{ minWidth: calWidth(68), height: calWidth(54), }} />)
    }
    const { name = "", _id: id, name_ar = "" } = cat || {}
    return (<TouchableOpacity
      key={id}
      onPress={() => {
        push(this.props.componentId, screenIds.CATEGORY_SCREEN, { cat: cat, showFilter: true })
        // this.props.goToCategory({ cat: cat })
      }}
      style={{
        minWidth: calWidth(68),
        backgroundColor: this.state.selectedCat[id] ? Colors.mainColor1 : '#fff',
        height: calWidth(54),
        marginLeft: index == 0 ? calWidth(24) : calWidth(8),
        marginRight: this.state.categories.length - 1 == index ? calWidth(24) : calWidth(8),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: calWidth(12),
        borderRadius: calWidth(10),
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowRadius: 16,
        shadowOffset: {
          height: 0,
          width: 0
        },
        elevation: 2,
        marginVertical: calWidth(16)
      }}>
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: this.state.selectedCat[id] ? "#fff" : Colors.mainColor2 }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
    </TouchableOpacity>)
  }

  renderCategory = (cat, index) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id = "" } = cat || {}
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (this.props.merchant?.parsingFeature['menu_category_2']) {
            push(this.props.componentId, screenIds.MENU_SCREEN, { cat: cat, isOffer: this.props.isOffer, showBack: true }, {}, null, false)
          } else {

            push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
              cat: {
                ...cat
              },
              showFilter: true
            })
          }
        }}
        style={{ width: calWidth(120), height: calWidth(57), backgroundColor: Colors.mainColor1, marginLeft: calWidth(16), marginRight: index == this.state.categories.length - 1 ? calWidth(16) : 0, borderRadius: calWidth(5), justifyContent: 'center', alignItems: 'center', marginBottom: calWidth(16), paddingHorizontal: calWidth(8) }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: '#FFFFFF' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  renderCategoryWithImgae = (cat, index, styleOnly = false) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id = "", thumbnail = "" } = cat || {}
    const { logo = "", splash_logo = "" } = this.props.merchant || {}

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (this.props.merchant?.parsingFeature['menu_categories']) {
            push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, {
              cat: {
                ...cat
              },
            }, {}, null, false)
          }
          else if (this.props.merchant?.parsingFeature['menu_category_2']) {
            push(this.props.componentId, screenIds.MENU_SCREEN, { cat: cat, isOffer: this.props.isOffer, showBack: true }, {}, null, false)
          }
          else if (styleOnly) {
            push(this.props.componentId, screenIds.CATEGORY_SCREEN, {
              cat: {
                ...cat
              },
              showFilter: true
            })
          } else {
            push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, {
              cat: {
                ...cat
              },
            }, {}, null, false)
          }
        }}
        style={{ width: calWidth(122), marginLeft: index == 0 ? calWidth(16) : calWidth(8), marginRight: index == this.state.categories.length - 1 ? calWidth(16) : 0, borderRadius: calWidth(5), justifyContent: 'flex-start', alignItems: 'center', marginVertical: calWidth(16), }}>
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
  renderCategories = () => {

    if (this.props.merchant?.parsingFeature['home_hide_category_slider']) return null
    if (this.props.merchant?.parsingFeature['category_view_1']) {
      return (
        <View style={{ paddingTop: calHeight(16) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <View style={[{ paddingHorizontal: calWidth(24), paddingVertical: calWidth(8), borderRadius: calWidth(13), left: -13 },
            this.props.merchant?.parsingFeature['inbox_home_color'] ? { backgroundColor: Colors.mainColor1 } : {}]}>
              <PoppinsSemiBold style={[{ fontSize: calWidth(16) }, this.props.merchant?.parsingFeature['inbox_home_color'] ? { color: Colors.mainColor3 } : { color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C' }]}>{translations.get('categories').val()}</PoppinsSemiBold>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={{ paddingHorizontal: calWidth(24) }}
              onPress={() => {

                if (this.props.merchant?.parsingFeature['category_slider_2']) {
                  push(this.props.componentId, screenIds.MENU_CATEGORIES_SCREEN, {
                    categories: this.state.categories,
                  },
                    {},
                    '',
                    false
                  )
                } else if (this.props.merchant?.parsingFeature['sub_category_with_icons']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, { selected: 'cats' }, {}, '', false)
                }
                else if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                } else {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                }
              }}
            >
              <PoppinsSemiBold style={{ color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#707070', fontSize: calWidth(14), marginBottom: calHeight(10), }}>{translations.get('view_all').val()}</PoppinsSemiBold>

            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
          >
            {this.state.categories.map((cat, index) => {
              if (this.props.merchant?.parsingFeature['category_slider_2'])
                return this.renderCategoryWithImgae(cat, index, true)
              else
                return this.renderCategory(cat, index)
            })}
          </ScrollView>
        </View >
      )
    } else if (this.props.merchant?.parsingFeature['category_page_2']) {
      return (
        <View style={{ paddingTop: calHeight(16) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <View style={[{ paddingHorizontal: calWidth(24), paddingVertical: calWidth(8), borderRadius: calWidth(13), left: -13 },
            this.props.merchant?.parsingFeature['inbox_home_color'] ? { backgroundColor: Colors.mainColor1 } : {}]}>
              <PoppinsSemiBold style={[{ fontSize: calWidth(16) }, this.props.merchant?.parsingFeature['inbox_home_color'] ? { color: Colors.mainColor3 } : { color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C' }]}>{translations.get('categories').val()}</PoppinsSemiBold>
            </View>
            <TouchableOpacity
              style={{ paddingHorizontal: calWidth(24) }}
              activeOpacity={1}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['category_slider_2']) {
                  push(this.props.componentId, screenIds.MENU_CATEGORIES_SCREEN, {
                    categories: this.state.categories,
                  },
                    {},
                    '',
                    false
                  )
                } else
                  if (this.props.merchant?.parsingFeature['sub_category_with_icons']) {
                    push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, { selected: 'cats' }, {}, '', false)
                  } else {
                    push(this.props.componentId, screenIds.MENU_CATEGORIES_SCREEN, {
                      categories: this.state.categories,
                    },
                      {},
                      '',
                      false
                    )
                  }
              }}
            >
              <PoppinsSemiBold style={{ color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#707070', fontSize: calWidth(14), }}>{translations.get('view_all').val()}</PoppinsSemiBold>

            </TouchableOpacity>
          </View>
          {config.twoCats ? <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            >
              {this.state.slice1.map((cat, index) => this.renderCategoryWithImgae(cat, index))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            >
              {this.state.slice2.map((cat, index) => this.renderCategoryWithImgae(cat, index))}
            </ScrollView>
          </> :
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            >
              {this.state.categories.map((cat, index) => this.renderCategoryWithImgae(cat, index, this.props.merchant?.parsingFeature['category_slider_2']))}
            </ScrollView>}
        </View >
      )
    }
    else {
      return (
        <View style={{ paddingTop: calHeight(16) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <View style={[{ paddingHorizontal: calWidth(24), paddingVertical: calWidth(8), borderRadius: calWidth(13), left: -13 },
            this.props.merchant?.parsingFeature['inbox_home_color'] ? { backgroundColor: Colors.mainColor1 } : {}]}>
              <PoppinsSemiBold style={[{ fontSize: calWidth(16) }, this.props.merchant?.parsingFeature['inbox_home_color'] ? { color: Colors.mainColor3 } : { color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#5C5C5C' }]}>{translations.get('categories').val()}</PoppinsSemiBold>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={{ paddingHorizontal: calWidth(24) }}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['category_slider_2']) {
                  push(this.props.componentId, screenIds.MENU_CATEGORIES_SCREEN, {
                    categories: this.state.categories,
                  },
                    {},
                    '',
                    false
                  )
                } else if (this.props.merchant?.parsingFeature['sub_category_with_icons']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, { selected: 'cats' }, {}, '', false)
                }
                else if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                } else {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                }
              }}
            >
              <PoppinsSemiBold style={{ color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#707070', fontSize: calWidth(14), marginBottom: calHeight(10), }}>{translations.get('view_all').val()}</PoppinsSemiBold>

            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
          >
            {this.state.categories.map((cat, index) => {
              if (this.props.merchant?.parsingFeature['category_slider_2'])
                return this.renderCategoryWithImgae(cat, index, true)
              else
                return this.renderCat(cat, index)
            })}
          </ScrollView>
        </View >
      )
    }
  }


  renderSubCats = () => {
    if (this.props.merchant?.parsingFeature['Sub_Category_Slider_Home']) {
      if (this.state.brands.length == 0) return null
      return (
        <View style={{ paddingTop: calHeight(16) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: calWidth(24) }}>
            <PoppinsSemiBold style={{ color: '#5C5C5C', fontSize: calWidth(16), marginBottom: calHeight(10) }}>{translations.get('brands').val()}</PoppinsSemiBold>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['sub_category_with_icons']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, { selected: 'brands' }, {}, '', false)
                }
                else if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                } else {
                  showModal(screenIds.FILTER_SCREEN, { showCats: true, categories: this.state.categories, goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                }
              }}
            >
              <PoppinsSemiBold style={{ color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#707070', fontSize: calWidth(14), marginBottom: calHeight(10), }}>{translations.get('view_all').val()}</PoppinsSemiBold>

            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
          >
            {this.state.brands.map((item, index) => this.renderBrand({ item, index }))}
          </ScrollView>
        </View >
      )
    }
  }

  renderBrand = ({ item, index }) => {
    // if (item.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(8) : 0, }} />)
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
        style={{ width: calWidth(94), marginLeft: index == 0 ? calWidth(16) : calWidth(8), marginRight: index == this.state.categories.length - 1 ? calWidth(16) : 0, }}>
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
  renderSearchTypeOne = () => {
    return (
      <View style={[Platform.OS == 'android' ? { width: '100%', backgroundColor: Colors.mainColor3, marginTop: -calWidth(24) } : { zIndex: 23232, top: calWidth(70 + this.state.statusBarHeight), position: 'absolute', width: '100%', backgroundColor: 'transparent' }]}>
        <View style={{ height: calWidth(48), width: '100%', paddingHorizontal: calWidth(24), zIndex: 23232 }}>
          <View style={{
            flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: {
              height: 0,
              width: 0
            },
            elevation: 2,
            borderRadius: calWidth(10),

          }}>
            <TouchableOpacity
              onPress={() => {
                push(this.props.componentId, screenIds.SEARCH_SCREEN)
              }}
              activeOpacity={1}
              style={{
                borderTopLeftRadius: calWidth(10),
                borderBottomLeftRadius: calWidth(10),
                height: '100%', flex: 1, backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: calWidth(16), alignItems: 'center'
              }}>
              <Image source={require('assets/icons/search.png')} />
              <PoppinsRegular style={{ marginLeft: calWidth(8), color: '#919191', fontSize: calWidth(16) }}>{translations.get('search_here').val()}</PoppinsRegular>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                  showModal(screenIds.FILTER_SCREEN, { goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                } else if (this.props.merchant?.parsingFeature['brands']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {
                  })
                } else {
                  showModal(screenIds.FILTER_SCREEN, { goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
                }
              }}
              style={{
                height: '100%', width: calWidth(48), backgroundColor: Colors.mainColor1,
                borderTopRightRadius: calWidth(10),
                borderBottomRightRadius: calWidth(10),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Image source={require('assets/icons/filter.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

    )
  }

  renderSearchTypeTwo = () => {
    return (
      <View style={[Platform.OS == 'android' ? { width: '100%', backgroundColor: Colors.mainColor3, marginTop: -calWidth(24) } : { zIndex: 23232, top: calWidth(70 + this.state.statusBarHeight), position: 'absolute', width: '100%', backgroundColor: Colors.mainColor3 },]}>
        <View style={{ height: calWidth(42), width: '100%', paddingHorizontal: calWidth(24), zIndex: 23232, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            flex: 1,
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: "#000",
            shadowOpacity: 0.07,
            shadowRadius: 10,
            shadowOffset: {
              height: 0,
              width: 0
            },
            elevation: 0,
            borderRadius: calWidth(20),

          }}>
            <TouchableOpacity
              onPress={() => {
                push(this.props.componentId, screenIds.SEARCH_SCREEN)
              }}
              activeOpacity={1}
              style={{
                // borderTopLeftRadius: calWidth(10),
                // borderBottomLeftRadius: calWidth(10),
                height: '100%', flex: 1, backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: calWidth(12), alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: calWidth(20),
              }}>
              <PoppinsRegular style={{ marginLeft: calWidth(8), color: 'rgba(43,43,43,0.7)', fontSize: calWidth(16) }}>{translations.get('search_products').val()}</PoppinsRegular>
              <Image source={require('assets/icons/magnifying-glass.png')} />
            </TouchableOpacity>

          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (this.props.merchant?.parsingFeature['brands']) {
                push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {
                })
              } else {
                showModal(screenIds.FILTER_SCREEN, { goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
              }
            }}
            style={{
              height: '100%',
              width: calWidth(42),
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginLeft: calWidth(16)
            }}>
            <Image source={require('assets/icons/filter_1.png')} style={{ tintColor: Colors.mainColor1 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderSearch = () => {
    if (this.props.merchant?.parsingFeature['search_bar_2']) return this.renderSearchTypeTwo()
    return this.renderSearchTypeOne()
  }
  handlScroll = () => {
    if (this.props.merchant.parsingFeature['Category_Scroll_Home']) {
      if (this.state.renderCategories.length != this.state.categories.length && this.state.loaded == this.state.renderCategories.length)
        this.setState(prevState => ({
          canLoadMore: false,
          renderCategories: prevState.categories.slice(0, prevState.renderCategories.length + 2)
        }))
    }
  }
  renderMostOrders = () => {
    if (this.props.merchant.parsingFeature['home_most_orders']) {
      if (this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'])
        return (<HorizontalItemsCarosel
          componentId={this.props.componentId}
          title={translations.get('most_orders').val()}
          query="sort_field=total_orders&sort_type=desc"
          token={this.props.token}
        />)
      else
        return (<HorizontalCarosel componentId={this.props.componentId}
          title={translations.get('most_orders').val()}
          query="sort_field=total_orders&sort_type=desc"
          token={this.props.token}
          list={[]}
        />)
    }
    return null
  }

  render() {
    return (
      <MainContainer componentId={this.props.componentId} selected={0} cutHeader={true}>
        {this.renderSearch()}
        <ScrollView
          style={{ backgroundColor: Colors.mainColor3 }}
          contentContainerStyle={{ paddingTop: calHeight(44) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          onScroll={this.handlScroll}
          scrollEventThrottle={1000}
        >
          <HomeSlider refreshing={this.state.refreshing} componentId={this.props.componentId} />
          {this.renderSubCats()}
          {this.renderCategories()}

          {/* <View style={{ height: calHeight(30) }}></View> */}
          {this.renderMostOrders()}
          {this.props.merchant?.parsingFeature['no_slider'] ? <OrderHome refreshing={this.state.refreshing} componentId={this.props.componentId} /> :
            this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ?
              <HorizontalItemsCarosel componentId={this.props.componentId} list={this.state.list} />
              :
              <HorizontalCarosel componentId={this.props.componentId} list={this.state.list} />
          }
          {/* {<HorizontalItemsCarosel componentId={this.props.componentId} list={this.state.list} /> } */}

          {/* <OrderHome refreshing={this.state.refreshing} componentId={this.props.componentId} /> */}
          {this.props.merchant.parsingFeature['Category_Scroll_Home'] && this.state.renderCategories.map(cat => {
            return <HorizontalItemsCarosel
              cat={cat}
              token={this.props.token}
              componentId={this.props.componentId}
              list={[]}
              onLoad={() => this.setState(prevState => ({
                loaded: prevState.loaded + 1
              }))}
            />
          })}
          <View style={{ height: calWidth(80) }} />
        </ScrollView>

      </MainContainer>
    );
  }
}

export default HomeScreen;
