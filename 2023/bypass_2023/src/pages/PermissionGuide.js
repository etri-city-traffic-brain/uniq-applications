import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  Dimensions,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';

import {NavigationService} from '../navigation';
import Geolocation from 'react-native-geolocation-service';

class PermissionGuide extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      textValue1:
        '현재 위치에서 교통 정보를 반영하여\n우회도로를 제공하기 위해\n필요한 권한입니다.',
      textValue2:
        '실시간 우회도로를 푸시알림으로\n제공하기 위해 필요한 권한입니다.',
      textValue3:
        '* 선택적 접근 권한은 미동의 시에도 해당 기능 외\n 앱 서비스 이용이 가능합니다.',
      check: false,
      textBtn: '동의',
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

  checkPermission() {
    this.requestPermission().then(result => {
      // 위치 확인 권한 없을 경우 처리 로직 추가
      if (result === 'granted') {
        console.log('granted');
      } else {
        console.log(result);
      }

      this.setState({textBtn: '다음', check: true});
    });
  }

  goUserLocInfo() {
    if (this.state.check == false) {
      this.checkPermission();
    } else {
      this.setState({modalVisible: false});
      if (Platform.OS === 'ios') {
        NavigationService.navigate('UserLocInfoIos', null);
      } else {
        NavigationService.navigate('UserLocInfoAos', null);
      }
    }
  }

  render() {
    return (
      <SafeAreaView>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.viewModal}>
              <Text style={styles.textTitle}>바이패스 사용 권한 안내</Text>
              <View style={styles.divisionTitle} />
              <View style={styles.viewSubTitle1}>
                <Image
                  style={styles.imgIcon}
                  source={require('../../img/icon_place.png')}
                />
                <Text style={styles.textSubTitle1}>위치(필수)</Text>
              </View>
              <View style={styles.viewContents}>
                <Text style={styles.textContents1}>
                  {this.state.textValue1}
                </Text>
              </View>
              <View style={styles.viewSubTitle2}>
                <Image
                  style={styles.imgIcon}
                  source={require('../../img/icon_alarm.png')}
                />
                <Text style={styles.textSubTitle2}>알림(선택)</Text>
              </View>
              <View style={[styles.viewContents, {top: -20}]}>
                <Text style={styles.textContents2}>
                  {this.state.textValue2}
                </Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <View style={styles.divisionNote} />
              </View>
              <View>
                <Text style={styles.textNote}>{this.state.textValue3}</Text>
              </View>
              <View
                style={
                  Platform.OS == 'ios'
                    ? styles.buttonOverlayIOS
                    : styles.buttonOverlayAOS
                }>
                <TouchableOpacity
                  style={styles.buttonStyleOK}
                  onPress={() => {
                    this.goUserLocInfo();
                  }}>
                  <Text style={styles.textStyle}>{this.state.textBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.viewBG}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModal: {
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width - 80,
    height: 441,
  },
  textTitle: {
    top: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'GodoB',
    color: '#000000',
    letterSpacing: -0.72,
  },
  divisionTitle: {
    top: 30,
    marginBottom: 50,
    height: 1,
    width: Dimensions.get('window').width - 80,
    backgroundColor: '#EDEDED',
  },
  viewSubTitle1: {
    left: 30,
    flexDirection: 'row',
  },
  imgIcon: {
    top: Platform.OS == 'ios' ? 5 : 10,
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textSubTitle1: {
    top: Platform.OS == 'ios' ? 5 : -5,
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000000',
    letterSpacing: -0.64,
  },
  viewSubTitle2: {
    top: Platform.OS == 'ios' ? 40 : -15,
    left: 30,
    flexDirection: 'row',
  },
  textSubTitle2: {
    top: Platform.OS == 'ios' ? 5 : -5,
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000000',
    letterSpacing: -0.64,
  },
  viewContents: {
    left: 64,
  },
  textContents1: {
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#666666',
    top: Platform.OS == 'ios' ? 10 : -20,
    letterSpacing: -0.56,
  },
  textContents2: {
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#666666',
    top: Platform.OS == 'ios' ? 70 : -20,
    letterSpacing: -0.56,
  },
  divisionNote: {
    top: Platform.OS == 'ios' ? 80 : -30,
    height: 1,
    width: Dimensions.get('window').width - 150,
    backgroundColor: '#EDEDED',
  },
  textNote: {
    top: Platform.OS == 'ios' ? 90 : -30,
    left: 40,
    fontSize: 12,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#999999',
    letterSpacing: -0.48,
  },
  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Medium',
  },
  buttonOverlayIOS: {
    alignItems: 'center',
    top: 115,
  },
  buttonOverlayAOS: {
    alignItems: 'center',
    bottom: 20,
  },
  buttonStyleOK: {
    justifyContent: 'center',
    backgroundColor: '#090F29',
    width: Dimensions.get('window').width - 100,
    height: 48,
    borderRadius: 5,
    position: 'absolute',
    letterSpacing: -0.56,
  },
  viewBG: {
    backgroundColor: '#676767',
    height: '100%',
  },
});

module.exports = PermissionGuide;
