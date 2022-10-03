import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from 'react-native';

import {NavigationService} from '../navigation';

import store from '../mods/store';
import axios from '../mods/axios';

import messaging from '@react-native-firebase/messaging';

var timer = null;

class Privacy extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: null,
      request: false,
      authText: '인증요청',
      authCode: null,
      authResult: false,
      timerCount: '3:00',
    };
  }

  goBack() {
    NavigationService.back();
  }

  onChanged(text, type) {
    var newText = '';
    var numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
    }

    if (type == 1) this.setState({phoneNumber: newText});
    else this.setState({authCode: newText});
  }

  async onRequestCode() {
    if (!this.state.phoneNumber) return;

    if (this.state.request == true)
      this.setState({
        authCode: null,
      });

    this.setState({
      request: true,
      authText: '재요청',
    });

    var requestReuslt = false;
    var param = {
      phone: this.state.phoneNumber,
    };

    await axios
      .post('/phone/req', param)
      .then(response => {
        var jsonValue = response.data;
        if (jsonValue && !jsonValue.msg) {
          requestReuslt = true;
        } else if (jsonValue && jsonValue.msg) {
          console.log(jsonValue.msg);
          Alert.alert(jsonValue.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log('requestReuslt = ' + requestReuslt);

    if (requestReuslt) {
      var timerCount = 180;

      timer = setInterval(() => {
        if (timerCount < 0) {
          this.onClearInterval();
          return;
        }
        var divisor_for_minutes = timerCount % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        if (seconds < 10) seconds = '0' + seconds;

        this.setState({
          timerCount: minutes + ':' + seconds,
        });

        timerCount--;
      }, 1000);
    }
  }

  onClearInterval() {
    clearInterval(timer);
    timer = null;
  }

  onSetUserData() {
    var jsonValue = {
      phoneNumber: this.state.phoneNumber,
      pushEnable: 'Y',
    };

    console.log(jsonValue);
    store.storeData(jsonValue);
  }

  async CheckAuthCode() {
    var result = false;
    const fcmToken = await messaging().getToken();
    console.log(fcmToken);

    var param = {
      phone: this.state.phoneNumber,
      authnum: this.state.authCode,
      vsersion: '0.1',
      push: 'Y',
      token: fcmToken,
      device: Platform.OS == 'ios' ? 'ios' : 'aos',
    };

    await axios
      .post('/phone/check', param)
      .then(response => {
        console.log(response.data);
        if (response.status == 200) {
          if (response.data.msg != 'success.') {
            Alert.alert(response.data.msg);
          } else {
            result = true;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert('죄송합니다. 에러가 발생했습니다.');
      });

    console.log(result);
    return result;
  }

  async onCheckCode() {
    if (this.state.timerCount == '0:00')
      Alert.alert('인증 시간이 만료되었습니다.');
    else if (!this.state.authCode) return;
    else {
      if (await this.CheckAuthCode()) {
        this.onClearInterval();
        this.onSetUserData();
        NavigationService.navigate('AlarmAuth', null);
      }
    }
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.viewBG}>
          <View style={styles.viewMain}>
            <Text style={styles.textTitle}>본인인증</Text>
          </View>
          <View style={styles.viewSub}>
            <Text style={styles.textGuide}>휴대폰 번호</Text>
            <View>
              <TextInput
                style={styles.inputText}
                keyboardType="numeric"
                placeholder="-없이 번호 입력"
                placeholderTextColor={'#999999'}
                onChangeText={text => this.onChanged(text, 1)}
                value={this.state.phoneNumber}
                maxLength={11}></TextInput>
              <TouchableOpacity
                style={[
                  styles.buttonRequest,
                  {
                    backgroundColor: this.state.phoneNumber
                      ? '#090F29'
                      : '#BBBBBB',
                  },
                ]}
                onPress={() => this.onRequestCode()}>
                <Text style={styles.textRequest}>{this.state.authText}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.division}></View>
          </View>
          {this.state.request && (
            <View style={styles.viewSub}>
              <Text style={styles.textGuide}>인증번호</Text>
              <View>
                <TextInput
                  style={styles.inputText}
                  keyboardType="numeric"
                  placeholder="인증번호 입력"
                  placeholderTextColor={'#999999'}
                  onChangeText={text => this.onChanged(text, 2)}
                  value={this.state.authCode}
                  maxLength={6}></TextInput>
              </View>
              <View style={styles.division}></View>
              <Text style={styles.textTimer}>{this.state.timerCount}</Text>
            </View>
          )}
        </View>
        {Platform.OS == 'ios' && (
          <KeyboardAvoidingView behavior="position" enabled>
            <View style={styles.viewConfirmBtn}>
              <TouchableOpacity
                style={
                  this.state.authCode
                    ? styles.buttonConfirmEn
                    : styles.buttonConfirmDis
                }
                activeOpacity={0.8}
                onPress={() => this.onCheckCode()}>
                <Text style={styles.confirmTextStyle}>확인</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
        {Platform.OS == 'android' && (
          <View style={styles.viewConfirmBtn}>
            <TouchableOpacity
              style={
                this.state.authCode
                  ? styles.buttonConfirmEn
                  : styles.buttonConfirmDis
              }
              activeOpacity={0.8}
              onPress={() => this.onCheckCode()}>
              <Text style={styles.confirmTextStyle}>확인</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 50,
    marginLeft: 20,
  },
  viewSub: {
    marginTop: 30,
    marginLeft: 20,
  },
  textTitle: {
    fontSize: 30,
    fontFamily: 'GodoB',
    color: '#000000',
    letterSpacing: -1.2,
  },
  textGuide: {
    fontSize: 14,
    fontFamily:
      Platform.OS == 'ios' ? 'NotoSansCJKkr-Regular' : 'Noto Sans CJK KR',
    color: '#999999',
    letterSpacing: -0.56,
  },
  inputText: {
    top: 10,
    width: Dimensions.get('window').width - 35,
    borderColor: '#F9F9F9',
    borderWidth: 1,
    fontSize: 18,
    fontFamily:
      Platform.OS == 'ios' ? 'NotoSansCJKkr-Regular' : 'Noto Sans CJK KR',
    color: '#000000',
    letterSpacing: -0.72,
  },
  division: {
    top: 15,
    height: 1,
    width: Dimensions.get('window').width - 35,
    backgroundColor: '#EDEDED',
  },
  textRequest: {
    fontSize: 12,
    fontFamily: 'NotoSansCJKkr-Regular',
    color: '#FFFFFF',
    letterSpacing: -0.56,
  },
  buttonRequest: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 5 : 15,
    right: 20,
    height: 34,
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTimer: {
    top: 20,
    left: Dimensions.get('window').width - 60,
    color: '#ED1F0C',
    fontSize: 14,
    fontFamily: 'NotoSansCJKkr-Regular',
    letterSpacing: -0.56,
  },
  buttonConfirmDis: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BBBBBB',
    position: 'absolute',
    width: Dimensions.get('window').width - 35,
    height: 54,
    bottom: 30,
    borderRadius: 5,
  },
  buttonConfirmEn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090F29',
    position: 'absolute',
    width: Dimensions.get('window').width - 35,
    height: 54,
    bottom: 30,
    borderRadius: 5,
  },
  viewConfirmBtn: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTextStyle: {
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#FFFFFF',
    letterSpacing: -0.64,
  },
});

module.exports = Privacy;
