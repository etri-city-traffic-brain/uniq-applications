import React, {Component} from 'react';
import Navigation from './pages';
import Navigation2 from './pages/RouteMap';
import {NavigationService} from './navigation';
import store from './mods/store';

class Router extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonValue: null,
    };
  }

  async componentDidMount() {
    var tempValue = await store.getData();
    this.setState({
      jsonValue: tempValue,
    });
  }

  render() {
    return (
      <>
        {this.state.jsonValue ? (
          <Navigation2
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        ) : (
          <Navigation
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
          />
        )}
      </>
    );
  }
}

export default Router;
