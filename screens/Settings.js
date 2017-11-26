import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Divider, Button, FormValidationMessage, FormInput, FormLabel, Tile } from 'react-native-elements'
import { View, Text, StyleSheet, Picker, PickerIOS, ScrollView, Platform, Image, Dimensions, CameraRoll, PermissionsAndroid, ActivityIndicator } from "react-native";
import { PhotoGrid } from 'react-native-photo-grid-frame';
import lang from "../configs/languages/lang";
import store from 'react-native-simple-store';

export default class Settings extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true
        }
    }

    async componentDidMount(){
        var infoLang = this.props.screenProps
        this.setState({isLoading: false,lang: infoLang})
    }

    setPrefferedLanguage(index){
        console.log("index enterred "+ index);
        this.setState({pref_lang: index})
        store.update('pref_lang',{langId:index})
        console.log("langId updated to "+index)
    }

    getComboBox(collection, stateItem){
        var items = [];

        collection.map((item) => {
            items.push(
                <Picker.Item label={item.name} value={item.id} key={item.id}/>
            );
        })

        if (Platform.OS === "ios"){
            return <PickerIOS selectedValue={this.state.pref_lang}
                onValueChange={(itemValue, itemIndex) => this.setPrefferedLanguage(itemValue)}>
                {items}
            </PickerIOS>

        }
        else {
            return <Picker selectedValue={this.state.pref_lang}
                onValueChange={(itemValue, itemIndex) => this.setPrefferedLanguage(itemValue)}>
                {items}
            </Picker>
        }
    }

    delEverything(){
        store.delete("expenses");
        store.delete("currencies");
        store.delete("splitType");
        store.delete("categories");
        store.delete("pref_lang");
        store.delete("trips");
        console.log("everythong deleted");
    }

    render(){
            if (this.state.isLoading) {
                return (
                    <View style={{flex: 1, paddingTop: 20}}>
                        <ActivityIndicator />
                    </View>
                );
            }else {
                return(
                    <ScrollView style={{paddingBottom: 60}}>
                        <View>
                            <FormLabel>{this.state.lang.setting.lang_select}</FormLabel>
                            <View style={styles.combobox}>
                                {this.getComboBox(lang, "type")}
                            </View>
                            <Button title={this.state.lang.setting.delete_everything} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={() => { this.delEverything() }} />
                        </View>
                    </ScrollView>
                )
            }

    }
}

const styles = StyleSheet.create({

    btnContainer: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 50,
        marginRight: 50,
    },

    btnStyle: {
        borderRadius: 5
    },

    list_item: {
        padding: 25,
        borderBottomWidth: .5,
        borderColor: "#aaa",
        borderStyle: "solid",
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },

    list_item_info: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row"
    },

    arrow: {
        flex: 0,
        alignItems: "center",
        alignSelf: "center"
    },

    empty_text:{
        fontSize: 18,
        textAlign: "center"
    },

    empty:{
        alignSelf: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 30,
        marginRight: 30
    },

    title: {
        alignItems:"center",
        justifyContent:"center",
        marginBottom: 20,
        marginTop: 20
    },

    title_font: {
        fontSize: 24
    },

    divider: {
        backgroundColor: '#4db8ff',
        marginLeft: 10,
        marginRight: 10
    },

    combobox: {
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

    form_wrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 5,
        borderRadius: 2,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 1
    },

    form_container: {
        flexDirection:'row',
        width: Dimensions.get("window").width,
        marginBottom: 50
    },

    new_item: {
        marginLeft: 20,
        fontSize: 16,
        marginTop: 10
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

    button: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignSelf: "center"
    },
});
