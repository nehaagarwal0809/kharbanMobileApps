import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Colors} from '../constants/colors/Colors';

export default class Spinnner extends Component {
  render() {     
    return (
      <View>
        <Spinner
          visible={this.props.visible}
          textContent={this.props.loaderTxt || 'Loading...'}    
          textStyle={styles.text}
          color={Colors.YELLOW_COLOR}
          overlayColor={'rgba(0,0,0,0.7)'}
          cancelable={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: Colors.YELLOW_COLOR,
    fontSize: 18,
  },
});
