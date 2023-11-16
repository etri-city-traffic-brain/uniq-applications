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
} from 'react-native';

import {NavigationService} from '../navigation';

class UserLocInfoIos extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      textValue1: '현재 위치 교통 정보를 반영하기 위해',
      textValue2: '사용자 위치 정보',
      textValue3: '가 필요합니다.',
    };
  }

  goMap() {
    this.setState({modalVisible: false});
    NavigationService.navigate('Guide_01', null);
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
              <View style={styles.viewSecondRow}>
                <Text
                  style={[
                    styles.textContents,
                    {fontFamily: 'NotoSansCJKkr-Bold'},
                  ]}>
                  {this.state.textValue2}
                </Text>
                <Text style={styles.textContents}>{this.state.textValue3}</Text>
              </View>
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.buttonStyleOK}
                  onPress={() => {
                    this.goMap();
                  }}>
                  <Text style={styles.textStyle}>확인</Text>
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
    height: 337,
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
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#000000',
    letterSpacing: -0.64,
  },
  viewSecondRow: {
    flexDirection: 'row',
    top: Platform.OS == 'ios' ? 0 : -25,
  },
  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Medium',
  },
  buttonStyleOK: {
    top: Platform.OS == 'ios' ? 30 : -10,
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

module.exports = UserLocInfoIos;
