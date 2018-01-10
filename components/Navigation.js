import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

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
            lang: this.props.screenProps.lang,
            update: this.props.screenProps.updateLang
        }
    }

    render(){
        var menu_option = {
            optionWrapper: {
                padding: 15
            }
        }

        var Stack = StackNavigator({
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
                headerRight: <Menu>
                    <MenuTrigger>
                        <Icon name='menu' iconStyle={{width: 10, marginRight: 20}} size={48} color="#fff" />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption customStyles={menu_option} onSelect={() => {
                                if (navigation.state.routeName !== "Categories")
                                    navigation.navigate("Categories") 
                            }} text={this.state.lang.cat.title} 
                        />
                        <MenuOption customStyles={menu_option} onSelect={() => {
                                if (navigation.state.routeName !== "Settings")
                                    navigation.navigate("Settings")
                            }} text={this.state.lang.setting.title} 
                        />
                    </MenuOptions>  
                </Menu>,
                
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

        return <MenuProvider>
            <Stack screenProps={{lang: this.state.lang, updateLang: this.state.update}} />
        </MenuProvider>
    }
}