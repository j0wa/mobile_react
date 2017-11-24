import React from 'react';
import { Button, Text, View, ScrollView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
import Screens from "./screens/Screens";
import lang from "./configs/languages/lang";
import { Font, AppLoading } from 'expo';
import store from 'react-native-simple-store';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
        }
    }



    async componentDidMount() {
        await Expo.Font.loadAsync({
            'Material Icons': require('./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'simple-line-icons': require('./node_modules/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'FontAwesome': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
            'Ionicons': require('./node_modules/react-native-vector-icons/Fonts/Ionicons.ttf'),
        });
        var infoLang
        await store.get("pref_lang").then(langObj => {
            if(langObj == null){
                infoLang = lang[0]["content"]
            }else{
                for (var i = 0; i < lang.length; i++) {
                    if (lang[i]["id"] == langObj.langId) {
                        infoLang = lang[i]["content"];
                    }
                }
            }

        })
        await store.delete('trip_list')
        const trip1 = {
            id:1,
            name:'trip1',
            currency: 'eu',
            location:'ddc',
            date:'17-11-17',
            members:[
                {
                    id:1,
                    name:'Jean Kul',
                },
                {
                    id:2,
                    name:'Jean Merde',
                }
            ],
            description:'this is a trip',
            category:'food',
        }
        const trip2 = {
            id:2,
            name:'trip1',
            currency: 'eu',
            location:'ddc',
            date:'17-11-17',
            members:[
                {
                    id:1,
                    name:'Jean Kul',
                },
                {
                    id:2,
                    name:'Jean Merde',
                }
            ],
            description:'this is a trip',
            category:'food',
        }
        await store.push('trip_list',trip1);
        await store.push('trip_list',trip2);
        this.setState({
            fontLoaded: true,
            lang: infoLang,
        })

    }

    render(){
        StatusBar.setHidden(true);


        return (this.state.fontLoaded) ? <Menu screenProps={this.state.lang} /> : <AppLoading/>;
    }
}

const StackNav =  StackNavigator({
    Home: {
        screen: Screens.Home,
    },
    TripsList: {
        screen: Screens.TripsList,
    },
    Trips: {
        screen: Screens.Trips,
    },
    ExpensesList: {
        screen: Screens.ExpensesList,
    },
    Expenses: {
        screen: Screens.Expenses,
    },
    Settings: {
        screen: Screens.Settings,
    }
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

const Menu = DrawerNavigator({
    Home: {
        screen: StackNav,
    },
    TripsList: {
        screen: StackNav,
    },
    ExpensesList: {
        screen: StackNav,
    },
    Settings: {
        screen: StackNav,
    },
},{
    drawerPosition: "right",
    drawerWidth: 200,
    contentComponent: props => <ScrollView><DrawerItems {...props}/></ScrollView>,
});
