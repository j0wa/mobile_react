import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import {StackNavigator} from 'react-navigation';
import store from 'react-native-simple-store';

export default class TripsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            trips:[]
        };
    }
    setState2 = () => {
        store.get('tripsList').then( (trips) => {
            this.setState({trips});
        });
    }

    addExpense = () => {
        alert('U Clicked Me !');
    }
    static navigationOptions = {
        //Todoo, addapt to language
        title: 'Trips'
    };
    listCreator(){
        console.log("INSIDE listCreator")
        return(state.trips.map((item,index) => (
            <View style = {styles.listContainer}>
                <Text style = {styles.text}>
                    {item.name}
                </Text>
            </View>
        )));
    }
    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style = {styles.container}>
                <Button
                    title = 'Add trip'
                    onPress = {() => navigate('NewTrips')}
                />
                {this.state.trips === [] ? this.listCreator() : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container:{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex:1
  },
  button:{
      margin:5
  },
  listContainer: {
     padding: 10,
     marginTop: 3,
     backgroundColor: '#d9f9b1',
     alignItems: 'center',
  },
  text: {
     color: '#4f603c'
  }
})
