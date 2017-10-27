import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import Card from "../components/Card";
import { Icon} from 'react-native-elements'
import { TabNavigator } from 'react-navigation';
import lang from "../configs/languages/lang";

export default class Trips extends React.Component {
    static navigationOptions = {
        title: lang.trip.details
    };

    render(){
        return <Tab/>;
    }
}

class TripScreen extends React.Component {
    static navigationOptions = {
        showLabel: false,
        tabBarIcon: ({ tintColor }) => (
            <Icon name='info' type="simple-line-icon"/>
        ),
    };

    render(){
        return (
            <Button
              onPress={() => this.props.navigation.navigate('Expenses')}
              title="Go to notifications"
            />
        );
    }
}

class ExpensesScreen extends React.Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name='wallet' type="simple-line-icon"/>
        ),
    };
  
    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
  }
  

const Tab = TabNavigator({
        Home: {
           screen: TripScreen,
        },
        Expenses: {
            screen: ExpensesScreen,
        },
    }, {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        tabBarOptions: {
            iconStyle: {
                width: 40
            },
            activeTintColor: '#e91e63',
            showIcon: true,
            showLabel: false
        },
    }
);