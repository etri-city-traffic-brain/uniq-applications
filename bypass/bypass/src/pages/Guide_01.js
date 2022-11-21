import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Dimensions,
  SafeAreaView,
  PermissionsAndroid,
} from 'react-native';

import {NavigationService} from '../navigation';
import store from '../mods/store';

async function checkUserInfo() {
  var jsonValue = await store.getData();
  if (jsonValue == null || jsonValue.phoneNumber == null) {
    return false;
  } else {
    console.log(jsonValue);
    return true;
  }
}

async function requestPermission() {
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

class Guide_01 extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      textValue:
        '현재 위치에서 교통 정보를 반영하여\n더 빠른 우회도로를 푸쉬 알림으로\n제공해드립니다.',
    };
  }

  goNext() {
    // requestPermission().then(result => {
    //   // 위치 확인 권한 없을 경우 처리 로직 추가
    //   if (result === 'granted') {
    //     console.log('granted');
    //   } else {
    //     console.log(result);
    //   }
    // });
    NavigationService.navigate('Guide_02', null);
  }

  render() {
    return (
      <SafeAreaView>
        {Platform.OS == 'ios' && (
          <StatusBar barStyle="dark-content" translucent={true} />
        )}
        <View style={styles.viewBG}>
          <View style={styles.viewMain}>
            <Text style={styles.textTitle}>엣지 서버 기반</Text>
            <Text style={styles.textTitle}>교통정보 우회 알림</Text>
          </View>
          <View style={styles.viewSub}>
            <Text style={styles.textContents}>{this.state.textValue}</Text>
          </View>
          <Image
            style={styles.imgGuide}
            source={require('../../img/img_guide_01.png')}
          />
        </View>
        <View style={styles.viewPage}>
          <TouchableOpacity
            style={styles.buttonCurrent}
            activeOpacity={0.8}
            onPress={() => this.goNext()}
          />
          <TouchableOpacity
            style={styles.buttonNext}
            activeOpacity={0.8}
            onPress={() => this.goNext()}
          />
        </View>
        <View style={styles.viewStart}>
          <TouchableOpacity
            style={styles.buttonStart}
            activeOpacity={0.8}
            onPress={() => this.goNext()}>
            <Text style={styles.buttonText}>시작하기</Text>
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
  textContents: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#666666',
    letterSpacing: -0.64,
  },
  imgGuide: {
    top: 30,
    width: 390,
    height: 352,
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

module.exports = Guide_01;
