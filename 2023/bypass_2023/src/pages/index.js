import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Guide_01 from './Guide_01';
import Guide_02 from './Guide_02';
import SelfAuth from './SelfAuth';
import AlarmAuth from './AlarmAuth';
import Map from './Map';
import ByPassView from './ByPassView';
import PermissionGuide from './PermissionGuide';
import UserLocInfoAos from './UserLocInfoAos';
import UserLocInfoIos from './UserLocInfoIos';
import Settings from './Settings';
import Privacy from './Privacy';
import TOS from './TOS';

const RouteStack = createStackNavigator(
  {
    Guide_01: {
      screen: Guide_01,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    Guide_02: {screen: Guide_02},
    SelfAuth: {
      screen: SelfAuth,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    AlarmAuth: {
      screen: AlarmAuth,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    Map: {
      screen: Map,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    ByPassView: {screen: ByPassView},
    PermissionGuide: {
      screen: PermissionGuide,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    UserLocInfoAos: {
      screen: UserLocInfoAos,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    UserLocInfoIos: {
      screen: UserLocInfoIos,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    Settings: {screen: Settings},
    Privacy: {screen: Privacy},
    TOS: {screen: TOS},
  },
  {
    initialRouteName: 'Guide_01',
  },
);

// 최상단 내비게이터
const AppNavigator = createSwitchNavigator(
  {
    Route: RouteStack,
  },
  {
    initialRouteName: 'Route',
  },
);

export default createAppContainer(AppNavigator);
