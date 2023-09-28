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
  FlatList,
  UIManager,
  LayoutAnimation,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import { goToApp, dismissAllModals, screenIds, popToRoo, dismissAllModalst, showOverlay, showModal, pop, push } from '../../navigation';
import { Header, Container } from 'native-base';
import { calWidth } from 'src/utils/helpers';
import Colors from 'src/theme';
import { PoppinsSemiBold } from 'src/fonts/PoppinsSemiBold';
const { width, height } = Dimensions.get('window');

import { WebView } from 'react-native-webview';
import context from 'src/utils/context';

class WidgetScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    }

  }
  componentDidMount() {
  }




  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
        <View style={{ height: calWidth(100), backgroundColor: Colors.mainColor2, flexDirection: 'row', alignItems: 'center', paddingTop: calWidth(32) }}>
          <TouchableOpacity onPress={() => pop(this.props.componentId)} style={{ padding: calWidth(16) }}>
            <Image source={require('assets/icons/back.png')} style={[context.isRTL() ? { transform: [{ rotate: "180deg" }] } : {}, { tintColor: Colors.mainColor1 }]} />
          </TouchableOpacity>
          <PoppinsSemiBold style={{ fontSize: calWidth(16), color: Colors.mainColor1 }}>{this.props.title}</PoppinsSemiBold>
        </View>
        <WebView
          onLoadEnd={() => this.setState({ visible: false })}
          source={{ uri: this.props.uri }} />
        {this.state.visible && (
          <ActivityIndicator
            style={{ position: "absolute", top: height / 2, left: width / 2 }}
            size="large"
          />
        )}
      </View >
    );
  }
}

export default WidgetScreen;
