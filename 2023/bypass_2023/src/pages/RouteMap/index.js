import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Map from '../Map';
import ByPassView from '../ByPassView';
import Settings from '../Settings';
import Privacy from '../Privacy';
import TOS from '../TOS';

const RouteStack = createStackNavigator(
  {
    Map: {
      screen: Map,
      navigationOptions: {
        gestureEnabled: false,
      },
    },
    ByPassView: {screen: ByPassView},
    Settings: {screen: Settings},
    Privacy: {screen: Privacy},
    TOS: {screen: TOS},
  },
  {
    initialRouteName: 'Map',
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
