import React from 'react';
import { Navigation } from 'react-native-navigation';
import Share from "react-native-share";
import { View } from 'react-native';
import { dismissModal } from 'src/navigation';

export default class ShareDialog extends React.Component {

  constructor(props) {
    super(props);
    this.navigationEvents = Navigation.events().bindComponent(this);
  }


  componentDidMount() {
    this.onShare();
  }

  onShare = async () => {
    let options = {
      ...this.props.options
    }
    try {
      await Share.open({
        ...options
      }).then((response) => {
        //did share
        dismissModal(this.props.componentId);

      })
        .catch((error) => {
          //did not share
          dismissModal(this.props.componentId);

        });
      dismissModal(this.props.componentId);
      // End call
    } catch (error) {
      console.warn(error);
    }
  };
  render() {
    return <View hidden={true} ></View>
  }
}