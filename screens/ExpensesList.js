import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback, TouchableHighlight } from "react-native";
import { Icon, FormLabel, Button, Divider } from 'react-native-elements';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import formatDate from '../utils/date_format';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import { updateStorage, updateStorageIDs } from '../utils/update_storage';

export default class ExpensesList extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            expenses: this.props.screenProps.expenses,
            lang: this.props.screenProps.lang || this.props.screenProps,
            members: this.props.screenProps.info.members,
            curr:  this.props.screenProps.info.curr,
            id: this.props.screenProps.info.expense_id,
        }

        this.updateListing = this.updateListing.bind(this);
        this.updateId = this.updateId.bind(this);
    }

    componentWillMount() {
        store.get("categories").then(
            (cats) => {
                this.setState({
                    cats: cats,
                })
            }
        )

        store.get("expenses").then(
            expenses => {
                this.setState({
                    expenses : expenses == null ? [] : expenses,
                    loaded: true,

                });
            }
        );
    }

    updateId(){
        var newId = this.state.id + 1;
        this.setState({
            id: newId
        });

        updateStorageIDs("expense_id");
    }

    updateListing(e) {
        var tmp = this.state.expenses;
        
        if (tmp.length == 0)
            tmp = [e];
        else 
            tmp.push(e);

        tmp.push(e);

        this.setState({
            expenses: tmp
        });
        
        this.props.screenProps.updateExpenses(e);
        this.resetCatFilter = this.resetCatFilter.bind(this);
        this.updateList = this.updateList.bind(this);
    }

    updateList() {
        /* store.get("expenses").then(
            expenses => {
                var filteredExp = expenses.filter(e => e.trip_id == this.props.screenProps.info.id);
                if(this.state.cat != undefined && this.state.cat != null){

                    var filteredExp = filteredExp.filter(e => e.cat == this.state.cat);
                }
                this.setState(prevState => ({
                    expenses: filteredExp
                }));
            }
        ) */
    }

    buildList(navigate) {
        var expenses = this.state.expenses;
        
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
                            expense: item, 
                            new: false,
                            members: this.state.members,
                            curr: this.state.curr,
                            updateExpenses: this.updateListing
                        })
                    }
                >
                    <View style={styles.list_item} >
                        <View style={styles.list_item_info}>
                            <View style={{justifyContent: "space-between", flexDirection: "row", marginRight: 50}}>
                                <View>
                                    <Text style={{fontWeight: "bold"}}>{this.state.lang.expense.receiver}</Text>
                                    <Text style={styles.marg_bottom_10}>{item.receiver}</Text>
                                </View>
                                <View>
                                    <Text style={{fontWeight: "bold"}}>{this.state.lang.expense.cost}</Text>
                                    <Text style={styles.marg_bottom_10}>{item.cost}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <Text style={{fontWeight: "bold", marginRight: 10}}>{this.state.lang.expense.date}</Text>
                                <Text>{formatDate(item.date)}</Text>
                            </View>
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
                    id: this.state.id,
                    new: true,
                    curr: this.state.curr,
                    members: this.state.members,
                    updateExpenses: this.updateListing,
                    updateId: this.updateId
                })
            }}/>
        </View>
    }

    getComboBox(collection, stateItem){
        var items = [];

        if (!collection || collection == "" || collection == [] || collection == null)
            return;

        return <ComboBox
                selectedValue={this.state[stateItem]}
                onValueChange={(value) => {
                    if (stateItem == "type")
                        this.setState({type: value});
                    else if (stateItem == "curr")
                        this.setState({curr: value});
                    else
                        this.updateList();
                        this.setState({cat: value});
                }}
                style={styles.combobox}
            >
            {collection.map(item => {
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    resetCatFilter(){
        this.setState({
            cat : null,
        });
        this.updateList();
    }

    render(){
        const { navigate } = this.props.navigation;

        return (
            <View style={styles.wrapper}>
                {/* category */}
                <FormLabel>{this.state.lang.cat.title}</FormLabel>
                {this.getComboBox(this.state.cats, "cat")}
                <TouchableNativeFeedback onPress={() => { this.resetCatFilter() }} >
                    <FormLabel containerStyle={styles.btn_search}>{this.state.lang.misc.reset_filter}</FormLabel>
                </TouchableNativeFeedback>

                <Divider style={styles.divider} />

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

    btnContainer: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 50,
        marginRight: 50,
    },

    btnStyle: {
        borderRadius: 5
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

    btn_search: {
        position: "absolute",
        right: 15,
        paddingBottom: 15,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "dashed",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        top: 8,
        height: 30
    },

    combobox: {
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10
    },

    divider: { 
        backgroundColor: '#4C3E54', 
        marginLeft: 10, 
        marginRight: 10 
    }
});
