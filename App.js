import React from 'react';
import { Font } from 'expo';
import { StatusBar } from 'react-native';
import store from 'react-native-simple-store';
import { StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation';
import dataFeed from './data/data_feed';
import resetStorage from './data/reset_storage';
import Loader from './components/Loader';
import Navigation from './components/Navigation';
import lang from "./configs/languages/lang";

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            fontLoaded: false,
            langLoaded: false,
            lang: null
        }

        this.updateLang = this.updateLang.bind(this);
    }

    async componentDidMount() {
        /* uncomment when storage reset needed */
        // resetStorage.trips();
        // resetStorage.expenses();
        // resetStorage.categories();
        // resetStorage.settings();
        // resetStorage.langs();
        dataFeed.currencies();
        dataFeed.spitType();
        dataFeed.categories();
        dataFeed.settings();
        dataFeed.langs();

        await Expo.Font.loadAsync({
            'MaterialIcons': require('./node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
            'SimpleLineIcons': require('./node_modules/react-native-vector-icons/Fonts/SimpleLineIcons.ttf'),
            'FontAwesome': require('./node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf'),
            'Ionicons': require('./node_modules/react-native-vector-icons/Fonts/Ionicons.ttf'),
        });

        await store.get("settings").then(settings => {
            this.updateLang(settings[0].lang, true);
        })

        await store.get("expenses").then(
            expenses => {
                if(expenses == null){
                    store.push("expenses", []);
                }
            }
        )
    }

    updateLang(id){
        this.setState({
            langLoaded: false
        });

        lang.find((item) => {
            if (item.id == id) {
                this.state.lang = item.content;
                
                this.setState({
                    langLoaded: true,
                });
                
                return true;
            }
        });
    }

    render(){
        StatusBar.setHidden(true);

        return (this.state.langLoaded) ? <Navigation screenProps={{lang: this.state.lang, updateLang: this.updateLang}} /> : <Loader />;
    }
};
