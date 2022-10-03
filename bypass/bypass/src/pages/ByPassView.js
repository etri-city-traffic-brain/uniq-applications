import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {NavigationService} from '../navigation';
import config from '../../conf/config.json';
import {View} from 'react-native';

class ByPassView extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      title: null,
      subtitle: null,
      imgSrc: null,
      message: null,
    };

    if (props.navigation.state.params) {
      this.state.title = props.navigation.state.params.title;
      this.state.subtitle = props.navigation.state.params.subtitle;
      this.state.imgSrc = props.navigation.state.params.imgSrc;
      this.state.message = props.navigation.state.params.message;
    }
  }

  componentDidMount() {}

  finish() {}

  GoBack() {
    NavigationService.back();
  }

  onLoadWebview = () => {
    console.log(this.state);
    this.webview.postMessage(JSON.stringify(this.state));
  };

  render() {
    return (
      <>
        {Platform.OS == 'ios' && (
          <StatusBar barStyle="light-content" translucent={true} />
        )}
        {Platform.OS == 'ios' && (
          <View
            style={{
              backgroundColor: '#090F29',
              height: 50,
            }}
          />
        )}
        <WebView
          ref={webview => {
            this.webview = webview;
          }}
          source={{uri: config.baseURL + '/bypass'}}
          javaScriptEnabled={true}
          onLoad={this.onLoadWebview}
        />
        <TouchableOpacity
          style={styles.buttonStyleClose}
          activeOpacity={0.8}
          onPress={() => this.GoBack()}>
          <Image source={require('../../img/icon_close_w.png')} />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyleClose: {
    alignItems: 'center',
    // backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: Platform.OS == 'ios' ? 100 : 50,
    width: 69,
    height: 40,
    // borderRadius: 50,
  },
});

module.exports = ByPassView;
