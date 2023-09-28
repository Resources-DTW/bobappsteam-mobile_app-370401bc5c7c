// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { Api } from 'src/services';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';
import SubCategories from '../SubCategories';

export default function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(props.cat?._id ? props.cat?._id : 'all');

  const token = useSelector(state => state.merchants.get('token'))
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}

  useEffect(() => {

    const getCategories = async () => {
      const response = await Api.getCateogriesCall({ token: token, offer_only: false });
      if (response && response.data && response.data.data) {
        setCategories([{ name: 'ALL', _id: props.cat?._id ? props.cat?._id : 'all', name_ar: 'الكل' }, ...response.data.data])
      }
    }
    const getSubCategories = async (page = 1, cat_id = null, subCat = false, levelOne = false) => {
      const response = await Api.getSubCatsCall({ token: token, page: page, cat_id: cat_id == 'all' ? null : cat_id });
      if (response && response.data && response.data.data.length) {
        setCategories([{ name: 'ALL', _id: props.cat?._id ? props.cat?._id : 'all', name_ar: 'الكل' }, ...response.data.data])
      } else {
        setCategories([])
      }
    }
    if (!props.cat)
      getCategories()
    else {
      getSubCategories(1, props.cat._id)
      // setSelectedCat(props.cat._id)
      // props.selectedCat(props.cat._id)
    }
  }, [])


  const renderCategoryStyleTwo = (cat, index, subCat = false) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id: id } = cat || {}

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          setSelectedCat(cat._id);
          if (props.cat) {

            props?.fetchData(props.cat?._id, 1, cat._id)
          }
          if (!(parsingFeature['menu_category_2'] || parsingFeature['sub_category_mobile_slider']))
            props.fetchData(cat._id)
        }}
        style={{
          height: calWidth(40),
          backgroundColor: selectedCat == id ? '#fff' : Colors.mainColor1,
          marginLeft: calWidth(12), marginRight: index == categories.length - 1 ? calWidth(12) : 0, borderRadius: calWidth(5), justifyContent: 'center', alignItems: 'center',
          marginVertical: calWidth(12),
          paddingHorizontal: calWidth(12)
        }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: selectedCat == id ? Colors.mainColor1 : '#fff' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  const renderCategoryStyleOne = (cat, index, subCat = false) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id: id } = cat || {}

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          setSelectedCat(cat._id)
          if (props.cat) {
            props?.fetchData(props.cat?._id, 1, cat._id)
          }
          if (!(parsingFeature['menu_category_2'] || parsingFeature['sub_category_mobile_slider'])) {
            props?.fetchData(cat._id)
          }
        }}
        style={{
          width: calWidth(120), height: calWidth(57),
          backgroundColor: selectedCat == id ? Colors.mainColor1 : '#B3B1B2',
          marginLeft: calWidth(16), marginRight: index == categories.length - 1 ? calWidth(16) : 0, borderRadius: calWidth(5), justifyContent: 'center', alignItems: 'center', marginBottom: calWidth(16),
          paddingHorizontal: calWidth(8)
        }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: selectedCat == id ? "#fff" : '#fff' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  const renderCategory = (cat, index, subCat = false) => {
    if (parsingFeature['menu_category_2']) return renderCategoryStyleTwo(cat, index, subCat)
    else if (parsingFeature['sub_category_mobile_slider']) return renderCategoryStyleOne(cat, index, subCat)
    else return renderCategoryStyleOne(cat, index, subCat)
  }
  return (
    <View style={props.style ? props.style : [false ? { width: '100%', backgroundColor: Colors.mainColor3, marginTop: -calWidth(24) } : { zIndex: -1, width: '100%', backgroundColor: Colors.mainColor3, }, props.showFilter ? {} : Platform.OS == 'android' ? { opacity: 0, height: 0 } : { marginTop: props.subCats?.length ? -calWidth(140) : -calWidth(90) }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ backgroundColor: parsingFeature['menu_category_2'] ? Colors.mainColor1 : 'transparent', }}
        style={{ zIndex: 22, backgroundColor: parsingFeature['menu_category_2'] ? Colors.mainColor1 : 'transparent' }}
      >
        {categories.map((cat, index) => {
          return renderCategory(cat, index, true)
        })}
      </ScrollView>

      {parsingFeature['menu_category_2'] || parsingFeature['sub_category_mobile_slider'] ?
        <SubCategories
          catId={selectedCat}
          mainCat={props.cat ? props?.cat?._id ? props?.cat?._id : selectedCat : 'all'}
          fetchData={props.fetchData}
          selectedCat={props.selectedCat}
          levelOne={true}
        /> : null}
    </View>
  )
}
