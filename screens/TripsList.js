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
            trips: [],
            loaded: false,
            lang: this.props.screenProps
        }
    }

    async componentWillMount(){
        store.get("trips").then(
            trips => this.setState({
                trips : trips == null ? [] : trips,
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

        return <ScrollView>
                {trips.map((item) =>  {
                    return <TouchableNativeFeedback 
                        key={item.id} 
                        onPress={() => {
                            navigation.navigate('TripsItem', {id: item.id, new: false});
                        }}
                    >
                        <View style={styles.list_item}>
                            <View style={styles.list_item_info}>
                                <Text style={styles.marg_bottom_10} >{item.location}</Text>
                                <Text>{formatDate(item.date)}</Text>
                            </View>
                            <View style={styles.arrow}>
                                <Icon name='chevron-right' size={40.0}/>
                            </View>
                        </View>
                    </TouchableNativeFeedback >
                })
            }
        </ScrollView>
    }

    updateTrips(trip){
        this.setState(prevState => ({
            trips: [
                ...prevState.trips,
                trip
            ]
        }));
    }

    buildButton(navigation){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {
                navigation.navigate('TripsItem', {new: true, id: this.state.trips.length + 1})
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
        flex: 1
    },

    flex_1: {
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

    marg_bottom_10: {
        marginBottom: 10
    },

    list_item: {
        height: 90,
        padding: 10,
        borderBottomWidth: .5,
        borderColor: "#aaa",
        borderStyle: "solid",
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },

    list_item_info: {
        flex: 1,
        justifyContent: "space-between",
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
