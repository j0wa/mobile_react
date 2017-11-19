import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback } from "react-native";
import { NavigationActions } from 'react-navigation'
import { Icon } from 'react-native-elements';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import formatDate from '../utils/date_format';

export default class TripsList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            trips: null,
            loaded: false,
            lang: this.props.screenProps
        }
    }

    async componentWillMount(){
        store.get("trips").then(
            trips => this.setState({
                trips : trips,
                loaded: true
            })
        );
    }

    buildList(navigation){
        var items = [];
        var trips = this.state.trips;
        
        if (trips == null || trips == ""){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{this.state.lang.trip.no_trips}</Text>
            </View>
        }

        trips.map((item) =>  {
            items.push( 
                <TouchableNativeFeedback 
                    key={item.id} 
                    onPress={() => {
                        navigation.navigate('TripsItem', {derp: "dsa"});
                    }}
                >
                    <View style={styles.list_item}>
                        <View style={styles.list_item_info}>
                            <Text>{formatDate(item.date)}</Text>
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

    buildButton(navigation){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {
                navigation.setParams({new : true})
                navigation.navigate('TripsItem')
            }} />
        </View>
    }

    render(){
        return this.state.loaded ? (
            <View style={styles.wrapper}>
                {this.buildList(this.props.navigation)}
                {this.buildButton(this.props.navigation)}
            </View>
        ) : 
        <Loader />
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff",
        flex: 1
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
