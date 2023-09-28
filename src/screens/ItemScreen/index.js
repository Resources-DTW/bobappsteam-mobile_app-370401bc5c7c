// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import ItemPageTypeOne from './ItemPageTypeOne';
import ItemPageTypeTwo from './ItemPageTypeTwo';

export default function ItemScreen(props) {
  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}

  if (parsingFeature['item_page_2']) {
    return (<ItemPageTypeTwo
      componentId={props.componentId}
      {...props}
    />)
  }
  return (<ItemPageTypeOne
    componentId={props.componentId}
    {...props}
  />)
}
