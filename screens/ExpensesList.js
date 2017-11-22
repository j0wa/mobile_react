import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback } from "react-native";
import { Icon } from 'react-native-elements';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import formatDate from '../utils/date_format';

export default class ExpensesList extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            expenses: null,
            loaded: false,
            lang: this.props.screenProps.lang || this.props.screenProps,
            // this will tell us if we're showing this screen on the trip menu
            // if we are, we'll have to get all expenses associated with the trip with the this.state.trip (which is an ID)
            trip_id: this.props.screenProps.params ? this.props.screenProps.params.trip_id : null,
        }
    }
 
    async componentWillMount() {
        store.get("expenses").then(
            expenses => {
                if (this.state.trip_id != undefined && this.state.trip_id != null && this.state.trip_id != ""){
                    expenses.filter((e) => {
                        return e.trip_id = this.props.trip_id;
                    });
                }
                
                this.setState({
                    expenses : expenses,
                    loaded: true
                })
            }
        );
    }

    updateList(e) {
        this.setState(prevState => ({
            expense: {
                ...prevState.expenses,
                e
            }
        }));
    }

    buildList(navigate) {
        var items = [];
        var expenses = this.state.expenses;

        if (expenses == null || expenses == ""){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{this.state.lang.expense.no_expenses}</Text>
            </View>
        }

        expenses.map((item) =>  {
            items.push( 
                <TouchableNativeFeedback 
                    key={item.id} 
                    onPress={() => navigate('ExpensesItem', {id: item.id, new: false, updateExpenses: this.updateList})}
                >
                    <View style={styles.list_item} >
                        <View style={styles.list_item_info}>
                            <Text>{formatDate(item.date)}</Text>
                            <Text>{item.reciever}</Text>
                            <Text>{item.type_split}</Text>
                            <Text>{item.location}</Text>
                        </View>
                        <View style={styles.arrow}>
                            <Icon name='chevron-right' size={40.0}/>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            );
        });

        return <ScrollView>{items}</ScrollView>
    }

    buildButton(navigate){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => navigate('ExpensesItem', {id: null, new: true, updateExpenses: this.updateList})}/>
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
