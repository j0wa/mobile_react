import React from 'react';
import { Button, Text, View, ScrollView, Platform, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import Home from './screens/Home';
import TripsList from './screens/TripsList';
import Trips from './screens/Trips';
import Expenses from './screens/Expenses';
import lang from "./configs/languages/lang";

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = { 
            fontLoaded: true
        };
    }

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'MaterialIcons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'SimpleLineIcons': require('react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'FontAwesome': require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
            'Ionicons': require('react-native-vector-icons/Fonts/Ionicons.ttf'),
        });

        this.setState({ 
            fontLoaded: true
        });
    }

    render(){
        return (this.state.fontLoaded) ? <Menu /> : <AppLoading/>;
    }
}

let marginTop = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const StackNav =  StackNavigator({
    Home: { 
        screen: Home,
        navigationOptions:{
            title: lang.home.title
        }
    },
    TripsList: { 
        screen: TripsList,
        navigationOptions:{
            title: lang.trip.title
        }
    },
    Trips: { 
        screen: Trips,
        navigationOptions:{
            title: lang.trip.details
        }
    },
    Expenses: { 
        screen: Expenses,
        navigationOptions:{
            title: lang.expense.title
        }
    }
}, {
    navigationOptions: ({navigation}) => ({
        headerMode: "float",
        headerRight: <Icon name='menu' size={48} color="#fff" onPress={() => navigation.navigate("DrawerOpen") } />,
        headerStyle: {
            backgroundColor: '#4C3E54',
            overflow: "visible",
            marginTop: marginTop,
        },
        headerTitleStyle: {
            color: "#fff"
        },
        cardStyle: {
            color: "#fff"
        },
        headerBackTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});

const Menu = DrawerNavigator({
    Home: {
        screen: StackNav,
        navigationOptions:{
            title: lang.home.title
        }
    },
    TripsList: {
        screen: StackNav,
        navigationOptions:{
            title: lang.trip.title
        }
    },
    Expenses: {
        screen: StackNav,
        navigationOptions:{
            title: lang.expense.title
        }
    },
},{
    drawerPosition: "right",
    drawerWidth: 200,
    contentComponent: props => <ScrollView style={{marginTop: marginTop}}><DrawerItems {...props}/></ScrollView>,
});