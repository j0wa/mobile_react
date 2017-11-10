import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Icon, Button, FormValidationMessage, FormInput, FormLabel } from 'react-native-elements'
import lang from "../configs/languages/lang";

const cats = [
    { id: 2, name: "tag fixolas"},
    { id: 3, name: "tag fixolas"},
    { id: 1, name: "tag fixolas"},
    { id: 4, name: "tag fixolas"},
    { id: 5, name: "tag fixolas"},
    { id: 6, name: "tag fixolas"},
    { id: 7, name: "tag fixolas"},
    { id: 8, name: "tag fixolas"},
    { id: 9, name: "tag fixolas"},
]

export default class Categories extends React.Component{
    constructor(props){
        super(props);
    }

    componentWillMount(){
        this.setState({
            errName: false,
            name: ""
        })
    }

    buildList(){
        var items = [];
        
        if (cats == null || cats == ""){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{lang.cat.cats}</Text>
            </View>
        }

        cats.map((item) =>  {
            items.push( 
                <View key={item.id} style={styles.list_item}>
                    <View style={styles.list_item_info}>
                        <Text>{item.name}</Text>
                    </View>
                    <View style={styles.arrow}>
                        <Icon name='delete-forever' onPress={() => { this._delete(item.id) }} size={32.0}/>
                    </View>
                </View>
            );
        });
        
        return <ScrollView>{items}</ScrollView>
    }
    
    buildForm(){
        return (
            <View style={styles.form_wrapper}>
                <View>
                    <Text style={styles.new_item}>{lang.cat.new_item}</Text>
                </View>
                <View style={styles.form_container}>
                    <View style={{flex:5}}>
                        <FormLabel>{lang.expense.item_name}</FormLabel>
                        <FormInput 
                            autoCapitalize="sentences"
                            onChangeText={(name) => this.setState({name})}
                        />
                        {this.state.errName && <FormValidationMessage>{lang.err.required}</FormValidationMessage> }
                    </View>
                    <View style={{width: 40, marginRight: 20}}>
                        <Icon name='add-circle' size={40.0} onPress={() => this._submit} containerStyle={styles.button}/>
                    </View>
                </View>                
            </View>
        );
    }

    _delete(id){
        // confirms deletion and removes
    }

    _submit(){
        var err = -1;

        if (this.state.name == ""){
            this.setState({errName: true});
            err = -1;
        }
        else {
            this.setState({errName: true});
            err = -1;
        }

        if (err == -1){
            // insert 
        }
    }

    render(){
        return (
            <View style={{flex:1, justifyContent: "space-between"}}>
                <View style={{flex: 3.5}}>
                    {this.buildList()}
                </View>
                <View style={{flex: 1}}>
                    {this.buildForm()}
                </View>
            </View>
        );
    }   
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff"
    },

    button: {
        marginBottom: 10,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignSelf: "center"
    },

    list_item: {
        height: 70,
        padding: 10,
        borderBottomWidth: .5,
        borderColor: "#aaa",
        borderStyle: "solid",
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },

    arrow: {
        position: "absolute",
        right: 10,
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
        marginBottom: 10
    },

    new_item: {
        marginLeft: 20,
        fontSize: 16,
        marginTop: 20
    },
});