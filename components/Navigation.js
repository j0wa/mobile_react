import React from 'react';
import { ScrollView } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';

import Trips from "../screens/Trips";
import TripsList from "../screens/TripsList";
import ExpensesList from "../screens/ExpensesList";
import Expenses from "../screens/Expenses";
import Settings from "../screens/Settings"
import Categories from "../screens/Categories";


export default class Navigation extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            lang: this.props.screenProps
        }
    }

    render(){
        var stack = StackNavigator({
            Trips: {
                screen: TripsList,
                navigationOptions: {
                    title: this.state.lang.trip.title
                }
            },
            TripsItem: {
                screen: Trips,
                navigationOptions: {
                    title: this.state.lang.trip.details
                }
            },
            Expenses: {
                screen: ExpensesList,
                navigationOptions: {
                    title: this.state.lang.expense.title
                }
            },
            ExpensesItem: {
                screen: Expenses,
                navigationOptions: {
                    title: this.state.lang.expense.details
                }
            },
            Settings: {
                screen: Settings,
                navigationOptions: {
                    title: this.state.lang.setting.title
                }
            },
            Categories: {
                screen: Categories,
                navigationOptions: {
                    title: this.state.lang.cat.title
                }
            },
        }, {
            navigationOptions: ({navigation}) => ({
                headerMode: "float",
                headerRight: <Icon name='menu' size={48} color="#fff" onPress={() => navigation.navigate("DrawerOpen") } />,
                headerStyle: {
                    backgroundColor: '#4C3E54',
                    overflow: "visible"
                },
                headerTitleStyle: {
                    color: "#fff"
                },
                cardStyle: {
                    color: "#fff"
                },
                headerBackTitleStyle: {
                    color: "#fff"
                },
                headerTintColor: "#fff"
            })
        });

        var Drawer = DrawerNavigator({
            Trips: {
                screen: stack,
                navigationOptions: {
                    title: this.state.lang.trip.title
                }
            },
            Settings: {
                screen: stack,
                navigationOptions: {
                    title: this.state.lang.setting.title
                }
            },
            Categories: {
                screen: stack,
                navigationOptions: {
                    title: this.state.lang.cat.title
                }
            },
        },{
            drawerPosition: "right",
            drawerWidth: 200,
            contentComponent: props => <ScrollView><DrawerItems {...props}/></ScrollView>,
        });

        return <Drawer screenProps={this.state.lang}/>
    }
}