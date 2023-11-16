import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Image,
  Text,
  Platform,
  Appearance,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import BackgroundTimer from 'react-native-background-timer';
const pointInPolygon = require('point-in-polygon');

// import GeoFencing from 'react-native-geo-fencing';
import axios from '../mods/axios';
import moment from 'moment';
import {NavigationService} from '../navigation';
import store from '../mods/store';
import MapboxGL from '@rnmapbox/maps';
import Sound from 'react-native-sound';

const path = require('../../assets/voice.mp3');

var voice = new Sound(path, null, error => {
  if (error) {
    console.log(error);
  }
});
console.log(Platform);
if (Platform.OS == 'ios') {
  // MapboxGL.setWellKnownTileServer('Mapbox'); // AOS에는 필수 IOS에서는 오류
} else {
  MapboxGL.setWellKnownTileServer('Mapbox'); // AOS에는 필수 IOS에서는 오류
}

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibGhnMjQ0OTc4IiwiYSI6ImNrdGNuNzJhazBoMDQyd3J3cjIzOHU1MHUifQ.QBM-RHlK39uts1yr05qb3w',
);

var debugTryCnt = [];

var lastPos = null;
var edgeList = [];
var tracking = null;
var curEdgeCoor = null;
var edgeServerIP = null;
var edgeServerPort = null;
var trackingId = null;
var phoneNumber = null;

var mapboxRef = null;

async function GetPhonenumber() {
  var jsonValue = await store.getData();
  if (jsonValue == null || jsonValue.phoneNumber == null) {
    return;
  } else {
    console.log('phoneNumber', jsonValue.phoneNumber);
    phoneNumber = jsonValue.phoneNumber;
  }
}

class Map extends React.Component {
  static navigationOptions = {headerShown: false};

