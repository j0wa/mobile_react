import React from 'react';
import { Icon, Button, FormValidationMessage, FormInput, FormLabel } from 'react-native-elements'
import { TabNavigator } from 'react-navigation';
import { View, Text, StyleSheet, ScrollView, TouchableNativeFeedback, Dimensions, Modal, Alert, TouchableHighlight } from "react-native";
import DatePicker from 'react-native-datepicker';
import ExpensesList from "./ExpensesList";
import Loader from '../components/Loader';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import Required from '../components/Required';
import updateStorage from '../utils/update_storage';
import store from 'react-native-simple-store';

export default class Trips extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            loaded: false,
        }
    
        this.updateExpenses = this.updateExpenses.bind(this);
    }

    updateExpenses(exp){
        this.setState({ expenses: exp });        
    }

    // faz o async aqui e depois manda os items por params para os ecrãs
    async componentWillMount(){
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
                expenses: trip.expenses || {},
                summaries: trip.summaries || {},
                info: Object.keys(trip).length != 0 ? {
                    location: trip.location,
                    date: trip.date,
                    curr: trip.curr,
                    members: trip.members,
                    desc: trip.desc,
                    id: id                        
                } : {
                    id: id
                },
                loaded: true,
            });
        })
    }

    render(){
        return this.state.loaded ? <Tab screenProps={{
            navigation: this.props.navigation,
            lang: this.props.screenProps,
            new: this.props.navigation.state.params.new,
            info: this.state.info,
            summaries: this.state.summaries,
            updateTrips: this.props.navigation.state.params.updateTrips,
            updateExpenses: this.updateExpenses,
        }} /> : <Loader/>;
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
        }

        this._submit_new_member = this._submit_new_member.bind(this)
        this._delete_member = this._delete_member.bind(this)
        this._submit = this._submit.bind(this)
    }

    async componentWillMount(){
        store.get("currencies").then(
            (currs) => {
                var trip = this.state.trip; 
                
                this.setState({ 
                    currs: currs,
                    date: trip.date || new Date(),
                    members: trip.members || [],
                    curr: trip.curr || 1,
                    loaded: true,
                    location: trip.location || "",
                    date: trip.date || new Date(),
                    id: this.props.screenProps.info.id
                });
            }
        );
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

        if (this.state.desc == "") {
            this.setState({ errDesc: true });
            err = 1;
        } else {
            this.setState({ errDesc: false });
        }
        
        if (err === -1){
            var t = {
                id: this.state.id,
                location: this.state.location,
                date: this.state.date,
                curr: this.state.curr,
                members: this.state.members,
                desc: this.state.desc,
            };

            updateStorage("trips", t, this.state.new, () => {
                this.props.screenProps.updateTrips(t);  
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
            this.setState(prevState => ({
                members: [...prevState.members, this.state.memberName],
                modalVisible: false,
                memberName: ""
            }));
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
                    members.splice(0, 1);
                    
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
                <FormLabel>{this.state.lang.trip.members} <Required /></FormLabel>
                
                <TouchableNativeFeedback onPress={() => { this.setModalVisible(true) }} >
                    <FormLabel containerStyle={styles.new_member}>{this.state.lang.trip.new_member}</FormLabel>
                </TouchableNativeFeedback>

                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.members != "" && this.state.members.map((item, index) => {
                        return <View key={index} style={styles.list_item}>
                            <Text key={index} style={styles.list_item_text}>{item}</Text>
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
            <TouchableHighlight style={styles.modal_wrapper} onPress={() => { this.setModalVisible(false) }}>
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
                </View>
            </TouchableHighlight>
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
                    value={this.state.desc}
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
    render() {
        return (
            <View><Text>THE SUMMARIES WILL BE DISPLAYED HERE</Text></View>
        );
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

    list_item_text: {
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
