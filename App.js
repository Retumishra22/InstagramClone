
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LandingScreen from './components/auth/Landing.js';
import Register from './components/auth/Register.js';
import Login from './components/auth/Login.js';

import * as firebase from 'firebase';

import {Provider} from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import Main from './components/Main'
import { LogBox } from 'react-native';
import Add from './components/main/Add.js';
import Save from './components/main/Save.js';

LogBox.ignoreLogs(['Setting a timer']);

const store = createStore(rootReducer, applyMiddleware(thunk))



if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}



export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded : false,
      loggedIn: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else {
        // console.log('njfnfmvfn ' + user.name)
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {
    const Stack = createStackNavigator();
    const {loggedIn, loaded } = this.state
    if(!loaded){
      return(
        <View>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
          
            <Stack.Screen 
              name="Landing" 
              component={LandingScreen} 
              options={{headerShown: false}}
            />
            <Stack.Screen 
              name="Register" 
              component={Register}
            />
            <Stack.Screen 
              name="Login" 
              component={Login}
            />

          </Stack.Navigator>
        </NavigationContainer>
        
      ); 
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
          
            <Stack.Screen 
              name="Main" 
              component={Main}
            />
            <Stack.Screen 
              name="Add" 
              component={Add}
              navigation = {this.props.navigation}
            />
            <Stack.Screen 
              name="Save" 
              component={Save}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


