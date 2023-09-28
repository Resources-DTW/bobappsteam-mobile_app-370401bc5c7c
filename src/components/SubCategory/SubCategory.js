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

class SubCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cat: props.cat,
      hide: false,
      list: [{ _id: '23232wdsq', empty: true }, { _id: '232ddsq', empty: true }, { _id: '23w12wdsq', empty: true }],
      loaded: 0
    }
  }

  componentDidMount() {
    this.fetchData(this.props.cat)
    // setTimeout(() => {
    // }, 200);
  }
  fetchData = async (selectedCat, page = 1) => {
    this.setState({ loading: true, isLoading: true })
    const response = await Api.getItemsByCategoryCall({ id: selectedCat._id.trim(), token: this.props.token, page: page, offer_only: this.props.isOffer, sub_cat: selectedCat.sub_cat, limit: 6 })
    if (response && response.data && response.data.data) {
      this.setState({
        list: page == 1 ? [...response.data.data] : [
          ...this.state.list,
          ...response.data.data
        ],
        loading: false,
        isRefreshing: false,
        page: page,
        nextPage: page + 1,
        total_count: response.data.total_count,
        isLoading: false,
        hide: page == 1 ? response.data.data.length == 0 : false
      })
      if (this.props.onLoad) {
        this.props.onLoad()
      }
    } else {
      this.setState({
        loading: false,
        isRefreshing: false,
        isLoading: false,
        hide: page == 1 ? true : false
      })
      if (this.props.onLoad) {
        this.props.onLoad()
      }
    }
  }



  render() {
    const { name_ar = "", name = "" } = this.state.cat
    if (this.state.hide) {
      // if (name == 'ALL')
      //   return (
      //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: calWidth(32) }}>
      //       <PoppinsRegular style={{ fontSize: calWidth(16) }}>
      //         {this.props.isOffer ? translations.get('no_offers').val() : translations.get('no_result').val()}
      //       </PoppinsRegular>
      //     </View>
      //   )
      return null
    }
    return (
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: calWidth(16), }}>
          <PoppinsSemiBold style={{ color: Colors.mainColor1, fontSize: calWidth(14) }}>{context.isRTL() ? name_ar ? name_ar : name : name}</PoppinsSemiBold>
          {this.state?.cat?.name == 'ALL' ? null : <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              push(this.props.componentId, screenIds.MENU_SUB_CATEGORIES_SCREEN, { cat: { ...this.state.cat, }, isOffer: this.props.isOffer }, {}, null, false)
            }}
          >
            <PoppinsSemiBold style={{ color: Colors.shadeColor3 != "" ? Colors.shadeColor3 : '#707070', fontSize: calWidth(12), opacity: 0.59 }}>{translations.get('view_all').val()}</PoppinsSemiBold>

          </TouchableOpacity>}
        </View>
        <HorizontalItemsCarosel
          noTitle={true}
          componentId={this.props.componentId}
          list={this.state.list}

        />
      </>
    )
  }
}

export default SubCategory;
