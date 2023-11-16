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

class UserLocInfoAos extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      check: false,
      modalVisible: true,
      textValue1: '현재 위치 교통 정보를 반영하기 위해',
      textValue2: '회원님의 위치에',
      textValue3: "'항상'",
      textValue4: '접근할 수 있어야 합니다.',
      textValue5: '앱 설정에서 위치 권한에 대해 항상 허용을 선택해주세요.',
      textValue6:
        '이 앱은 사용자의 위치를 확인하기 위해 앱이 닫혀 있을 때나 사용되지 않을 때도 위치 데이터를 수집합니다.',
      textBtn: '위치 권한으로 이동',
    };
  }

  async requestPermission() {
    try {
      return await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );
    } catch (e) {
      console.log(e);
    }

    this.setState({modalVisible: false});
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

  goMap() {
    if (this.state.check == false) {
      this.checkPermission();
    } else {
      this.setState({modalVisible: false});
      NavigationService.navigate('Guide_01', null);
    }
  }

  render() {
    return (
      <SafeAreaView>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.viewModal}>
              <Text style={styles.textTitle}>사용자 위치 정보</Text>
              <View style={styles.divisionTitle} />
              <Image
                style={styles.imgIcon}
                source={require('../../img/icon_user_pin.png')}
              />
              <Text style={styles.textContents}>{this.state.textValue1}</Text>
              <Text style={[styles.textContents, {top: -25}]}>
                {this.state.textValue2}
              </Text>
              <View style={styles.viewSecondRow}>
                <Text
                  style={[
                    styles.textContents,
                    {fontFamily: 'NotoSansCJKkr-Bold'},
                  ]}>
                  {this.state.textValue3}
                </Text>
                <Text style={styles.textContents}>{this.state.textValue4}</Text>
              </View>
              <Text style={styles.textSubcontents1}>
                {this.state.textValue5}
              </Text>
              <Text style={styles.textSubcontents2}>
                {this.state.textValue6}
              </Text>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.buttonStyleOK}
                  onPress={() => {
                    this.goMap();
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get('window').width - 80,
    height: 480,
  },
  textTitle: {
    top: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'GodoB',
    color: '#000000',
  },
  divisionTitle: {
    top: 30,
    marginBottom: 60,
    height: 1,
    width: Dimensions.get('window').width - 80,
    backgroundColor: '#EDEDED',
  },
  imgIcon: {
    width: 94,
    height: 94,
    marginBottom: Platform.OS == 'ios' ? 15 : 0,
  },
  viewContents: {
    left: 64,
  },
  textContents: {
    fontSize: 18,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#000000',
    letterSpacing: -0.64,
  },
  textSubcontents1: {
    fontSize: 12,
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#666666',
    letterSpacing: -0.64,
    top: -50,
  },
  textSubcontents2: {
    fontSize: 12,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#666666',
    letterSpacing: -0.64,
    top: -50,
  },
  viewSecondRow: {
    flexDirection: 'row',
    top: Platform.OS == 'ios' ? 0 : -50,
  },
  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Medium',
  },
  buttonStyleOK: {
    top: Platform.OS == 'ios' ? 30 : -40,
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

module.exports = UserLocInfoAos;
