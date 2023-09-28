// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import Categories from './Categories';

export default function CategoriesSection(props) {

  return <Categories
    categories={props.categories}
    subCats={props.subCats}
    selectedSubCat={props.selectedSubCat}
    showFilter={props.showFilter}
    fetchData={props.fetchData}
    selectedCat={props.selectedCat}
    cat={props.cat}
    style={props.style}
  />

}
