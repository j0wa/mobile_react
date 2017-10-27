import React from 'react';
import { Button, Text, View, Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import Home from './screens/Home';
import TripsList from './screens/TripsList';
import Trips from './screens/Trips';
import Expenses from './screens/Expenses';

const Router = StackNavigator({
    Home: { screen: Home },
    TripsList: { screen: TripsList },
    Trips: { screen: Trips },
    Expenses: { screen: Expenses }
}, {
    headerMode: "float",
    cardStyle: {
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
});

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fontLoaded: false,
        };
    }

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'MaterialIcons': require('react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'FontAwesome': require('react-native-vector-icons/Fonts/FontAwesome.ttf')
        });

        this.setState({ fontLoaded: true });        
    }

    render(){
        return (this.state.fontLoaded) ? <Router /> : <AppLoading/>;
    }
}