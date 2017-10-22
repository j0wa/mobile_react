import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation';

export default class TripsScreen extends React.Component{
  static navigationOptions = {
    //Todoo, addapt to language
    title: 'Trips'
  };
  render(){
    return (
      <View>
        <Text>
          Wassup
        </Text>
      </View>
    );
  }
}
