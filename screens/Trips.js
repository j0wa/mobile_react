import React from 'react';
import { FlatList, View, Text, StyleSheet } from "react-native";
import StackNavigator from 'react-navigation';
import Button from "./Button";
import Card from "./Card";

const trips = [
    { date: "10/10/2000", location: "algures", numPeople: 5},
    { date: "10/03/2000", location: "algures", numPeople: 2},
    { date: "10/10/2010", location: "algures", numPeople: 3}
]

export default class Trips extends React.Component{
    onclick() {
        console.log("aa");
    }
 
    buildList(){
        <Card click={this.onclick}/>
    }

    render(){
        return this.buildList;
    }
}
