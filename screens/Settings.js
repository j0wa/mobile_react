import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Divider, Button, FormValidationMessage, FormInput, FormLabel, Tile } from 'react-native-elements'
import { View, Text, StyleSheet, Picker, PickerIOS, ScrollView, Platform, Image, Dimensions, CameraRoll, PermissionsAndroid, ActivityIndicator, Alert } from "react-native";
import { PhotoGrid } from 'react-native-photo-grid-frame';
import lang from "../configs/languages/lang";
import store from 'react-native-simple-store';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import Loader from '../components/Loader';
import updateStorage from '../utils/update_storage';

export default class Settings extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            loaded: false,
            lang: this.props.screenProps,
            selectedCurr: 1,
            selectedLang: 1
        }
    }

    async componentWillMount(){
        store.get("currencies").then(
            (currs) => {
                this.setState({
                    availableCurrs: currs
                });
            }
        );

        store.get("langs").then(
            (langs) => {
                this.setState({
                    availableLangs: langs
                });
            }
        );

        store.get("settings").then(item => {
            this.setState({ 
                selectedCurr: item[0].curr,
                selectedLang: item[0].lang,
                loaded: true
            });
        })
    }

    updateSettings(type, value) {
        this.setState({
            [type]: value 
        })

        var tmp = {};
        var message = ""
        if (type === "selectedLang"){
            tmp = { lang: value, curr: this.state.selectedCurr }
            message = this.state.lang.setting.updated_text; 
        }
        else {
            tmp = { lang: this.state.selectedLang, curr: value }
            message = this.state.lang.setting.updated_text_restart
        }

        updateStorage("settings", tmp, false, () => {
            Alert.alert(
                this.state.lang.setting.updated_title,
                message
                [
                    {text: this.state.lang.setting.updated }
                ],
            );
        });
    }

    getComboBox(collection, stateItem){
        var items = [];

        if (!collection || collection == "" || collection == [] || collection == null)
            return;

        return <ComboBox
                selectedValue={this.state[stateItem]}
                onValueChange={(value) => this.updateSettings(stateItem, value)}
                style={styles.combobox}
            >
            {collection.map(item => {
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    buildScreen() {
        return <ScrollView style={styles.container}>
            <FormLabel>{this.state.lang.setting.lang_select}</FormLabel>
            {this.getComboBox(this.state.availableLangs, "selectedLang")}

            <FormLabel>{this.state.lang.setting.curr_select}</FormLabel>
            {this.getComboBox(this.state.availableCurrs, "selectedCurr")}
        </ScrollView>
    }

    render(){
        return this.state.loaded ? this.buildScreen() : <Loader/>;
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    },

    combobox: {
        marginLeft: 20,
        marginRight: 20
    }
});
