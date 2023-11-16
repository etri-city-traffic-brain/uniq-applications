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

class AlarmAuth extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true,
      textValue: 'BYPASS 본인 인증이\n완료되었습니다.',
    };
  }

  goNext() {
    this.setState({modalVisible: false});
    NavigationService.navigate('Map', null);
  }

  render() {
    return (
      <SafeAreaView>
        <Modal transparent={true} visible={this.state.modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.viewModal}>
              <Image
                style={styles.imgChecked}
                source={require('../../img/icon_success.png')}
              />
              <Text style={styles.textModal}>{this.state.textValue}</Text>
              <TouchableOpacity
                style={styles.buttonStyleOK}
                onPress={() => {
                  this.goNext();
                }}>
                <Text style={styles.textStyle}>확인</Text>
              </TouchableOpacity>
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
    padding: 35,
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
    height: 230,
  },
  buttonStyleOK: {
    bottom: 0,
    borderTopColor: '#EDEDED',
    borderTopWidth: 1,
    width: Dimensions.get('window').width - 80,
    height: 50,
    position: 'absolute',
    textAlign: 'center',
    justifyContent: 'center',
  },
  imgChecked: {
    marginBottom: Platform.OS == 'ios' ? 15 : 0,
    width: 56,
    height: 56,
  },
  textModal: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'NotoSansCJKkr-Bold',
    color: '#000000',
    letterSpacing: -0.72,
  },
  textStyle: {
    color: '#000000',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Regular',
    letterSpacing: -0.64,
  },
  viewBG: {
    backgroundColor: '#676767',
    height: '100%',
  },
});

module.exports = AlarmAuth;
