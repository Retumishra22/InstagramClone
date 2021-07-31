import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions';
import firebase from 'firebase';
import Feed from './main/Feed.js';
import Add from './main/Add.js';
import Profile from './main/Profile.js';
import Search from './main/Search.js';


const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }

    

    render() {
        const {currentUser}=this.props;
        if(currentUser==undefined){
            return(
                <View></View>
            );
        }
        
        return (
            <Tab.Navigator
                initialRouteName='Feed'
                tabBarOptions={{
                    style:{
                        backgroundColor: 'black',
                        
                    },
                    activeTintColor:"#fff",
                    inactiveTintColor:"grey"
                }}
            >
                <Tab.Screen 
                    name="Feed" 
                    component={Feed}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='home' color={color} size={32}/>
                        ),
                        tabBarLabel: () => null
                    }}
                />
                <Tab.Screen 
                    name="Search" 
                    component={Search}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='magnify' color={color} size={32}/>
                        ),
                        tabBarLabel: () => null
                    }}
                />
                <Tab.Screen 
                    name="AddButton" 
                    component={EmptyScreen}
                    listeners = {({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Add')
                        }
                    })}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='plus-box' color= {color} size={32}/>
                        ),
                        tabBarLabel: () => null
                    }}
                />
                <Tab.Screen 
                    name="Profile" 
                    component={Profile}
                    listeners = {({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Profile', {uid: firebase.auth().currentUser.uid})
                        }
                    })}
                    options={{
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons name='account-circle' color={color} size={32}/>
                        ),
                        tabBarLabel: () => null
                    }}
                />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
