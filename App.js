import React from 'react';
import { Button, Text, View, ScrollView, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements'
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
import Screens from "./screens/Screens";
import lang from "./configs/languages/lang";
import { Font } from 'expo';
import store from 'react-native-simple-store';
import dataFeed from './data/data_feed';
import resetStorage from './data/reset_storage';
import Loader from './components/Loader';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fontLoaded: false,
            langLoaded: false,
            lang: null,
        }
    }

    async componentDidMount() {
        /* uncomment when storage reset needed */
        // resetStorage.trips();
        // resetStorage.expenses();
        // resetStorage.categories();
        dataFeed.currencies();
        dataFeed.expenseType();
        dataFeed.categories();

        await Expo.Font.loadAsync({
            'MaterialIcons': require('./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'SimpleLineIcons': require('./node_modules/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'FontAwesome': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
            'Ionicons': require('./node_modules/react-native-vector-icons/Fonts/Ionicons.ttf'),
        });

        var infoLang
        await store.get("pref_lang").then(langObj => {
            if (langObj != null) {
                lang.find((item) => {
                    if (item.id == langObj.langId) {
                        infoLang = item.content;
                        return;
                    }
                }) 
            } else {
                infoLang = lang[0]["content"]
            }
        })

        this.setState({
            fontLoaded: true,
            langLoaded: true,
            lang: infoLang,
        });
    }

    render(){
        StatusBar.setHidden(true);

        return (this.state.fontLoaded && this.state.langLoaded) ? <Menu screenProps={this.state.lang} /> : <Loader />;
    }
};



const StackNav =  StackNavigator({
    Trips: {
        screen: Screens.TripsList,
    },
    TripsItem: {
        screen: Screens.Trips,
        path: 'trips/:derp',
    },
    Expenses: {
        screen: Screens.ExpensesList,
    },
    ExpensesItem: {
        screen: Screens.Expenses,
    },
    Settings: {
        screen: Screens.Settings,
    },
    Categories: {
        screen: Screens.Categories,
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

const Menu = DrawerNavigator({
    Trips: {
        screen: StackNav,
    },
    Expenses: {
        screen: StackNav,
    },
    Settings: {
        screen: StackNav,
    },
    Categories: {
        screen: StackNav,
    },
},{
    drawerPosition: "right",
    drawerWidth: 200,
    contentComponent: props => <ScrollView><DrawerItems {...props}/></ScrollView>,
});