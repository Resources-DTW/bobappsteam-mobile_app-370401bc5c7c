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
import MainCard from 'src/components/MainCard';
import { Api } from 'src/services';
import ListCard from 'src/components/ListCard';
import { Navigation } from 'react-native-navigation';
import { showOverlay, screenIds, pop } from 'src/navigation';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import { Container } from 'native-base';
class MyFavScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCat: 'ALL',
      loading: false,
      list: {},
      isRefreshing: false,
      container: 'normal',

    }
  }
  componentDidMount() {
    this.props.getAllFav({ token: this.props.token })
  }
  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }



  componentDidUpdate(prevProps) {

  }


  renderCard = ({ item, index }) => {
    if (this.state.container == 'normal')
      return <MainCard componentId={this.props.componentId} offer item={item} />
    else
      return <ListCard componentId={this.props.componentId} offer item={item} />
  }
  render() {
    const { list = [] } = this.props.fullFavList
    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
        <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{translations.get('fav').val()}</PoppinsSemiBold>
        </View>
        <FlatList
          style={{ backgroundColor: Colors.mainColor3 }}
          // ListEmptyComponent={() => { }}
          ListHeaderComponent={() => <View style={{ height: calHeight(16) }}></View>}
          data={list}
          renderItem={this.renderCard}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item._id + index}
          refreshControl={
            <RefreshControl refreshing={this.state.isRefreshing}
              onRefresh={() => {
                // this.onLayout()
                this.props.getAllFav({ token: this.props.token })
              }}
            />
          }
        />
      </View >
    );
  }
}

export default MyFavScreen;
