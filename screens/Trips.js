import React from 'react';
import { Icon, FormLabel, FormInput, Divider, Badge, Button, FormValidationMessage} from 'react-native-elements'
import { TabNavigator } from 'react-navigation';
import { View, Text, StyleSheet, Picker, ScrollView } from "react-native";
import DatePicker from 'react-native-datepicker';
import Card from "../components/Card";
import lang from "../configs/languages/lang";

export default class Trips extends React.Component {
    static navigationOptions = {
        title: lang.trip.details
    };

    constructor(props){
        super(props);
    }

    render(){
        return <Tab/>;
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
            date: new Date()
        });
    }    
    
    getCurrencies(){
        let items = [];
        
        currs.map((item) => {
            items.push(
                <Picker.Item label={item.name} value={item.id} key={item.id}/>
            );
        })

        return <Picker>
            {items}
        </Picker>
    }

    submit(){
        
    }

    static navigationOptions = {
        showLabel: false,
        tabBarIcon: ({ tintColor }) => (
            <Icon name='info' type="simple-line-icon" color="#fff"/>
        ),
    };

    render(){
        let infoLang = lang.trip;

        return (
            <ScrollView style={{ marginBottom: 20}}>
                <View style={styles.title}>
                    <Text style={styles.title_font}>{infoLang.title}</Text>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <FormLabel>{lang.misc.curr}</FormLabel>
                    <View style={styles.curr}>
                        {this.getCurrencies()}
                    </View>
                    
                    <FormLabel>{infoLang.location}</FormLabel>
                    <FormInput autoCapitalize="sentences" editable={this.props.new} style={styles.input}/>
                    <FormValidationMessage>{lang.err.required}</FormValidationMessage>
                    
                    <FormLabel>{infoLang.date}</FormLabel>
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
                    
                    <FormLabel>{infoLang.members}</FormLabel>
                    <FormInput autoCapitalize="sentences" editable={this.props.new} style={styles.input} />
                    
                    <FormLabel>{infoLang.desc}</FormLabel>
                    <FormInput autoCapitalize="sentences" editable={this.props.new} multiline={true} autoGrow={true} style={StyleSheet.flatten([styles.input, styles.input_textarea])}/>
                    
                    <Button title={lang.misc.btn} style={styles.btn} onPress={this.submit} />
                </View>
            </ScrollView>
        );
    }
}

class ExpensesScreen extends React.Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Icon name='wallet' type="simple-line-icon" color="#fff"/>
        ),
    };
  
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
        },
        Expenses: {
            screen: ExpensesScreen,
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