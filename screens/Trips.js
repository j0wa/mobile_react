import React from 'react';
import { Icon, Button, FormValidationMessage, FormInput, FormLabel } from 'react-native-elements'
import { TabNavigator } from 'react-navigation';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback, Dimensions, Modal, Alert, TouchableHighlight } from "react-native";
import DatePicker from 'react-native-datepicker';
import ExpensesList from "./ExpensesList";
import Loader from '../components/Loader';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import Required from '../components/Required';
import { updateStorage, updateStorageIDs } from '../utils/update_storage';
import store from 'react-native-simple-store';

export default class Trips extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
        }

        this.updateExpenses = this.updateExpenses.bind(this);
        this.updateNew = this.updateNew.bind(this);
    }

    updateExpenses(exp){
        var tmp = this.state.expenses;

        tmp.push(exp);

        updateStorage("trips", {
            id: this.state.info.id,
            info: {
                location: this.state.info.location,
                date: this.state.info.date,
                curr: this.state.info.curr,
                members: this.state.info.members,
                desc: this.state.info.desc,
                desc: this.state.info.id,
            },
            expenses: tmp
        }, false, () => {});
        
        this.setState({ 
            expenses: tmp
        });
    }

    updateNew(trip){
        this.setState({
            new: false,
            info: {
                id: trip.info.id,
                location: trip.info.location,
                date: trip.info.date,
                curr: trip.info.curr,
                members: trip.info.members,
                desc: trip.info.desc,
                member_id: trip.info.member_id,
                expense_id: trip.info.expense_id,
            },
            expenses: [],
            summaries: [],
        })
    }

    componentWillMount(){
        store.get("ids").then(ids => {
            store.get("trips").then(trips => {
                var neww = this.props.navigation.state.params.new;
                var id = this.props.navigation.state.params.id;
                var trip = {};
                if (!neww)
                {
                    trips.find((t) => {
                        if (t.id == id){
                            trip = t;
                            return;
                        }
                    });
                }

                this.setState({
                    new: neww,
                    expenses: trip.expenses || [],
                    summaries: trip.summaries || [],
                    info: Object.keys(trip).length != 0 ? {
                        location: trip.info.location,
                        date: trip.info.date,
                        curr: trip.info.curr,
                        members: trip.info.members,
                        desc: trip.info.desc,
                        id: id,
                        member_id: ids.member_id,
                        expense_id: ids.expense_id,
                    } : {
                        id: ids.trip_id,
                        member_id: ids.member_id,
                        expense_id: ids.expense_id,
                        location: "",
                        date: "",
                        curr: "",
                        members: [],
                        desc: "",
                    },
                    loaded: true,
                });
            });
        })
    }

    render(){
        if (this.state.loaded){
            var props = {
                navigation: this.props.navigation,
                lang: this.props.screenProps,
                new: this.state.new,
                info: this.state.info,
                expenses: this.state.expenses,
                summaries: this.state.summaries,
                updateTrips: this.props.navigation.state.params.updateTrips,
                updateExpenses: this.updateExpenses,
                id: this.state.id,
                expense_id: this.state.info.expense_id,
                member_id: this.state.info.member_id,
            }

            return this.state.new ? <TripScreen screenProps={{...props, updateNew: this.updateNew}}/> : <Tab screenProps={props} />
        }

        return <Loader />;
    }
}

class TripScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loaded: false,
            modalVisible: false,
            errLocation: false,
            errMembers: false,
            errDesc: false,
            errMemberName: false,
            memberName: "",
            new: this.props.screenProps.new,
            trip: this.props.screenProps.info,
            expenses: this.props.screenProps.expenses,
            summaries: this.props.screenProps.summaries,
            lang: this.props.screenProps.lang,
            id: this.props.screenProps.info.id,
            expense_id: this.props.screenProps.info.expense_id,
            member_id: this.props.screenProps.info.member_id,
            members: []
        }
        
        this._submit_new_member = this._submit_new_member.bind(this)
        this._delete_member = this._delete_member.bind(this)
        this._submit = this._submit.bind(this)
    }

    componentWillMount(){
        store.get("settings").then((item) => {
            store.get("currencies").then(
                (currs) => {
                    var trip = this.state.trip;
    
                    this.setState({
                        currs: currs,
                        date: trip.date || new Date(),
                        members: trip.members || [],
                        curr: trip.curr || item[0].curr,
                        loaded: true,
                        location: trip.location || "",
                        date: trip.date || new Date(),
                        id: trip.id,
                        desc: trip.desc || "",
                    });
                }
            );
        })
    }

    _submit() {
        var err = -1;

        if (this.state.location == "") {
            this.setState({ errLocation: true });
            err = 1;
        } else {
            this.setState({ errLocation: false });
        }

        if (this.state.members == "") {
            this.setState({ errMembers: true });
            err = 1;
        } else {
            this.setState({ errMembers: false });
        }
        
        if (err === -1){
            var t = {
                id: this.state.id,
                expenses: this.state.expenses,
                summaries: this.state.summaries,
                info: {
                    id: this.state.id,
                    location: this.state.location,
                    date: this.state.date,
                    curr: this.state.curr,
                    members: this.state.members,
                    desc: this.state.desc,
                    member_id: this.state.member_id,
                    expense_id: this.state.expense_id,
                },
            };

            updateStorageIDs("trip_id");
            updateStorage("trips", t, this.state.new, () => {
                this.props.screenProps.updateTrips(t);

                if (this.state.new)
                    this.props.screenProps.updateNew(t);
                else
                    this.props.screenProps.navigation.goBack()
            });            
        }
    }

    _submit_new_member() {
        var err = -1;

        if (this.state.memberName == "") {
            this.setState({ errMemberName: true });
            err = 1;
        } else {
            this.setState({ errMemberName: false });
        }

        if (err === -1) {
            var newId = this.state.member_id + 1;
            var members = this.state.members;
            
            members.push({id: this.state.member_id, name: this.state.memberName});
            
            this.setState(prevState => ({
                members: members,
                modalVisible: false,
                memberName: "",
                member_id: newId
            }));

            updateStorageIDs("member_id");
        }
    }

    _delete_member(index){
        Alert.alert(
            this.state.lang.trip.remove_title,
            this.state.lang.trip.remove_text,
            [
                {text: this.state.lang.misc.remove_no, style: 'cancel'},
                {text: this.state.lang.misc.remove_yes, onPress: () => {
                    var members = this.state.members;
                    members.splice(index, 1);

                    this.setState({
                        members: members
                    });
                }},
            ],
        );
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    buildCurrencies(){
        return <ComboBox
                selectedValue={this.state.curr}
                onValueChange={(value) => { this.setState({curr: value}); }}
            >
                {this.state.currs.map(item => {
                    return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
                })}
            </ComboBox>
    }

    buildMembersList(){
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.members} <Required /> </FormLabel>
                <TouchableNativeFeedback onPress={() => { this.setModalVisible(true) }} >
                    <FormLabel containerStyle={styles.new_member}>{this.state.lang.trip.new_member}</FormLabel>
                </TouchableNativeFeedback>
                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.members != "" && this.state.members.map((item, index) => {
                        return <View key={index} style={styles.list_item}>
                            <Text key={index} style={styles.list_item_text}>{item.name}</Text>
                            {this.props.id == null && <Icon style={styles.list_item_icon} name='delete-forever' onPress={() => { this._delete_member(index) }} size={32.0}/> }
                        </View>
                    })}
                </ScrollView>

                {this.state.errMembers && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }
            </View>
        );
    }

    buildModal(){
        return <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false) }}
        >
            <View style={styles.modal_wrapper}>
                <View style={styles.modal_container}>
                    <Text style={styles.modal_title}>{this.state.lang.trip.new_member_title}</Text>

                    <FormLabel>{this.state.lang.expense.item_name}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        onChangeText={(name) => this.setState({memberName: name})}
                        style={styles.input}
                    />
                    { this.state.errMemberName && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit_new_member} />
                    
                    <TouchableHighlight onPress={() => { this.setModalVisible(false) }}>
                        <View><FormLabel containerStyle={styles.modal_back_button_wrapper}>{this.state.lang.payment.back}</FormLabel></View>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    }

    buildForm(){
        return (
            <ScrollView style={styles.flex_1}>
                <FormLabel>{this.state.lang.misc.curr}</FormLabel>
                <View style={styles.curr}>
                    {this.buildCurrencies()}
                </View>

                <FormLabel>{this.state.lang.trip.date}</FormLabel>
                <View style={styles.date_container}>
                    <DatePicker
                        date={this.state.date}
                        mode="date"
                        minDate={new Date()}
                        format="DD-MM-YYYY"
                        showIcon={false}
                        customStyles={{
                            dateInput: styles.date_input
                        }}
                        onChangeText={(date) => {this.state.loaded && this.setState({date: date})}}
                    />
                </View>

                <FormLabel>{this.state.lang.trip.location} <Required /></FormLabel>
                <FormInput
                    autoCapitalize="sentences"
                    editable={this.props.new}
                    style={styles.input}
                    value={this.state.location}
                    returnKeyType="next"
                    onChangeText={(location) => {this.state.loaded && this.setState({location: location})}}
                />
                {this.state.errLocation && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                <FormLabel>{this.state.lang.trip.desc}</FormLabel>
                <FormInput
                    autoCapitalize="sentences"
                    editable={this.props.new}
                    multiline={true}
                    autoGrow={true}
                    value={String(this.state.desc)}
                    onChangeText={(desc) => {this.state.loaded && this.setState({desc: desc})}}
                    style={StyleSheet.flatten([styles.input, styles.input_textarea])}
                />

                {this.buildMembersList()}

                {this.props.id == null && <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit} />}
            </ScrollView>
        );
    }

    render(){
        return (this.state.loaded) ?
            <View style={styles.flex_1}>
                {this.buildForm()}
                {this.buildModal()}
            </View> :
            <Loader />
    }
}

class SummariesScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loaded: false,
            new: this.props.screenProps.new,
            trip: this.props.screenProps.info,
            expenses: this.props.screenProps.expenses,
            summaries: this.props.screenProps.summaries,
            lang: this.props.screenProps.lang,
            id: this.props.screenProps.info.id,
            curr: this.props.screenProps.info.curr,
        }
        this.changeCurr = this.changeCurr.bind(this);
    }
    
    componentDidMount(){
        store.get("currencies").then(
            (currs) => {
                this.setState({
                    currs: currs
                });
            }
        );
        store.get("categories").then(
            (cats) => {
                this.setState({
                    cats: cats,
                    loaded: true
                });
            }
        );
    }

/*
    buildCategoryPersonSheet(){
        var arraySummaries = [];
        var i =0;

        if(this.state.trip.members == undefined || this.state.expenses == undefined){
            return
            <View>
                <Text>{this.state.lang.trip.members}</Text>
            </View>
        }
        /*
        return(
            <View style={styles.members_wrapper}>
                <ScrollView >
                    {this.state.trip.members.map((item) => {
                        return <View key={item.id} style={styles.list_item_flex}>
                                {
                                    this.state.expenses.map((exp) => {
                                        if()
                                    })
                                }
                            </View>
                    })}
                </ScrollView>
            </View>
        )


        this.state.trip.members.forEach(function(member){
            arraySummaries.push({id : i, name : member , categories : {}});
            i++;
        });
        var memberName
        arraySummaries.map((element) => {
            this.state.cats.forEach(function(cat){
                element.categories[cat.id] = cat.name;
            });
            console.log(element);
            memberName = element.member;
            element.categories.map((catEl) => {
                this.state.expenses.forEach(function(expTmp){
                    expTmp.elementPaidBy.map((gnagnagna) =>{
                        if(gnagnagna.selected){
                            if(gnagnagna.name == memberName && expTmp.cat == catEl.id){
                                catEl[expTmp.date] = expTmp
                            }
                        }
                    })
                });
            })
        })
        console.log(arraySummaries);
        return(
        <View>
            <Text>{blabla}</Text>
        </View>)

    }

    */

    buildSheet(){
        var arraySummaries = [];
        var i =0;

        if(this.state.trip.members == undefined || this.state.expenses == undefined){
            return
            <View>
                <Text>{this.state.lang.trip.members}</Text>
            </View>
        }
        //building the base array
        this.state.trip.members.forEach(function(member){
            arraySummaries.push({id : i, name : member , amountPaid : 0, amountDue : 0, total : 0});
            i++;
        });

        this.state.expenses.map((element) => {
            element.summaries.membersPaidBy.map((elementPaidBy) => {
                if(elementPaidBy.selected){
                    arraySummaries.map((mem) => {
                        if(elementPaidBy.name == mem.name){
                            mem.amountPaid += parseInt(this.changeCurr(this.state.curr,element.curr,elementPaidBy.cost));
                            return;
                        }
                    })
                }
            })


            element.summaries.membersPaidFor.map((elementPaidFor) => {
                if(elementPaidFor.selected){
                    arraySummaries.map((mem) => {
                        if(elementPaidFor.name == mem.name){

                            mem.amountDue += parseInt(this.changeCurr(this.state.curr,element.curr,elementPaidFor.cost));
                            return;
                        }
                    })
                }
            })

            arraySummaries.forEach(function(mem){
                console.log("parseInt(mem.amountPaid)");
                console.log(parseInt(mem.amountPaid));
                console.log("parseInt(mem.amountDue)");
                console.log(parseInt(mem.amountDue));

                mem.total = parseInt(mem.amountPaid) - parseInt(mem.amountDue)
                console.log("mem.total");
                console.log(mem.total);
            });

        }) */
        
        return (
            <View style={styles.members_wrapper}>
                <ScrollView >
                    {arraySummaries.map((item) => {
                        return <View key={item.id} style={styles.list_item_flex}>
                            <Text style={styles.list_item_part}>{item.name} </Text>
                            <Text style={styles.list_item_part}>{item.amountPaid} </Text>
                            <Text style={styles.list_item_part}>{item.amountDue} </Text>
                            <Text style={styles.list_item_part}>{item.total} </Text>
                        </View>
                    })}
                </ScrollView>
            </View>
        )
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
                        this.setState({cat: value});
                }}
            >
            {collection.map(item => {
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    totalExpensesOfTrip(){
        if(this.state.new || this.state.expenses == null){
            return
        }
        var total = 0;
        this.state.expenses.map((item) => {
            total += parseInt(this.changeCurr(this.state.curr,item.curr,item.cost));
        })
        
        return( 
            <View>
                <FormLabel>{this.state.lang.summaries.totalCostOfTrip}</FormLabel>
                <Text>{total}</Text>
            </View>
        )
    }

    totalByCat(){
        if(this.state.new || this.state.expenses == null){
            return
        }
        var totalRest = 0;
        var totalTrans = 0;
        var totalGroceries = 0;
        var totalRefound = 0;
        this.state.expenses.map((item) => {
            switch (item.cat) {
                case 1:
                    totalRest += parseInt(this.changeCurr(this.state.curr,item.curr,item.cost));
                    break;
                case 2:
                    totalTrans += parseInt(this.changeCurr(this.state.curr,item.curr,item.cost));
                    break;
                case 3:
                    totalGroceries += parseInt(this.changeCurr(this.state.curr,item.curr,item.cost));
                    break;
                case 4:
                    totalRefound += parseInt(this.changeCurr(this.state.curr,item.curr,item.cost));
                    break;
            }
        })
        //console.log("i am the total");
        //console.log(total);
        return( <View>
                    <FormLabel>{this.state.lang.summaries.totalRest}</FormLabel>
                    <Text>{totalRest}</Text>
                    <FormLabel>{this.state.lang.summaries.totalTrans}</FormLabel>
                    <Text>{totalTrans}</Text>
                    <FormLabel>{this.state.lang.summaries.totalGroceries}</FormLabel>
                    <Text>{totalGroceries}</Text>
                    <FormLabel>{this.state.lang.summaries.totalRefound}</FormLabel>
                    <Text>{totalRefound}</Text>
                </View>)
    }

    changeCurr(changeTo,changeFrom,value){
        if(changeTo == changeFrom){
            return value;
        }
        if(changeTo == undefined && changeFrom == 1){
            return value;
        }
        var dollarValue
        //change to dollar
        switch (changeFrom) {
            case 2:
                dollarValue = value;
                break;
            case 3:
                dollarValue = value*0.783;
                break;
            case 4:
                dollarValue = value*1.352;
                break;
            //if nothing it's not initialased but showing 1, so 1 is default
            default:
                dollarValue = value*1.194;
        }

        switch (changeTo) {
            case 2:
                return dollarValue;
                break;
            case 3:
                return dollarValue*1.277;
                break;
            case 4:
                return dollarValue*0.741;
                break;
            //if nothing it's not initialased but showing 1, so 1 is default
            default:
                return dollarValue*0.838;
        }

    }

    render() {
        return (this.state.loaded) ?
            <ScrollView>
                <FormLabel>{this.state.lang.summaries.currChoices}</FormLabel>
                <View style={styles.combobox}>
                    {this.getComboBox(this.state.currs, "curr")}
                </View>
                <View style={styles.list_title}>
                        <Text style={styles.list_item_part}>{this.state.lang.summaries.name} </Text><Text style={styles.list_item_part}>{this.state.lang.summaries.amountPayed}</Text><Text style={styles.list_item_part}>{this.state.lang.summaries.amountDue}</Text><Text style={styles.list_item_part}>{this.state.lang.summaries.total}</Text>
                </View>
                {this.buildSheet()}
                {this.totalExpensesOfTrip()}
                {this.totalByCat()}
            </ScrollView> :
            <Loader />
    }
}

const styles = StyleSheet.create({
    curr: {
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#8c8c8c",
        borderStyle: "solid"
    },

    input: {
        paddingLeft: 15,
        paddingRight: 15,
        minHeight: 46
    },

    date_container: {
        marginLeft: 20,
        marginRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#8c8c8c",
        borderStyle: "solid"
    },

    input_textarea: {
        height: 70
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

    sub_title_font: {
        fontSize: 18,
        margin: 15,
        marginBottom: 0
    },

    new_member: {
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
    
    new_member_ios: {
        margin: 15,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "dashed",
        borderRadius: 5,
        height: 50,
    },

    date_input: {
        borderWidth: 0,
        alignItems: "flex-start",
        paddingLeft: 10
    },

    modal_wrapper: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },

    modal_container: {
        marginTop: 50,
        alignSelf: "center",
        backgroundColor: "#fff",
        minHeight: 200,
        width: (Dimensions.get("window").width - 50),
        borderRadius: 10
    },

    members_wrapper: {
        marginBottom: 20
    },

    members_list_wrapper: {
        marginTop: 20,
        flex: 1
    },

    flex_1: {
        flex: 1
    },

    modal_title: {
        marginLeft: 20,
        fontSize: 16,
        marginTop: 20
    },

    list_item: {
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        borderBottomColor: "#aaa",
        borderBottomWidth: .5,
    },

    list_title: {
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
    },

    list_item_flex: {
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        borderBottomColor: "#aaa",
        borderBottomWidth: .5,
        flex: 1,
        flexDirection: 'row',
    },

    ScrollView: {
        marginTop: 50,
    },

    list_item_text: {
        flex: 1,
        paddingLeft: 30,
        marginTop: 10,
        fontSize: 18
    },

    list_item_part: {
        flex: 1,
        paddingLeft: 30,
        marginTop: 10,
        fontSize: 18
    },


    list_item_icon: {
        flex: 1,
        position: "absolute",
        right: 10,
        top: 10
    },

    modal_back_button_wrapper: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: "center"
    },
});

const Tab = TabNavigator({
        General: {
            screen: TripScreen,
        },
        Expenses: {
            screen: ExpensesList,
        },
        Summaries: {
            screen: SummariesScreen,
        },
    }, {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        tabBarOptions: {
            iconStyle: {
                width: 40
            },
            showIcon: false,
            inactiveTintColor: "#CECECE",
            style: {
                backgroundColor: "#4C3E54",
                marginTop: 10
            }
        }
    }
);