import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Card from "../components/Card";
import {Icon} from 'react-native-elements'
import lang from '../configs/settings';

const trips = [
    { id: 1, date: "10/10/2000", location: "algures", numPeople: 5, category: "cool cat man"},
    { id: 2, date: "10/03/2000", location: "algures", numPeople: 2, category: "cool cat man"},
    { id: 3, date: "10/10/2000", location: "algures", numPeople: 5, category: "cool cat man"},
    { id: 4, date: "10/03/2000", location: "algures", numPeople: 2, category: "cool cat man"},
    { id: 5, date: "10/10/2000", location: "algures", numPeople: 5, category: "cool cat man"},
    { id: 6, date: "10/03/2000", location: "algures", numPeople: 2, category: "cool cat man"},
    { id: 7, date: "10/10/2000", location: "algures", numPeople: 5, category: "cool cat man"},
    { id: 8, date: "10/03/2000", location: "algures", numPeople: 2, category: "cool cat man"},
    { id: 9, date: "10/10/2000", location: "algures", numPeople: 5, category: "cool cat man"},
    { id: 10, date: "10/03/2000", location: "algures", numPeople: 2, category: "cool cat man"},
    { id: 11, date: "10/10/2010", location: "algures", numPeople: 3, category: "cool cat man"}
]

export default class TripsList extends React.Component{
    static navigationOptions = {
        //Todoo, addapt to language
        title: "lang.en."
    };

    constructor(props){
        super(props);
    }

    onclick() {
        console.log("aa");
    }

    buildList(){
        let cards = [];
        
        trips.map((item) =>  {
            cards.push( 
                <Card key={item.id}>
                    <View style={{flex: 1 , flexDirection: "row"}}>
                        <View style={{flex: 1}}>
                            <Text>{item.date}</Text>
                            <Text>{item.location}</Text>
                            <Text>{item.numPeople}</Text>
                            <Text>{item.category}</Text>
                        </View>
                        <View style={{flex: 0, alignItems: "center", alignSelf: "center"}}>
                            <Icon name='chevron-right' type="Entypo" onPress={() => navigate('Trips')} size={40.0}/>
                        </View>
                    </View>
                </Card>
            );
        });
        
        return <ScrollView>{cards}</ScrollView>
    }

    buildButton(){
        return <View style={{marginBottom: 10, position: "absolute", left: 0, right: 0, bottom: 0, alignSelf: "center"}}>
            <Icon name='add-circle' size={64.0} onPress={this.props.onPress}/>
        </View>
    }

    render(){
        const { navigate } = this.props.navigation;

        return (
            <View style={{flex: 1, backgroundColor: "#f1f1f1"}}>
                {this.buildList()}
                {this.buildButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, 
        marginBottom: 10,
        borderWidth: .5,
        borderRadius: 5,
        borderColor: '#666',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        elevation: 0,
        height: 200
    }
});