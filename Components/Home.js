import React from 'react';
import { StyleSheet,Button, Text, View, Alert } from 'react-native';
import {StackNavigator} from 'react-navigation';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    //Todoo, addapt to language
    title: 'Welcome'
  };
  render() {
    const { navigate } = this.props.navigation;
    return(
      <View style = {styles.container}>
        <Button
          style = {styles.button}
        //Todoo, addapt to language
          title = "Trips"
          onPress = {
             () => navigate('Trips')
          }
        />
        <Button
        //Todoo, addapt to language
          title = "Expenses"
          onPress = {
             () => navigate('Expenses')
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex:1
  },
  button:{
    margin:5
  }
})
