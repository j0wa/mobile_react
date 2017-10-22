import React from 'react';
import { Button, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation';
import HomeScreen from './Components/Home';
import TripsScreen from './Components/Trips'
import ExpensesScreen from './Components/Expenses'

const Router = StackNavigator({
  Home: { screen: HomeScreen },
  Trips: {screen: TripsScreen},
  Expenses: {screen: ExpensesScreen}
});

export default class App extends React.Component {
  render() {
    return <Router />;
  }
}
