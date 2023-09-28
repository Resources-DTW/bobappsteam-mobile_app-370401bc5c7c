// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissModal, screenIds, popToRoot, dismissAllModals, showModal } from '../../navigation';
import { Header, Container } from 'native-base';
import FastImage from 'react-native-fast-image';
import { calWidth } from 'src/utils/helpers';
import { Navigation } from 'react-native-navigation';
import { PoppinsBold } from 'src/fonts/PoppinsBold';
import Colors from 'src/theme';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import context from 'src/utils/context';
import translations from 'src/localization/Translations';
import CartScreen from '../CartScreen';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomLabel from '../../components/CustomLabel'
import { dimensionsCalculation } from '../ImageViewScreen/ImageViewScreen';
import config from 'src/config';
const { width } = Dimensions.get('window');
class FilterScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeToCartScreen: false,
      categories: [],
      selectedCat: props.selectedCat ? props.selectedCat : {},
      selectedValues: props.selectedValues ? props.selectedValues : config.filterRange
    }
  }
  componentDidMount() {
    this.setState({
      categories: [...this.props.menuCategories.list]
    })
  }


  componentDidUpdate(prevProps) {
    if (this.props.menuCategories.success != prevProps.menuCategories.success && this.props.menuCategories.success) {
      this.setState({
        categories: [...this.props.menuCategories.list]
      })
    }
  }

  onLayout = () => {
    if (Platform.OS == 'ios')
      LayoutAnimation.configureNext(
        LayoutAnimation.create(350, 'easeOut', 'opacity')
      );
  }

  handleSelectCat = (cat) => {
    // this.onLayout()
    this.setState({
      selectedCat: {
        ...this.state.selectedCat,
        [cat._id]: this.state.selectedCat[cat._id] ? false : true
      }
    })
  }

  renderCat = (cat, index, noMarginLeft = false) => {
    const { name = "", _id: id, name_ar = "" } = cat || {}
    return (<TouchableOpacity
      key={id}
      onPress={() => this.handleSelectCat(cat)}
      style={{
        minWidth: calWidth(68),
        backgroundColor: this.state.selectedCat[id] ? Colors.mainColor1 : '#fff',
        height: calWidth(54),
        marginLeft: noMarginLeft ? calWidth(8) : index == 0 ? calWidth(24) : calWidth(8),
        marginRight: noMarginLeft ? calWidth(8) : this.state.categories.length - 1 == index ? calWidth(24) : calWidth(8),
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
        marginTop: calWidth(16)
      }}>
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: this.state.selectedCat[id] ? "#fff" : Colors.mainColor2 }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
    </TouchableOpacity>)
  }
  render() {
    if (this.props.showCats)
      return (
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.79)' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              dismissModal(this.props.componentId)
              this.props.showHideFooter(true)
            }}
            style={{ flex: 1 }}>

          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              borderTopLeftRadius: calWidth(20),
              borderTopRightRadius: calWidth(20),
              paddingBottom: calWidth(32)
            }}>
            <View style={{ padding: calWidth(24), position: 'relative' }}>
              <PoppinsSemiBold style={{ textAlign: 'center', fontSize: calWidth(16), color: '#171010' }}>{translations.get('categories').val()}</PoppinsSemiBold>
              <View style={{ position: 'absolute', }}>
                <TouchableOpacity
                  onPress={() => dismissModal(this.props.componentId)}
                  activeOpacity={1}
                  style={{ padding: calWidth(12) }}>
                  <Image source={require('assets/icons/x.png')} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: calWidth(16) }}>

                {this.state.categories.map((cat, index) => this.renderCat(cat, index, true))}
              </View>

            </ScrollView>
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: calWidth(16) }}>

              <TouchableOpacity

                onPress={() => {
                  const ids = Object.keys(this.state.selectedCat).filter(cat => this.state.selectedCat[cat] == true);
                  dismissModal(this.props.componentId);
                  this.props.showHideFooter(true)
                  this.props.goToResult(
                    {
                      pattern: `&from_price=${this.state.selectedValues[0]}&to_price=${this.state.selectedValues[1]}${ids.length ? `&category_id=${ids.join(',')}` : ''}`,
                      selectedCat: this.state.selectedCat,
                      selectedValues: this.state.selectedValues,
                    }
                  )
                }}
                style={{
                  height: calWidth(40), width: calWidth(222), backgroundColor: Colors.mainColor1, borderRadius: calWidth(4),
                  justifyContent: 'center', alignItems: 'center'
                }}>
                <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('apply').val()}</PoppinsSemiBold>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          dismissModal(this.props.componentId)
          this.props.showHideFooter(true)
        }} style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: calWidth(8), }}>
        <TouchableOpacity
          activeOpacity={1}
          // onPress={null}
          style={{
            backgroundColor: '#fff',
            width: '100%',
            borderTopLeftRadius: calWidth(20),
            borderTopRightRadius: calWidth(20),
            paddingBottom: calWidth(32)
            // minHeight: calWidth(420),
            // justifyContent: 'space-between',
          }}>
          <View style={{ padding: calWidth(16), paddingBottom: 0 }}>

            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E2E2E2',
              paddingBottom: calWidth(10)
            }}>
              <PoppinsRegular style={{ color: '#000', fontSize: calWidth(16) }}>{translations.get('filter').val()}</PoppinsRegular>

            </View>

          </View>
          <View style={{ height: 120, }}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
            >
              {this.state.categories.map((cat, index) => this.renderCat(cat, index))}
            </ScrollView>

          </View>
          <View style={{ paddingHorizontal: calWidth(16), marginBottom: calWidth(48) }}>

            <PoppinsRegular style={{ fontSize: calWidth(16), color: '#000' }}>{translations.get('price_range').val()} {`${this.state.selectedValues[0]} - ${this.state.selectedValues[1]}`}</PoppinsRegular>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', direction: 'ltr' }}>

            <MultiSlider
              values={config.filterRange}
              sliderLength={calWidth(width - 120)}
              onValuesChange={(val) => this.setState({
                selectedValues: val
              })}
              min={config?.filterRange?.length ? config.filterRange[0] : 1}
              max={config?.filterRange?.length > 1 ? config.filterRange[1] : 50}
              step={config?.step ? config.step : 1}
              allowOverlap
              snapped
              enableLabel={true}
              customLabel={CustomLabel}
              selectedStyle={{ backgroundColor: Colors.mainColor1 }}
              isRTL={Platform.OS == 'android' ? context.isRTL() : false}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss()
              const ids = Object.keys(this.state.selectedCat).filter(cat => this.state.selectedCat[cat] == true);
              dismissModal(this.props.componentId);
              this.props.showHideFooter(true)
              this.props.goToResult(
                {
                  pattern: `&from_price=${this.state.selectedValues[0]}&to_price=${this.state.selectedValues[1]}${ids.length ? `&category_id=${ids.join(',')}` : ''}`,
                  selectedCat: this.state.selectedCat,
                  selectedValues: this.state.selectedValues,
                }
              )
            }}
            style={{ marginHorizontal: calWidth(16), backgroundColor: Colors.mainColor1, borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center', height: calWidth(48) }}>
            <PoppinsRegular style={{ fontSize: calWidth(16), color: '#fff' }}>{translations.get('apply_filters').val()}</PoppinsRegular>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export default FilterScreen;
