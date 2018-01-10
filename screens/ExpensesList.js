import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback, TouchableHighlight } from "react-native";
import { Icon } from 'react-native-elements';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import formatDate from '../utils/date_format';

export default class ExpensesList extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            expenses: [],
            loaded: false,
            lang: this.props.screenProps.lang || this.props.screenProps,
            // this will tell us if we're showing this screen on the trip menu
            // if we are, we'll have to get all expenses associated with the trip with the this.state.trip (which is an ID)
            trip_id: this.props.screenProps.info.id,
            members: this.props.screenProps.info.members,
            curr:  this.props.screenProps.info.curr,
        }

        //console.log("ID in expenseList");
        //console.log(this.props.screenProps.info.id);

        this.updateList = this.updateList.bind(this);
        this.updateExpenses = this.updateExpenses.bind(this);
    }

    async componentWillMount() {
        store.get("expenses").then(
            expenses => {

                var ar1 = [];
                var ar2 = [ar1];
                //added the value[0] != null because the storage sometime retreive a empty arrays in place of null...
                if (!this.props.screenProps.new && expenses != null && JSON.stringify(expenses)!=JSON.stringify(ar2)){
                    var filteredExp = expenses.filter(e => e.trip_id == this.props.screenProps.info.id);

                    //console.log("checkiking the filterring");
                    //console.log(this.props.screenProps.info.id);
                    //console.log(expenses);
                    //console.log(filteredExp);

                    this.setState({
                        expenses: filteredExp,
                        loaded: true,

                    });
                    //console.log(this.state);
                }
                else
                    this.setState({ loaded: true });
            }
        );
    }

    updateExpenses(exp){
        this.setState({ expenses: exp });
    }

    updateList(e) {
        this.setState(prevState => ({
            expenses: [
                ...prevState.expenses,
                e
            ]
        }));
    }

    buildList(navigate) {
        var expenses = this.state.expenses;
        console.log("buildList expenses :");
        console.log(expenses);
        if (expenses == null || expenses == "" || expenses == undefined){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{this.state.lang.expense.no_expenses}</Text>
            </View>
        }

        return <ScrollView>{
            expenses.map((item) =>  {
                return <TouchableHighlight
                    key={item.id}
                    onPress={() =>
                        this.props.screenProps.navigation.navigate('ExpensesItem', {
                            id: item.id,
                            new: false,
                            updateExpenses: this.updateList,
                            trip_id: this.state.trip_id,
                            members: this.state.members,
                            curr: this.state.curr,
                            updateExpenses: this.updateExpenses,
                        })
                    }
                >
                    <View style={styles.list_item} >
                        <View style={styles.list_item_info}>
                            <Text style={styles.marg_bottom_10}>{item.cost}</Text>
                            <Text>{formatDate(item.date)}</Text>
                        </View>
                        <View style={styles.arrow}>
                            <Icon name='chevron-right' size={40.0}/>
                        </View>
                    </View>
                </TouchableHighlight>
            })
        }</ScrollView>
    }

    buildButton(navigate){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {
                this.props.screenProps.navigation.navigate('ExpensesItem', {

                    id: (this.state.expenses.length + 1),
                    new: true,
                    updateExpenses: this.updateList,
                    trip_id: this.state.trip_id,
                    curr: this.state.curr,
                    members: this.state.members,

                })
            }}/>
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
        flex: 1
    },

    button: {
        marginBottom: 10,
        width: 64,
        bottom: 0,
        alignSelf: "center"
    },

    list_item: {
        height: 80,
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
    },

    marg_bottom_10: {
        marginBottom: 10
    },
});
