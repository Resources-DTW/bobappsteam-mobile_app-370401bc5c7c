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
  TextInput,
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
import { Api } from 'src/services';
import { screenIds, dismissOverlay, showOverlay, showModal, push } from 'src/navigation';
import { Navigation } from 'react-native-navigation'
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import ListCard from 'src/components/ListCard';
import translations from 'src/localization/Translations';
import EasyCard from 'src/components/EasyCard';
import CardTypeThree from 'src/components/CardTypeThree';
class SearchScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      list: [],
      container: 'normal',
      search: '',
      ...props.search,
      statusBarHeight: 0,
      TopBarHeight: 0,
      page: 0,
      nextPage: 0,
      total_count: 0,
      isLoading: false
    }
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


  onLayout = () => {
    // if (Platform.OS == 'ios')
    //   LayoutAnimation.configureNext(
    //     LayoutAnimation.create(350, 'easeOut', 'opacity')
    //   );
  }
  componentDidMount() {
    this.getConstants()
    const { pattern = '' } = this.props.search || {}
    this.fetchData('', pattern)
  }

  fetchData = async (text = "", search = {}, page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsSearchCall({ search: `search=${text}${search}`, token: this.props.token, page: page })
    if (response && response.data && response.data.data) {
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
      this.setState({
        loading: false,
        isLoading: false
      })
    }
  }

  handleTextCahnge = (text) => {
    this.setState({
      search: text
    })
    const { pattern = '' } = this.props.search || {}
    this.fetchData(text, pattern)
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
          const { pattern = '' } = this.props.search || {}
          this.fetchData(this.state.search, pattern, this.state.page + 1)
        }
      }
    }
  }

  renderSearchTypeOne = () => {
    return (
      <View style={[Platform.OS == 'android' ? { width: '100%', backgroundColor: 'transparent', marginTop: -calWidth(24) } : { zIndex: 233, top: calWidth(70 + this.state.statusBarHeight), position: 'absolute', width: '100%', backgroundColor: 'transparent' }]}>
        <View style={{ height: calWidth(48), width: '100%', paddingHorizontal: calWidth(24) }}>
          <View style={{
            flex: 1,
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
            elevation: 2,
            borderRadius: calWidth(10),
          }}>
            <View style={{
              flexDirection: 'row', flex: 1, height: '100%', backgroundColor: '#fff', alignItems: 'center', borderTopLeftRadius: calWidth(10),
              borderBottomLeftRadius: calWidth(10),
              paddingHorizontal: calWidth(16),
            }}>
              <Image source={require('assets/icons/search.png')} style={{ tintColor: Colors.mainColor1 }} />
              <TextInput
                autoFocus={!this.props.filter}
                placeholderTextColor="#919191"
                style={{
                  marginLeft: calWidth(8),
                  flex: 1,
                  backgroundColor: '#fff',
                  fontFamily: 'Poppins-Regular',
                  fontSize: calWidth(16),
                  color: Colors.mainColor1
                }}
                placeholder={translations.get('search_here').val()}
                value={this.state.search}
                onChangeText={this.handleTextCahnge}
              />
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                  showModal(screenIds.FILTER_SCREEN, {
                    goToResult: (search) => {
                      const { pattern = "" } = search || {}
                      this.fetchData('', pattern)
                      this.setState({
                        ...search
                      })
                    },
                    selectedCat: this.state.selectedCat,
                    selectedValues: this.state.selectedValues,
                  })
                } else if (this.props.merchant?.parsingFeature['brands']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {
                  })
                } else {
                  showModal(screenIds.FILTER_SCREEN, {
                    goToResult: (search) => {
                      const { pattern = "" } = search || {}
                      this.fetchData('', pattern)
                      this.setState({
                        ...search
                      })
                    },
                    selectedCat: this.state.selectedCat,
                    selectedValues: this.state.selectedValues,
                  })
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
      <View style={[Platform.OS == 'android' ? { width: '100%', backgroundColor: 'transparent', marginTop: -calWidth(24), backgroundColor: Colors.mainColor3 } : { zIndex: 233, top: calWidth(70 + this.state.statusBarHeight), position: 'absolute', width: '100%', backgroundColor: 'transparent' }]}>
        <View style={{ height: calWidth(42), width: '100%', paddingHorizontal: calWidth(24), }}>
          <View style={{
            flex: 1,
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
            borderRadius: calWidth(10),
          }}>
            <View style={{
              flexDirection: 'row', flex: 1, height: '100%', backgroundColor: '#fff', alignItems: 'center',
              borderRadius: calWidth(20),
              paddingHorizontal: calWidth(16),
            }}>
              <TextInput
                autoFocus={!this.props.filter}
                placeholderTextColor='rgba(43,43,43,0.7)'
                style={{
                  marginLeft: calWidth(8),
                  flex: 1,
                  backgroundColor: '#fff',
                  fontFamily: 'Poppins-Regular',
                  fontSize: calWidth(16),
                  color: Colors.mainColor1
                }}
                placeholder={translations.get('search_products').val()}
                value={this.state.search}
                onChangeText={this.handleTextCahnge}
              />
              <Image source={require('assets/icons/magnifying-glass.png')} style={{ tintColor: Colors.mainColor1 }} />
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (this.props.merchant?.parsingFeature['brands']) {
                  push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {
                  })
                } else {

                  showModal(screenIds.FILTER_SCREEN, {
                    goToResult: (search) => {
                      const { pattern = "" } = search || {}
                      this.fetchData('', pattern)
                      this.setState({
                        ...search
                      })
                    },
                    selectedCat: this.state.selectedCat,
                    selectedValues: this.state.selectedValues,
                  })
                }

              }}
              style={{
                height: '100%',
                width: calWidth(42),
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginLeft: calWidth(16)
              }}>
              <Image source={require('assets/icons/filter_1.png')} style={{ tintColor: Colors.mainColor2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
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
            elevation: 2,
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
              if (this.props.merchant?.parsingFeature['sub_category_mobile_slider']) {
                showModal(screenIds.FILTER_SCREEN, { goToResult: (search) => push(this.props.componentId, screenIds.SEARCH_SCREEN, { search: search, filter: true }) })
              } else {
                push(this.props.componentId, screenIds.ALL_CATEGORIES_SCREEN, {
                })
              }
            }}
            style={{
              height: '100%',
              width: calWidth(42),
              justifyContent: 'center',
              alignItems: 'flex-end',
              marginLeft: calWidth(16)
            }}>
            <Image source={require('assets/icons/filter_1.png')} style={{ tintColor: Colors.mainColor2 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderSearch = () => {
    if (this.props.merchant?.parsingFeature['search_bar_2']) return this.renderSearchTypeTwo()
    return this.renderSearchTypeOne()
  }
  render() {
    return (
      <MainContainer componentId={this.props.componentId} showBack={true} selected={0} cutHeader={true}>
        {this.renderSearch()}
        <FlatList
          style={{ backgroundColor: Colors.mainColor3 }}
          ListHeaderComponent={() => {
            if (this.state.list.length == 0) return null;
            return (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: calHeight(60), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
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
                </View>
                }
              </View>
            )
          }
          }

          data={this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? this.state.list.length % 2 == 0 ? this.state.list : [...this.state.list, { empty: true, hide: true }] : this.state.list}
          ListEmptyComponent={() => {
            if (this.state.search == "") return null
            if (this.state.loading) {
              return (<View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
                <ActivityIndicator size="large" />
              </View>)
            }
            return <View style={{ paddingTop: calWidth(50), paddingHorizontal: calWidth(24), paddingBottom: calWidth(24) }}>
              <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#5C5C5C', textAlign: 'center' }}>{translations.get('no_result').val()}</PoppinsSemiBold>
            </View>;
          }}
          ListFooterComponent={() => {
            return <View style={{ height: calWidth(80) }} />
          }}
          renderItem={this.renderCard}
          showsVerticalScrollIndicator={false}
          key={this.state.container}
          keyExtractor={(item, index) => item._id + this.state.selectedCat + index}
          onEndReached={this.fetchMore}

          numColumns={this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? 2 : 1}

          contentContainerStyle={[this.props.merchant?.parsingFeature['item_card_2'] || this.props.merchant?.parsingFeature['item_card_3'] ? { paddingHorizontal: calWidth(12) } : {}]}
        />
      </MainContainer>
    );
  }
}

export default SearchScreen;
