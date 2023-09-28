// @flow

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  UIManager,
  LayoutAnimation,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import LinearGradient from 'react-native-linear-gradient';
import Colors from 'src/theme';
import FastImage from 'react-native-fast-image';
import { calWidth, calHeight } from 'src/utils/helpers';
import { Header, Root, Footer, Container, Text } from 'native-base';
import { Navigation } from 'react-native-navigation';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import translations from 'src/localization/Translations';
import ToastModal from 'src/screens/ToastModal';

class MainFooter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      notiCount: 0
    }
  }
  onLayout = () => {
    if (!this.props.merchant?.parsingFeature['nav_bar_2'])
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }
  selectIndex = (index) => {
    this.onLayout()
    this.setState({
      selected: index
    })
    // if (index == 0 || index == 1 || index == 2 || index == 4)
    Navigation.mergeOptions('bottomTabs', {
      bottomTabs: {
        currentTabIndex: index
      }
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.indexing.index != prevProps.indexing.index) {
      this.selectIndex(this.props.indexing.index)
    }
    if (this.props.notifications?.success != prevProps.notifications?.success && this.props.notifications?.success) {
      const notiCount = this.props.notifications?.list?.filter(noti => noti.unread).length;
      this.setState({ notiCount })
    }
  }

  mainFooter = () => {
    return (
      <>
        <View
          style={[this.props.showHide ? {} : { display: 'none', }, {
            flexDirection: 'row',
            paddingBottom: calWidth(16),
            zIndex: -1, width: '100%', height: calWidth(64) + 30,
            position: 'absolute',
            bottom: -30,
            backgroundColor: '#E6E6E6',
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: {
              height: -5,
              width: 0
            },
            elevation: 2,
            borderTopWidth: 0,
          }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.changeSelectedMenu({ index: 0 })} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 }}>
            <View style={{ position: 'absolute', top: this.state.selected == 0 ? -calWidth(32) : 0, width: calWidth(64), height: calWidth(64), borderRadius: calWidth(32), backgroundColor: '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(50), height: calWidth(50), borderRadius: calWidth(25), backgroundColor: this.state.selected == 0 ? Colors.mainColor1 : '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: calWidth(32), height: calWidth(32) }}>
                  <Image source={require('assets/icons/home_selected.png')} style={{ tintColor: this.state.selected == 0 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>
            {this.state.selected == 0 ? <PoppinsRegular style={{ color: this.state.selected == 0 ? Colors.mainColor1 : '#919191', }}>{translations.get('home').val()}</PoppinsRegular> : null}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.changeSelectedMenu({ index: 1 })} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 }}>
            <View style={{ position: 'absolute', top: this.state.selected == 1 ? -calWidth(32) : 0, width: calWidth(64), height: calWidth(64), borderRadius: calWidth(32), backgroundColor: '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(50), height: calWidth(50), borderRadius: calWidth(25), backgroundColor: this.state.selected == 1 ? Colors.mainColor1 : '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: calWidth(32), height: calWidth(32) }}>
                  <Image source={require('assets/icons/offer.png')} style={{ tintColor: this.state.selected == 1 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>

            {this.state.selected == 1 ? <PoppinsRegular style={{ color: this.state.selected == 1 ? Colors.mainColor1 : '#919191', }}>{translations.get('offers').val()}</PoppinsRegular> : null}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.changeSelectedMenu({ index: 2 })} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 }}>
            <View style={{ position: 'absolute', top: this.state.selected == 2 ? -calWidth(32) : 0, width: calWidth(64), height: calWidth(64), borderRadius: calWidth(32), backgroundColor: '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(50), height: calWidth(50), borderRadius: calWidth(25), backgroundColor: this.state.selected == 2 ? Colors.mainColor1 : '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/menu.png')} style={{ tintColor: this.state.selected == 2 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>
            {this.state.selected == 2 ? <PoppinsRegular style={{ color: this.state.selected == 2 ? Colors.mainColor1 : '#919191', }}>{translations.get('menu').val()}</PoppinsRegular> : null}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.changeSelectedMenu({ index: 3 })} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 }}>
            <View style={{ position: 'absolute', top: this.state.selected == 3 ? -calWidth(32) : 0, width: calWidth(64), height: calWidth(64), borderRadius: calWidth(32), backgroundColor: '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(50), height: calWidth(50), borderRadius: calWidth(25), backgroundColor: this.state.selected == 3 ? Colors.mainColor1 : '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/order.png')} style={{ tintColor: this.state.selected == 3 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>
            {this.state.selected == 3 ? <PoppinsRegular style={{ color: this.state.selected == 3 ? Colors.mainColor1 : '#919191', }}>{translations.get('orders').val()}</PoppinsRegular> : null}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.props.changeSelectedMenu({ index: 4 })} style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 30 }}>
            <View style={{ position: 'absolute', top: this.state.selected == 4 ? -calWidth(32) : 0, width: calWidth(64), height: calWidth(64), borderRadius: calWidth(32), backgroundColor: '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: calWidth(50), height: calWidth(50), borderRadius: calWidth(25), backgroundColor: this.state.selected == 4 ? Colors.mainColor1 : '#E6E6E6', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  {this.state.notiCount != 0 ? <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'red', position: 'absolute', zIndex: 222, right: -4, top: -4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#fff' }}>{this.state.notiCount > 9 ? +9 : this.state.notiCount}</Text>
                  </View> : null}
                  <Image source={require('assets/icons/profile.png')} style={{ tintColor: this.state.selected == 4 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>
            {this.state.selected == 4 ? <PoppinsRegular style={{ color: this.state.selected == 4 ? Colors.mainColor1 : '#919191', }}>{translations.get('account').val()}</PoppinsRegular> : null}
          </TouchableOpacity>
        </View>
      </>
    );
  }

  returnSecondFooter = () => {
    return (
      <>

        <View
          style={[this.props.showHide ? {} : { display: 'none', }, {
            flexDirection: 'row',
            paddingBottom: calWidth(16),
            zIndex: -1, width: '100%', height: calWidth(64) + 30,
            position: 'absolute',
            bottom: 0,
            // backgroundColor: '#E6E6E6',
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: {
              height: -5,
              width: 0
            },
            elevation: 2,
            borderTopWidth: 0,
            alignItems: 'flex-start',
            justifyContent: 'center'
          }]}>
          <View style={{ flexDirection: 'row', width: '96%', backgroundColor: '#fff', height: calHeight(60), alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: calWidth(16), borderWidth: 1, borderColor: Colors.mainColor1, borderRadius: calWidth(7), }}>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.changeSelectedMenu({ index: 0 })} style={{}}>
              <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: calWidth(14), paddingVertical: calWidth(8), borderRadius: 8, backgroundColor: '#fff' },
              this.state.selected == 0 ? {
                backgroundColor: Colors.mainColor1,
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 6,
                shadowOffset: {
                  height: 3,
                  width: 0
                },
                elevation: 2,
              } : {}]}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/home_selected.png')} style={{ tintColor: this.state.selected == 0 ? '#fff' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                {this.state.selected == 0 ? <PoppinsRegular style={{ color: this.state.selected == 0 ? '#fff' : '#919191', marginLeft: calWidth(6) }}>{translations.get('home').val()}</PoppinsRegular> : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.changeSelectedMenu({ index: 2 })} style={{}}>
              <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: calWidth(14), paddingVertical: calWidth(8), borderRadius: 8, backgroundColor: '#fff' },
              this.state.selected == 2 ? {
                backgroundColor: Colors.mainColor1,
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 6,
                shadowOffset: {
                  height: 3,
                  width: 0
                },
                elevation: 2,
              } : {}]}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/menu.png')} style={{ tintColor: this.state.selected == 2 ? '#fff' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                {this.state.selected == 2 ? <PoppinsRegular style={{ color: this.state.selected == 2 ? '#fff' : '#919191', marginLeft: calWidth(6) }}>{translations.get('menu').val()}</PoppinsRegular> : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.changeSelectedMenu({ index: 3 })} style={{}}>
              <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: calWidth(14), paddingVertical: calWidth(8), borderRadius: 8, backgroundColor: '#fff' },
              this.state.selected == 3 ? {
                backgroundColor: Colors.mainColor1,
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 6,
                shadowOffset: {
                  height: 3,
                  width: 0
                },
                elevation: 2,
              } : {}]}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  <Image source={require('assets/icons/order.png')} style={{ tintColor: this.state.selected == 3 ? '#fff' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                {this.state.selected == 3 ? <PoppinsRegular style={{ color: this.state.selected == 3 ? '#fff' : '#919191', marginLeft: calWidth(6) }}>{translations.get('orders').val()}</PoppinsRegular> : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.props.changeSelectedMenu({ index: 4 })} style={{}}>
              <View style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: calWidth(14), paddingVertical: calWidth(8), borderRadius: 8, backgroundColor: '#fff' },
              this.state.selected == 4 ? {
                backgroundColor: Colors.mainColor1,
                shadowColor: "#000",
                shadowOpacity: 0.16,
                shadowRadius: 6,
                shadowOffset: {
                  height: 3,
                  width: 0
                },
                elevation: 2,
              } : {}]}>
                <View style={{ width: calWidth(24), height: calWidth(24) }}>
                  {this.state.notiCount != 0 ? <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: 'red', position: 'absolute', zIndex: 222, right: -4, top: -4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#fff' }}>{this.state.notiCount > 9 ? +9 : this.state.notiCount}</Text>
                  </View> : null}
                  <Image source={require('assets/icons/profile.png')} style={{ tintColor: this.state.selected == 4 ? '#E6E6E6' : '#919191', width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                {this.state.selected == 4 ? <PoppinsRegular style={{ color: this.state.selected == 4 ? '#fff' : '#919191', marginLeft: calWidth(6) }}>{translations.get('profile').val()}</PoppinsRegular> : null}
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </>
    );
  }
  button = (item) => {
    return (<TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.props.changeSelectedMenu({ index: item.index })
      }}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View style={{ width: calWidth(24), height: calWidth(24), marginBottom: calWidth(4) }}>
        <FastImage source={item.icon} style={{ width: '100%', height: '100%' }} resizeMode="contain" tintColor={this.state.selected == item.index ? '#12A727' : '#686868'} />
      </View>
      <PoppinsRegular style={{ fontSize: calWidth(12), color: this.state.selected == item.index ? '#12A727' : '#686868' }}>{item.title}</PoppinsRegular>
    </TouchableOpacity>)
  }
  returnThirdFooter = () => {
    return (<View style={{ position: 'absolute', bottom: 0, height: calWidth(Platform.OS == 'ios' ? 70 : 60), backgroundColor: '#fff', width: '100%', flexDirection: 'row' }}>
      {this.button({ title: translations.get('home').val(), icon: require('assets/new/home.png'), index: 0 })}
      {this.button({ title: translations.get('offers').val(), icon: require('assets/new/offers.png'), index: 1 })}
      {this.button({ title: translations.get('menu').val(), icon: require('assets/new/menu.png'), index: 2 })}
      {this.button({ title: translations.get('orders').val(), icon: require('assets/new/orders.png'), index: 3 })}
      {this.button({ title: translations.get('more').val(), icon: require('assets/new/more.png'), index: 4 })}

    </View>)
  }
  renderFooter = () => {

    if (this.props.merchant?.parsingFeature['nav_bar_2'])
      return this.returnSecondFooter()
    if (this.props.merchant?.parsingFeature['nav_bar_3'])
      return this.returnThirdFooter()
    return this.mainFooter()
  }

  render() {
    return (<>
      {!this.props.showHide ? <View style={{
        zIndex: -1,
        width: '100%',
        height: 30,
        position: 'absolute',
        bottom: -30,
      }} /> : this.renderFooter()}
      <ToastModal />
    </>)

  }
}

export default MainFooter;
