import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';

import {NavigationService} from '../navigation';
import Geolocation from 'react-native-geolocation-service';

var check = false;

class Privacy extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      textValue1:
        '현재 위치에서 교통 정보를 반영하여\n우회도로를 제공하기 위해\n필요한 권한입니다.',
      textValue2:
        '실시간 우회도로를 푸시알림으로\n제공하기 위해 필요한 권한입니다.',
      textValue3:
        '* 선택적 접근 권한은 미동의 시에도 해당 기능 외 앱 서비스 이용이 가능합니다.',
    };
  }

  async requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        return await Geolocation.requestAuthorization('always');
      }
      // 안드로이드 위치 정보 수집 권한 요청
      if (Platform.OS === 'android') {
        return await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  async goUserLocInfo() {
    await this.requestPermission().then(result => {
      // 위치 확인 권한 없을 경우 처리 로직 추가
      if (result === 'granted') {
        console.log('granted');
      } else {
        console.log(result);
      }
    });
    // this.setState({modalVisible: false});
    // if (Platform.OS === 'ios') {
    //   NavigationService.navigate('UserLocInfoAos', null);
    // } else {
    //   NavigationService.navigate('UserLocInfoIos', null);
    // }
  }

  render() {
    return (
      <SafeAreaView>
        {Platform.OS == 'ios' && (
          <StatusBar barStyle="dark-content" translucent={true} />
        )}
        <View style={styles.viewBG}>
          <View style={styles.viewMain}>
            <Text style={styles.textTitle}>바이패스 사용 권한 안내</Text>
            <View style={styles.viewSubTitle1}>
              <Image
                style={styles.imgIcon}
                source={require('../../img/icon_place.png')}
              />
              <Text style={styles.textSubtitle}>위치(필수)</Text>
            </View>
            <View style={styles.viewContents}>
              <Text style={styles.textContents}>{this.state.textValue1}</Text>
            </View>
            <View style={styles.viewSubTitle1}>
              <Image
                style={styles.imgIcon}
                source={require('../../img/icon_alarm.png')}
              />
              <Text style={styles.textSubtitle}>알림(선택)</Text>
            </View>
            <View style={styles.viewContents}>
              <Text style={styles.textContents}>{this.state.textValue2}</Text>
            </View>
            <View>
              <Text style={styles.textNote}>{this.state.textValue3}</Text>
            </View>
          </View>
        </View>
        <View style={styles.viewStart}>
          <TouchableOpacity
            style={styles.buttonStart}
            onPress={() => {
              this.goUserLocInfo();
            }}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  viewBG: {
    backgroundColor: '#F9F9F9',
    height: '100%',
  },
  viewMain: {
    marginTop: 100,
    marginLeft: 40,
  },
  viewSub: {
    marginTop: 10,
    marginLeft: 40,
  },
  textTitle: {
    fontSize: 30,
    fontFamily: 'GodoB',
    color: '#000000',
    letterSpacing: -1.2,
  },
  imgIcon: {
    marginTop: 10,
  },
  textSubtitle: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'GodoB',
    color: '#000000',
    letterSpacing: -1.2,
  },
  viewSubTitle1: {
    left: 30,
    flexDirection: 'row',
  },
  textContents: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#666666',
    letterSpacing: -0.64,
  },
  viewContents: {
    left: 64,
  },
  textNote: {
    fontSize: 12,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#999999',
    letterSpacing: -0.48,
  },
  buttonCurrent: {
    width: 20,
    height: 8,
    bottom: 150,
    backgroundColor: '#090F29',
    borderRadius: 10,
  },
  buttonNext: {
    left: 10,
    width: 8,
    height: 8,
    bottom: 150,
    backgroundColor: '#BBBBBB',
    borderRadius: 10,
  },
  viewPage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStart: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BBBBBB',
    position: 'absolute',
    width: Dimensions.get('window').width - 35,
    height: 54,
    bottom: 40,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Medium',
    color: '#FFFFFF',
    letterSpacing: -0.64,
  },
});

module.exports = Privacy;