  constructor(props) {
    super(props);

    this.state = {
      debugMode: false,
      trackingStarted: false,
      latitude: 37.387531,
      longitude: 126.639073,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      mapPoints: null,
      btnStr: '주행시작',
      heading: 0,
      timeBegin: null,
      gpsInfoList: [],
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

  addGpsInfo(coordinate) {
    var obj = {
      accuracy: coordinate.accuracy,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      speed: coordinate.speed,
      type: 'NORMAL',
    };

    // var tempInfoList = this.state.gpsInfoList;
    // tempInfoList.push(obj);
    // this.setState({
    //   gpsInfoList: tempInfoList,
    // });

    const {gpsInfoList} = this.state;
    this.setState({
      gpsInfoList: [...gpsInfoList, obj],
    });
  }

  async stopTracking() {
    console.log('stopTracking');

    BackgroundTimer.clearInterval(tracking);
    lastPos = null;
    trackingId = null;

    var gpsInfoList = this.state.gpsInfoList;
    if (gpsInfoList.length >= 3) {
      gpsInfoList[0].type = 'START';
      gpsInfoList[gpsInfoList.length - 1].type = 'END';
    }

    var bSend = true;

    if (!phoneNumber) {
      await GetPhonenumber();
      if (!phoneNumber) {
        console.log('error: this.state.phoneNumber is null!!');
        bSend = false;
      }
    }

    if (bSend) {
      var params = {
        phone: phoneNumber,
        timeBegin: this.state.timeBegin,
        jsonData: JSON.stringify(gpsInfoList),
      };

      await axios.post('/tracking', params).catch(function (error) {
        console.log(error);
      });
    }

    this.setState({
      trackingStarted: false,
      btnStr: '주행시작',
      isiOS: true,
    });
  }

  async sendPosData(pos) {
    if (!phoneNumber) {
      await GetPhonenumber();
      if (!phoneNumber) {
        console.log('error: this.state.phoneNumber is null!!');
        return;
      }
    }

    if (edgeServerIP == null || edgeServerPort == null) {
      console.log('error: tedgeServerIP or edgeServerPort is null!!');
      return;
    }

    var param = {
      phone: phoneNumber,
      trackingid: trackingId,
      regdate: moment().format('YYYY-MM-DD HH:mm:ss'),
      coordinate: JSON.stringify([pos.coords.latitude, pos.coords.longitude]),
      speed: pos.coords.speed,
    };

    await axios
      .post(`http://${edgeServerIP}:${edgeServerPort}/tracking`, param)
      .catch(function (error) {
        console.log(error);
      });
  }

  async startTracking() {
    console.log('startTracking');

    // await this.CheckGeofence(
    //   [36.48646, 127.2509],
    //   [
    //     [36.48498, 127.252],
    //     [36.48646, 127.249],
    //     [36.4869, 127.2526],
    //     [36.4856, 127.25334],
    //   ],
    // );

    if (this.state.trackingStarted != false) {
      this.stopTracking();
    }

    this.setState({
      mapPoints: null,
      trackingStarted: true,
      btnStr: '주행종료',
      timeBegin: moment().format('YYYY-MM-DD HH:mm:ss'),
      gpsInfoList: [],
    });

    trackingId = moment().format('YYYYMMDDHHmmss');

    tracking = BackgroundTimer.setInterval(() => {
      Geolocation.getCurrentPosition(
        async pos => {
          var inGeofence = true;
          var posChanged = false;

          if (lastPos == null) {
            lastPos = [pos.coords.latitude, pos.coords.longitude];

            inGeofence = await this.CheckGeofence(
              [pos.coords.latitude, pos.coords.longitude],
              curEdgeCoor,
            );

            posChanged = true;
          } else if (
            lastPos[0] != pos.coords.latitude ||
            lastPos[1] != pos.coords.longitude
          ) {
            lastPos = [pos.coords.latitude, pos.coords.longitude];

            inGeofence = await this.CheckGeofence(
              [pos.coords.latitude, pos.coords.longitude],
              curEdgeCoor,
            );

            posChanged = true;
          }

          if (inGeofence == false) {
            await this.ChooseEdgeServer(
              pos.coords.latitude,
              pos.coords.longitude,
            );
          }

          if (posChanged == true) {
            this.addGpsInfo(pos.coords);

            this.setState({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              heading: pos.coords.heading,
            });

            await this.sendPosData(pos);
          }
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 3600,
          maximumAge: 3600,
        },
      );
    }, 3000);
  }

  SetCurPos() {
    return new Promise((resolve, reject) => {
      if (debugTryCnt.length >= 5) {
        debugTryCnt = [];
      }

      debugTryCnt.push(moment());
      if (debugTryCnt.length == 5) {
        if (
          moment.duration(debugTryCnt[4].diff(debugTryCnt[0])).asSeconds() < 5
        ) {
          this.setState({
            debugMode: !this.state.debugMode,
          });
        }
      }

      Geolocation.getCurrentPosition(
        pos => {
          this.setState({
            latitude: 0,
            longitude: 0,
          });
          this.setState({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          resolve();
        },
        error => {
          console.log(error);
          reject();
        },
        {
          enableHighAccuracy: true,
          timeout: 3600,
          maximumAge: 3600,
        },
      );
    });
  }

  CheckGeofence(point, polygon) {
    return new Promise(resolve => {
      var pos = {
        lat: point[0],
        lng: point[1],
      };

      if (pos == null || polygon == null) resolve(false);

      if (polygon) {
        var polygon_array = [];
        if (polygon.length == 1) {
          polygon_array = polygon[0];
        } else {
          polygon_array = polygon;
        }

        console.log('해당 영역 :: ', pointInPolygon(point, polygon_array)); // true

        var inPoint = pointInPolygon(point, polygon_array);
        if (inPoint) {
          console.log('point is within polygon');
          resolve(true);
          // this.showPopup();
        } else {
          console.log('point is NOT within polygon');
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  async GetEdgeInfoList() {
    await axios
      .get('/edge')
      .then(function (response) {
        if (response.status == 200) {
          var dataLen = response.data.length;

          for (var idx = 0; idx < dataLen; idx++) {
            var coordinates = [];
            var tempCoor = JSON.parse(response.data[idx].coordinate);
            if (response.data[idx].serverid == 'ES_INFO') continue;

            for (var idx2 = 0; idx2 < tempCoor.length; idx2++) {
              var tempSubCoor = tempCoor[idx2];
              var subCoor = [];
              for (var idx3 = 0; idx3 < tempSubCoor.length; idx3++) {
                var subObj = {
                  lat: tempSubCoor[idx3][0],
                  lng: tempSubCoor[idx3][1],
                };
                subCoor.push(subObj);
              }
              coordinates.push(subCoor);
            }

            var obj = {
              serverId: response.data[idx].serverid,
              serverName: response.data[idx].servername,
              lat: response.data[idx].lat,
              lng: response.data[idx].lng,
              coordinate: JSON.parse(response.data[idx].coordinate),
              ip: response.data[idx].ip,
              port: response.data[idx].port,
              domain: response.data[idx].domain,
              regdate: response.data[idx].regdate,
              update: response.data[idx].update,
            };

            edgeList.push(obj);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async ChooseEdgeServer(latitude, longitude) {
    var curPos = [latitude, longitude];

    var found = false;

    for (var idx = 0; idx < edgeList.length; idx++) {
      var coordinate = edgeList[idx].coordinate;

      var ret = await this.CheckGeofence(curPos, coordinate);

      if (ret == true) {
        found = true;
        curEdgeCoor = coordinate;
        edgeServerIP = edgeList[idx].ip;
        edgeServerPort = edgeList[idx].port;
        console.log('edgeServerIP = ' + edgeServerIP);
        console.log('edgeServerPort = ' + edgeServerPort);
        break;
      }

      if (found == true) break;
    }
  }

  async componentDidMount() {
    await this.requestPermission().then(result => {
      // 위치 확인 권한 없을 경우 처리 로직 추가
      if (result === 'granted') {
        console.log('granted');
      } else {
        console.log(result);
      }
    });

    await this.SetCurPos();
    await this.GetEdgeInfoList();

    await this.ChooseEdgeServer(this.state.latitude, this.state.longitude);

    MapboxGL.setTelemetryEnabled(false);
  }

  finish() {
    this.setState({
      mapPoints: null,
    });
  }

  showPopup() {
    var params = {
      title: '우회경로 알림',
      subtitle: '전방에 교통 정체 발생',
      imgSrc: 'bypass_001.png',
      message: '100미터 앞에서 우회도로를 이용하세요.',
    };

    voice.play();

    NavigationService.navigate('ByPassView', params);
  }

  goSettings() {
    console.log('pressed goSettings');
    NavigationService.navigate('Settings', null);
  }

  render() {
    // MapboxGL.StyleURL.Light;

    return (
      <>
        {Platform.OS == 'ios' && (
          <StatusBar
            barStyle={
              Appearance.getColorScheme() === 'dark'
                ? 'light-content'
                : 'dark-content'
            }
            translucent={true}
          />
        )}
        {this.state && (
          <View style={styles.page}>
            <View style={styles.container}>
              <MapboxGL.MapView
                ref={ref => (mapboxRef = ref)}
                style={styles.map}
                styleURL={MapboxGL.StyleURL.Light}>
                <MapboxGL.MarkerView
                  coordinate={[this.state.longitude, this.state.latitude]}>
                  <Image
                    source={require('../../img/icon_pin.png')}
                    resizeMode="contain"
                  />
                </MapboxGL.MarkerView>
                <MapboxGL.Camera
                  zoomLevel={13}
                  centerCoordinate={[this.state.longitude, this.state.latitude]}
                  heading={this.state.heading}
                />
              </MapboxGL.MapView>
            </View>
          </View>
        )}
        {this.state.debugMode && (
          <>
            <TouchableOpacity style={styles.overlayDebug}>
              <Button
                title="show popup"
                color="#0275d8"
                onPress={() => this.showPopup()}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.debugStyle}>
              <Text style={styles.debugTextStyle}>
                {'latitude: ' +
                  this.state.latitude +
                  ', longitude: ' +
                  this.state.longitude}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.buttonStyleSet}
          activeOpacity={0.8}
          onPress={() => this.goSettings()}>
          <Image
            style={styles.imgStyleSet}
            source={require('../../img/icon_set.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonStyleGps}
          activeOpacity={0.8}
          onPress={() => this.SetCurPos()}>
          <Image source={require('../../img/icon_gps.png')} />
        </TouchableOpacity>
        <View style={styles.viewStartBtn}>
          <TouchableOpacity
            style={
              this.state.trackingStarted === false
                ? styles.buttonStyleStart
                : styles.buttonStyleStop
            }
            activeOpacity={0.8}
            onPress={() =>
              this.state.trackingStarted === false
                ? this.startTracking()
                : this.stopTracking()
            }>
            {this.state.trackingStarted == false && (
              <Image source={require('../../img/icon_car.png')} />
            )}
            {this.state.trackingStarted == true && (
              <Image source={require('../../img/icon_navi.png')} />
            )}
            <View style={styles.buttonIconSeparatorStyle} />
            <Text style={styles.buttonTextStyle}>{this.state.btnStr}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  buttonStyleSet: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 20,
    top: 80,
  },
  imgStyleSet: {
    width: 54,
    height: 54,
  },
  buttonStyleGps: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 120,
    width: 46,
    height: 46,
    borderRadius: 50,
  },
  buttonStyleStart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#090F29',
    bottom: 30,
    width: Dimensions.get('window').width - 35,
    height: 64,
    borderRadius: 5,
    position: 'absolute',
  },
  buttonStyleStop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C637C',
    bottom: 30,
    width: Dimensions.get('window').width - 35,
    height: 64,
    borderRadius: 5,
    position: 'absolute',
  },
  buttonIconSeparatorStyle: {
    width: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NotoSansCJKkr-Medium',
    letterSpacing: -0.64,
  },
  overlayDebug: {
    position: 'absolute',
    right: 0,
    bottom: 170,
  },
  debugStyle: {
    backgroundColor: '#000000',
    position: 'absolute',
    top: Platform.OS == 'ios' ? 50 : 0,
  },
  debugTextStyle: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  viewStartBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

module.exports = Map;
