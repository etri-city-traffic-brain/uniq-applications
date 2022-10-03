import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native';
import {NavigationService} from '../navigation';
import store from '../mods/store';
import axios from '../mods/axios';

class Settings extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      jsonValue: '',
      pushEnable: false,
      version: '최신버전입니다.',
    };
  }

  async componentDidMount() {
    var jsonValue = await store.getData();
    if (jsonValue != null && jsonValue.pushEnable != null) {
      this.setState({
        jsonValue: jsonValue,
        pushEnable: jsonValue.pushEnable == 'Y' ? true : false,
      });
    }
  }

  goBack() {
    NavigationService.back();
  }

  goPrivacy() {
    console.log('pressed goPrivacy');
    NavigationService.navigate('Privacy', null);
  }

  goTos() {
    console.log('pressed goTos');
    NavigationService.navigate('TOS', null);
  }

  async setPush(isOn) {
    var tempJson = {
      phoneNumber: this.state.jsonValue.phoneNumber,
      pushEnable: this.state.pushEnable == true ? 'Y' : 'N',
    };

    await this.setState({
      jsonValue: tempJson,
      pushEnable: isOn,
    });

    await store.storeData(this.state.jsonValue);

    var params = {push: this.state.pushEnable == true ? 'Y' : 'N'};

    await axios
      .patch(`/user/${this.state.jsonValue.phoneNumber}`, params)
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <>
        {Platform.OS == 'ios' && (
          <StatusBar barStyle="dark-content" translucent={true} />
        )}
        <View style={styles.viewBG}>
          <View style={styles.viewMain}>
            <Text style={styles.textTitle}>앱설정</Text>
          </View>
          <ListItem
            style={styles.listItem}
            containerStyle={{backgroundColor: '#F9F9F9'}}>
            <ListItem.Content style={styles.listItemContent}>
              <ListItem.Title style={styles.textContents}>
                푸시알림
              </ListItem.Title>
              <ToggleSwitch
                style={{top: Platform.OS == 'ios' ? 0 : 10}}
                isOn={this.state.pushEnable}
                onColor="#000000"
                offColor="#999999"
                size="custom"
                onToggle={isOn => {
                  // this.setState({
                  //   pushEnable: isOn,
                  // });
                  this.setPush(isOn);
                }}
              />
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={{backgroundColor: '#F9F9F9'}}>
            <ListItem.Content style={styles.listItemContent}>
              <ListItem.Title style={styles.textContents}>
                개인정보처리방침
              </ListItem.Title>
              <TouchableOpacity
                style={styles.buttonStyleShow}
                onPress={() => this.goPrivacy()}>
                <Image
                  source={require('../../img/icon_right.png')}
                  style={styles.buttonStyleRight}
                />
              </TouchableOpacity>
            </ListItem.Content>
          </ListItem>
          <ListItem containerStyle={{backgroundColor: '#F9F9F9'}}>
            <ListItem.Content style={styles.listItemContent}>
              <ListItem.Title style={styles.textContents}>
                이용약관
              </ListItem.Title>
              <TouchableOpacity
                style={styles.buttonStyleShow}
                onPress={() => this.goTos()}>
                <Image
                  source={require('../../img/icon_right.png')}
                  style={styles.buttonStyleRight}
                />
              </TouchableOpacity>
            </ListItem.Content>
          </ListItem>
          {/* <ListItem containerStyle={{backgroundColor: '#F9F9F9'}}>
            <ListItem.Content style={styles.listItemContent}>
              <ListItem.Title style={styles.textContents}>
                앱버전
              </ListItem.Title>
              <ListItem.Subtitle style={styles.textVersion}>
                {this.state.version}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem> */}
        </View>
        <TouchableOpacity
          style={styles.buttonStyleClose}
          activeOpacity={0.8}
          onPress={() => this.goBack()}>
          <Image source={require('../../img/icon_close.png')} />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  viewBG: {
    backgroundColor: '#F9F9F9',
    height: '100%',
  },
  viewMain: {
    top: Platform.OS == 'ios' ? 70 : 30,
    left: 20,
  },
  listItem: {
    marginTop: Platform.OS == 'ios' ? 100 : 50,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTitle: {
    fontSize: 30,
    fontFamily: 'GodoB',
    color: '#000000',
    letterSpacing: -1.2,
  },
  textContents: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#121212',
    letterSpacing: -0.64,
  },
  viewVersion: {
    marginRight: 20,
  },
  textVersion: {
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#999999',
    top: Platform.OS == 'ios' ? 0 : 5,
    letterSpacing: -0.56,
  },
  buttonStyleShow: {
    top: Platform.OS == 'ios' ? 0 : 15,
    alignItems: 'flex-end',
    width: 100,
    // height: 24,
  },
  buttonStyleClose: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: Platform.OS == 'ios' ? 75 : 35,
    width: 60,
    height: 40,
  },
  buttonStyleRight: {
    width: 24,
    height: 24,
  },
});

module.exports = Settings;
