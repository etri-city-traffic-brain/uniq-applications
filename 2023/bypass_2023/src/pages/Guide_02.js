import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import {NavigationService} from '../navigation';

class Guide_02 extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      textValue:
        '대전, 세종 외 지역에서도 서비스 이용은\n가능하지만 우회 경로 안내 기능은\n제공되지 않습니다.',
    };
  }

  goPrev() {
    NavigationService.navigate('Guide_01', null);
  }

  goNext() {
    NavigationService.navigate('SelfAuth', null);
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.viewBG}>
          <View style={styles.viewMain}>
            <Text style={styles.textTitle}>대전/세종 지역 전용</Text>
            <Text style={styles.textTitle}>교통정보 우회 서비스</Text>
          </View>
          <View style={styles.viewSub}>
            <Text style={styles.textContents}>{this.state.textValue}</Text>
          </View>
          <Image
            style={styles.imgGuide}
            source={require('../../img/img_guide_02.png')}
          />
        </View>
        <View style={styles.viewPage}>
          <TouchableOpacity
            style={styles.buttonCurrent}
            activeOpacity={0.8}
            onPress={() => this.goPrev()}
          />
          <TouchableOpacity style={styles.buttonNext} activeOpacity={0.8} />
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
    width: 8,
    height: 8,
    bottom: 150,
    backgroundColor: '#BBBBBB',
    borderRadius: 10,
  },
  buttonNext: {
    left: 10,
    width: 20,
    height: 8,
    bottom: 150,
    backgroundColor: '#090F29',
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
    backgroundColor: '#090F29',
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

module.exports = Guide_02;
