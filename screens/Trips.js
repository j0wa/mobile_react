import React from 'react';
import { Icon, Divider, Badge, Button, FormValidationMessage, FormInput, FormLabel } from 'react-native-elements'
import { TabNavigator } from 'react-navigation';
import { View, Text, StyleSheet, Picker, PickerIOS, ScrollView, Platform,ActivityIndicator } from "react-native";
import DatePicker from 'react-native-datepicker';
import lang from "../configs/languages/lang";
import store from 'react-native-simple-store';

export default class Trips extends React.Component {
    constructor(props){
        super(props);
    }
    componentWillMount(){
        this.setState({
            isLoading: true,
        });
    }

    async componentDidMount(){
        var listContent = await store.get("trip_list").then(tripList => {
            if(tripList == null){
                return false;
            }else{
                return tripList;
            }
        })
        var affichedId = this.props.navigation.state.params.id;
        var content
        for (var i = 0; i < listContent.length; i++) {
            if (listContent[i]["id"] == affichedId) {
                content = listContent[i];
            }
        }
        console.log(content);
        var infoLang = this.props.screenProps
        this.setState({isLoading: false,lang: infoLang,content:content})
    }

    render(){
        if(this.state.isLoading){
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }else{
            return (<Tab screenProps={this.props.screenProps}/>)
        }
    }
}

const currs = [
    {id: 1, name: "euro", img: ""},
    {id: 2, name: "dolar", img: ""}
];

class TripScreen extends React.Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
        this.setState({
            date: new Date(),
            curr: 1,
            errLocation: false,
            errMembers: false,
            errDesc: false,
            location: "",
            members: "",
            desc: "",
            isLoading: true,
        });
    }

    componentDidMount(){
        var infoLang = this.props.screenProps
        this.setState({isLoading: false,lang: infoLang})
    }

    getCurrencies(){
        var items = [];

        currs.map((item) => {
            items.push(
                <Picker.Item label={item.name} value={item.id} key={item.id}/>
            );
        })

        if (Platform.OS === "ios"){
            return <PickerIOS selectedValue={this.state.curr}
                onValueChange={(itemValue, itemIndex) => this.setState({curr: itemValue})}>
                {items}
            </PickerIOS>
        }
        else {
            return <Picker selectedValue={this.state.curr}
                onValueChange={(itemValue, itemIndex) => this.setState({curr: itemValue})}>
                {items}
            </Picker>
        }
    }

    _submit(){
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
    }

    render(){

        if(this.state.isLoading){
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }else{return (
            <ScrollView style={{ marginBottom: 20}}>
                <View style={styles.title}>
                    <Text style={styles.title_font}>{this.state.lang.trip.info_title}</Text>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <FormLabel>{this.state.lang.misc.curr}</FormLabel>
                    <View style={styles.curr}>
                        {this.getCurrencies()}
                    </View>

                    <FormLabel>{this.state.lang.trip.location}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.props.new}
                        style={styles.input}
                        onChangeText={(location) => this.setState({location})}
                    />
                    {this.state.errLocation && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <FormLabel>{this.state.lang.trip.date}</FormLabel>
                    <View style={styles.date_container}>
                        <DatePicker
                            date={this.state.date}
                            mode="date"
                            placeholder="select date"
                            minDate={new Date()}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            format="DD-MM-YYYY"
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                    alignItems: "flex-start",
                                    paddingLeft: 10
                                }
                            }}
                            onDateChange={(date) => {this.setState({date: date})}}
                        />
                    </View>

                    <FormLabel>{this.state.lang.trip.members}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.props.new}
                        style={styles.input}
                        onChangeText={(members) => this.setState({members})}
                    />
                    {this.state.errMembers && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <FormLabel>{this.state.lang.trip.desc}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.props.new}
                        multiline={true}
                        autoGrow={true}
                        onChangeText={(desc) => this.setState({desc})}
                        style={StyleSheet.flatten([styles.input, styles.input_textarea])}
                    />
                    {this.state.errDesc && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <Button title={this.state.lang.misc.btn} /*style={styles.btn}*/ onPress={this._submit.bind(this)} />
                </View>
            </ScrollView>
            );
        }
    }
}

class ExpensesScreen extends React.Component {
    render() {
        return (
            <Button
                onPress={() => this.props.navigation.goBack()}
                title="Go back home"
            />
        );
    }
}

const styles = StyleSheet.create({
    title: {
        alignItems:"center",
        justifyContent:"center",
        marginBottom: 20
    },

    title_font: {
        fontSize: 24
    },

    divider: {
        backgroundColor: '#4db8ff',
        marginLeft: 10,
        marginRight: 10
    },

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

    btn: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10
    },
});

const Tab = TabNavigator({
        Home: {
            screen: TripScreen,
            navigationOptions :{
                showLabel: false,
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='info' type="simple-line-icon" color="#fff"/>
                )
           }
        },
        Expenses: {
            screen: ExpensesScreen,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name='wallet' type="simple-line-icon" color="#fff"/>
                )
            }
        },
    }, {
        tabBarPosition: 'bottom',
        animationEnabled: true,
        tabBarOptions: {
            iconStyle: {
                width: 40
            },
            activeTintColor: '#e91e63',
            showIcon: true,
            showLabel: false
        },
    }
);
