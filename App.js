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
            lang: null,
        }
    }

    async componentDidMount() {
        /* uncomment when storage reset needed */
        // resetStorage.trips();
        // resetStorage.expenses();
        // resetStorage.categories();
        dataFeed.currencies();
        dataFeed.spitType();
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

        return (this.state.fontLoaded && this.state.langLoaded) ? <Navigation screenProps={this.state.lang} /> : <Loader />;
    }
};