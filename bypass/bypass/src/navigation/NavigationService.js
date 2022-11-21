import {NavigationActions} from 'react-navigation';

let _navigator;
let routeList = [];

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  routeList.push(routeName);

  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function navigateTest(navigatorRef, routeName) {
  _navigator = navigatorRef;
  routeList.push(routeName);

  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
    }),
  );
}

function back() {
  if (routeList.length > 0) routeList.pop();
  _navigator.dispatch(NavigationActions.back());
}

function getRouteName() {
  return routeList[routeList.length - 1];
}

export default {
  navigate,
  setTopLevelNavigator,
  back,
  getRouteName,
  navigateTest,
};
