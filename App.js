import React from 'react';
import { Button, Text, View, ScrollView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
import Screens from "./screens/Screens";
import lang from "./configs/languages/lang";
import { Font, AppLoading } from 'expo';

export default class App extends React.Component {
    constructor(props){
        super(props);

        this.state = { 
            fontLoaded: false
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
        StatusBar.setHidden(true);
        
        return (this.state.fontLoaded) ? <Menu /> : <AppLoading/>;
    }
}

const StackNav =  StackNavigator({
    Home: { 
        screen: Screens.Home,
        navigationOptions:{
            title: lang.home.title
        }
    },
    TripsList: { 
        screen: Screens.TripsList,
        navigationOptions:{
            title: lang.trip.title
        }
    },
    Trips: { 
        screen: Screens.Trips,
        navigationOptions:{
            title: lang.trip.details
        }
    },
    ExpensesList: { 
        screen: Screens.ExpensesList,
        navigationOptions:{
            title: lang.expense.title
        }
    },
    Expenses: { 
        screen: Screens.Expenses,
        navigationOptions:{
            title: lang.expense.title
        }
    },
    Categories: {
        screen: Screens.Categories,
        navigationOptions:{
            title: lang.cat.title
        }
    },
}, {
    navigationOptions: ({navigation}) => ({
        headerMode: "float",
        headerRight: <Icon name='menu' size={48} color="#fff" onPress={() => navigation.navigate("DrawerOpen") } />,
        headerStyle: {
            backgroundColor: '#4C3E54',
            overflow: "visible"
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
    ExpensesList: {
        screen: StackNav,
        navigationOptions:{
            title: lang.expense.title
        }
    },
    Categories: {
        screen: StackNav,
        navigationOptions:{
            title: lang.cat.title
        }
    },
},{
    drawerPosition: "right",
    drawerWidth: 200,
    contentComponent: props => <ScrollView><DrawerItems {...props}/></ScrollView>,
});