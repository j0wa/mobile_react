import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback } from "react-native";
import { Icon } from 'react-native-elements';
import lang from "../configs/languages/lang";

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
    constructor(props){
        super(props);
    }

    buildList(navigate){
        var items = [];

        if (trips == null || trips == ""){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{lang.trip.no_trips}</Text>
            </View>
        }

        trips.map((item) =>  {
            items.push( 
                <TouchableNativeFeedback 
                    key={item.id} 
                    onPress={() => navigate('Trips', {new : false, id: item.id, lang: this.props.lang})}
                >
                    <View style={styles.list_item}>
                        <View style={styles.list_item_info}>
                            <Text>{item.date}</Text>
                            <Text>{item.location}</Text>
                            <Text>{item.numPeople}</Text>
                            <Text>{item.category}</Text>
                        </View>
                        <View style={styles.arrow}>
                            <Icon name='chevron-right' size={40.0}/>
                        </View>
                    </View>
                </TouchableNativeFeedback >                
            );
        });

        return <ScrollView>{items}</ScrollView>
    }

    buildButton(navigate){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => navigate('Trips', {new : true, lang: this.props.lang})}/>
        </View>
    }

    render(){
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.wrapper}>
                {this.buildList(navigate)}
                {this.buildButton(navigate)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff"
    },

    button: {
        marginBottom: 10,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignSelf: "center"
    },

    list_item: {
        height: 120,
        padding: 10,
        borderBottomWidth: .5,
        borderColor: "#aaa",
        borderStyle: "solid",
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },

    list_item_info: {
        flex: 1
    },

    arrow: {
        flex: 0,
        alignItems: "center",
        alignSelf: "center"
    },

    empty_text:{
        fontSize: 18,
        textAlign: "center"
    },

    empty:{
        alignSelf: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 30,
        marginRight: 30
    }
});
