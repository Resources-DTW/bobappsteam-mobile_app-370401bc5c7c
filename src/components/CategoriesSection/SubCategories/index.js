// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import { Api } from 'src/services';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';

export default function SubCategories(props) {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(props.mainCat);

  const token = useSelector(state => state.merchants.get('token'))
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}


  useEffect(() => {
    setCategories([])
    setSelectedCat(props.mainCat)
    const getSubCategories = async (page = 1, cat_id = null, subCat = false, levelOne = false) => {
      const response = await Api.getSubCatsCall({ token: token, page: page, cat_id: props.catId == 'all' ? null : props.catId });
      if (response && response.data && response.data.data.length) {
        setCategories([...response.data.data])
        props.levelOne && props.fetchData(props.catId);
      } else {
        setCategories([])
        props.levelOne && props.fetchData(props.catId)
      }
    }
    if (props.catId != props.mainCat && props.catId != 'all') {
      getSubCategories()
    } else {
      if (props.catId == 'all' && props.levelOne)
        props.fetchData(props.catId);
      setCategories([])
    }
  }, [props.catId])

  const renderSubCatStyleTwo = (cat, index) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id: id } = cat || {}

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          setSelectedCat(cat._id);
          if (cat._id == 'all') {
            props.fetchData(props.catId)
            props.selectedCat(props.catId)
          } else {

            props.fetchData(props.subSub ? props.catId : props.catId, 1, cat._id)
            props.selectedCat(cat._id)
          }
        }}
        style={{
          height: calWidth(24),
          backgroundColor: selectedCat == id ? "#fff" : Colors.mainColor1,
          marginLeft: calWidth(12), marginRight: index == categories.length - 1 ? calWidth(12) : 0, borderRadius: calWidth(4), justifyContent: 'center', alignItems: 'center',
          marginVertical: calWidth(8),
          paddingHorizontal: calWidth(12)
        }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: selectedCat == id ? Colors.mainColor1 : '#fff' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  const renderSubCatStyleOne = (cat, index) => {
    if (cat.empty) return (<View style={{ flex: 1, marginHorizontal: index % 3 == 1 ? calWidth(20) : 0, }} />)
    const { name_ar = "", name = "", _id: id } = cat || {}

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          setSelectedCat(cat._id)
          if (cat._id == 'all') {
            props.fetchData(props.catId)
            props.selectedCat(props.catId)
          } else {
            props.fetchData(props.subSub ? props.catId : props.catId, 1, cat._id)
            props.selectedCat(cat._id)
          }
        }}
        style={{
          height: calWidth(33),
          backgroundColor: selectedCat == id ? Colors.mainColor1 : '#B3B1B2',
          marginLeft: calWidth(16), marginRight: index == categories.length - 1 ? calWidth(16) : 0, borderRadius: calWidth(10), justifyContent: 'center', alignItems: 'center', marginBottom: calWidth(16),
          paddingHorizontal: calWidth(12)
        }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(12), textAlign: 'center', color: selectedCat == id ? "#fff" : '#fff' }}>{context.isRTL() ? name_ar : name}</PoppinsSemiBold>
      </TouchableOpacity>
    )
  }

  const renderSubCat = (cat, index) => {
    if (parsingFeature['menu_category_2']) return renderSubCatStyleTwo(cat, index)
    else if (parsingFeature['sub_category_mobile_slider']) return renderSubCatStyleOne(cat, index)
    else return renderSubCatStyleOne(cat, index)
  }

  if (categories.length)
    return (
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: parsingFeature['menu_category_2'] ? Colors.mainColor1 : 'transparent' }}
          style={{ zIndex: 22, backgroundColor: parsingFeature['menu_category_2'] ? Colors.mainColor1 : 'transparent', marginTop: parsingFeature['menu_category_2'] ? calWidth(8) : 0 }}
        >
          {categories.map((cat, index) => {
            return renderSubCat(cat, index)
          })}
        </ScrollView>
        <SubCategories
          mainCat={props.mainCat}
          catId={selectedCat}
          fetchData={props.fetchData}
          selectedCat={props.selectedCat}
          subSub={props.catId}
        />
      </>
    )
  return null
}
