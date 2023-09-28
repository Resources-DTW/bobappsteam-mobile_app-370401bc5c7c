// @flow

import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, ActivityIndicator, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import Favorite from 'src/components/Favorite';
import FullCarousel from 'src/components/FullCarousel';
import ShareIcon from 'src/components/ShareIcon';
import { PoppinsRegular } from 'src/fonts/PoppinsRegular';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
import translations from 'src/localization/Translations';
import { pop } from 'src/navigation';
import Colors from 'src/theme';
import context from 'src/utils/context';
import { calWidth } from 'src/utils/helpers';
import Quantity from './Quantity';

export default function Options(props) {
  const [onlyOptions, setOnlyOptions] = useState([]);
  const [optionsWithSub, setOptionsWithSub] = useState([]);
  const [openOption, setOpenOption] = useState('');

  const merchant = useSelector(state => state.merchants.get('merchant'))
  const { parsingFeature = {} } = merchant || {}


  useEffect(() => {
    const onlyOptions = [];
    const optionsWithSub = [];
    props?.item?.options?.map(option => {
      if (option && option.sub_options && option.sub_options.length) {
        if (openOption == '') setOpenOption(option._id)
        optionsWithSub.push(option)
      } else {
        onlyOptions.push(option)
      }
    })
    setOnlyOptions(onlyOptions);
    setOptionsWithSub(optionsWithSub);
  }, [props.item?._id])



  const renderOptions = () => {
    if (onlyOptions.length == 0) return null;
    else return (
      <View style={{ marginBottom: calWidth(24) }}>
        <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', marginBottom: calWidth(14), opacity: 0.43, }}>{translations.get('options').val()}</PoppinsSemiBold>
        <View
          style={{

          }}>

          {onlyOptions.map((option, i) => (<TouchableOpacity
            onPress={() => {
              if (props.selectedOptions[option._id]) {
                if (parsingFeature['select_multi_options']) {
                  const obj = { ...props.selectedOptions };
                  delete obj[option._id];
                  props.setSelectedOptions(obj)
                } else {
                  props.setSelectedOptions({})
                }
              } else {
                if (parsingFeature['select_multi_options']) {
                  props.setSelectedOptions({ ...props.selectedOptions, [option._id]: { [option.title]: option } })
                } else {
                  props.setSelectedOptions({ [option._id]: { [option.title]: option } })
                }
              }

            }}
            activeOpacity={1}
            style={{
              flexDirection: 'row',
              height: calWidth(52),
              backgroundColor: '#fff',
              marginBottom: calWidth(8),
              // marginHorizontal: calWidth(8),
              borderRadius: calWidth(10),
              paddingHorizontal: calWidth(8),
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.11,
              shadowRadius: 9,
              shadowOffset: {
                height: 0,
                width: 0
              },
              elevation: 2,
              borderColor: props.selectedOptions[option._id] ? Colors.mainColor1 : '#fff'
            }} key={option._id}>
            <PoppinsRegular style={{ color: '#090909', fontSize: calWidth(12), textAlign: 'center', }}>{context.isRTL() ? option.title_ar : option.title}</PoppinsRegular>
            {parsingFeature['hide_option_price'] ? <View /> : option.price ? option.price == 0 ? <View /> : <PoppinsRegular style={{ textAlign: 'center', color: '#707070', fontSize: calWidth(12) }}>+ {option?.price?.toFixed(2)} {translations.get('jd').val()} </PoppinsRegular> : <View />}

          </TouchableOpacity>))
          }
        </View>
      </View>
    )
  }


  const renderSubOptions = (mainOption = {}) => {
    const { sub_options = [], is_multi = 0 } = mainOption || {}
    let selectedOption = props.selectedOptions[mainOption._id] || {};
    let selectedOptionPrice = 0;
    let selectedOptionTitle = Object.keys(selectedOption).map(key => {
      selectedOptionPrice = parseFloat(selectedOptionPrice) + parseFloat(selectedOption[key].price || 0)
      if (context.isRTL()) {
        return selectedOption[key].title_ar
      } else {
        return selectedOption[key].title
      }
    }).join(', ')

    return (
      <TouchableOpacity
        onPress={() => {
          if (openOption == mainOption._id) {
            setOpenOption('')
          } else {
            setOpenOption(mainOption._id)
          }
        }}
        activeOpacity={1}
        key={mainOption._id}
        style={{
          marginBottom: calWidth(24),
          backgroundColor: '#fff',
          shadowColor: "#000",
          shadowOpacity: 0.11,
          shadowRadius: 9,
          shadowOffset: {
            height: 0,
            width: 0
          },
          elevation: 2,

          borderRadius: calWidth(10),
          borderColor: props.selectedOptions[mainOption._id] ? Colors.mainColor1 : '#fff',
          borderWidth: 1
        }}>
        <View style={{ padding: calWidth(8), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', marginBottom: calWidth(4), }}>{context.isRTL() ? mainOption.title_ar : mainOption.title} <Text style={{ fontSize: calWidth(10), opacity: 0.4, textAlign: 'left', }}>{mainOption?.is_required ? '' : "(" + translations.get('optional').val() + ")"}</Text></PoppinsSemiBold>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <PoppinsRegular numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap', marginLeft: calWidth(8), color: '#090909', fontSize: calWidth(12), textAlign: 'center', }}>{selectedOptionTitle}</PoppinsRegular>
            {parsingFeature['hide_option_price'] ? <View /> : selectedOptionPrice ? selectedOptionPrice == 0 ? <View /> : <PoppinsRegular style={{ textAlign: 'center', color: '#000', fontSize: calWidth(12) }}>+ {selectedOptionPrice?.toFixed(2)} {translations.get('jd').val()} </PoppinsRegular> : <View />}
          </View>
        </View>
        {openOption == mainOption._id ? <View style={{
          // flex: 1,
          // flexDirection: 'row',
          // flexWrap: 'wrap',
          // justifyContent: 'center',
          // alignItems: 'center'
        }}>

          {sub_options.map((option, i) => {

            if (option.hasOwnProperty('quantity') && option.quantity < 1) return null
            return (<TouchableOpacity
              onPress={() => {
                if (parsingFeature['select_multi_sub_option'] || is_multi) {
                  if (props.selectedOptions[mainOption._id]) {
                    if (props.selectedOptions[mainOption._id][option?.title]?.title == option.title) {
                      const obj = { ...props.selectedOptions };
                      delete obj[mainOption._id][option?.title];
                      props.setSelectedOptions(obj)
                    } else {
                      if (parsingFeature['select_multi_options']) {
                        props.setSelectedOptions({ ...props.selectedOptions, [mainOption._id]: { ...props.selectedOptions[mainOption._id], [option.title]: option } })
                      } else {
                        props.setSelectedOptions({ [mainOption._id]: { ...props.selectedOptions[mainOption._id], [option.title]: option } })
                      }
                    }

                  } else {
                    if (parsingFeature['select_multi_options']) {
                      props.setSelectedOptions({ ...props.selectedOptions, [mainOption._id]: { [option.title]: option } })
                    } else {
                      props.setSelectedOptions({ [mainOption._id]: { [option.title]: option } })
                    }
                  }
                } else {
                  if (props.selectedOptions[mainOption._id]) {
                    if (props.selectedOptions[mainOption._id][option?.title]?.title == option.title) {
                      const obj = { ...props.selectedOptions };
                      delete obj[mainOption._id];
                      props.setSelectedOptions(obj)
                    } else {
                      if (parsingFeature['select_multi_options']) {
                        props.setSelectedOptions({ ...props.selectedOptions, [mainOption._id]: { [option.title]: option } })
                      } else {
                        props.setSelectedOptions({ [mainOption._id]: { [option.title]: option } })
                      }
                    }
                  } else {
                    if (parsingFeature['select_multi_options']) {
                      props.setSelectedOptions({ ...props.selectedOptions, [mainOption._id]: { [option.title]: option } })
                    } else {
                      props.setSelectedOptions({ [mainOption._id]: { [option.title]: option } })
                    }
                  }
                }
              }}
              style={[{
                flexDirection: 'row',
                // marginBottom: calWidth(8),
                // marginHorizontal: calWidth(2),
                // borderRadius: calWidth(10),
                paddingHorizontal: calWidth(8),
                paddingVertical: calWidth(8),
                alignItems: 'center',
                justifyContent: 'space-between',
                // borderWidth: 2,
                backgroundColor: selectedOption ? selectedOption?.[option?.title] ? '#F9F9F9' : '#fff' : '#fff',

              }, i == sub_options.length - 1 ? { borderBottomLeftRadius: calWidth(20), borderBottomRightRadius: calWidth(20) } : {}]} key={option.title}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: calWidth(16), height: calWidth(16), borderRadius: calWidth(8), borderWidth: 1, borderColor: Colors.mainColor1,
                  backgroundColor: selectedOption ? selectedOption?.[option?.title] ? Colors.mainColor1 : '#fff' : '#fff'
                }}></View>
                <PoppinsRegular style={{ marginLeft: calWidth(8), color: '#090909', fontSize: calWidth(12), textAlign: 'center', }}>{context.isRTL() ? option.title_ar : option.title}</PoppinsRegular>
              </View>
              {parsingFeature['hide_option_price'] ? <View /> : option.price ? option.price == 0 ? <View /> : <PoppinsRegular style={{ textAlign: 'center', color: '#000', fontSize: calWidth(12) }}>+ {option?.price?.toFixed(2)} {translations.get('jd').val()} </PoppinsRegular> : <View />}
            </TouchableOpacity>)
          })
          }
        </View>
          : null}
      </TouchableOpacity>
    )
  }

  return (<View style={{ padding: calWidth(16) }}>
    {renderOptions()}
    {optionsWithSub && optionsWithSub.length ? optionsWithSub.map(option => {
      return renderSubOptions(option);
    }) : null}
    {props.setQuantity ? <Quantity
      quantity={props.quantity}
      setQuantity={props.setQuantity}
      realQuantity={props?.item?.quantity}
      selectedOptions={props.selectedOptions}
    /> : null}
    {props.setNote ? <View style={{ marginBottom: calWidth(40) }}>
      <PoppinsSemiBold style={{ fontSize: calWidth(16), color: '#000000', opacity: 0.43, marginBottom: calWidth(12) }}>{translations.get('notes').val()}</PoppinsSemiBold>
      <View style={{ flex: 1, height: calWidth(60), backgroundColor: '#F2F2F2', borderRadius: calWidth(7), padding: calWidth(12) }}>
        <TextInput
          numberOfLines={3}
          editable={true}
          multiline={true}
          maxLength={750}
          style={[Platform.OS == "android" && { textAlignVertical: "top" }, {
            flex: 1,
            fontFamily: 'Poppins-Regular',
          }]}
          onChangeText={(text) => props.setNote(text)}
          value={props.note}
        />

      </View>
    </View> : null}
  </View>)
}
