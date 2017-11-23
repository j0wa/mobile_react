import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, TouchableHighlight, Platform, Alert } from "react-native";
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

        this.state = {
            modalVisible: false,
            errName: false,
            name: "",
        }
    }

    componentWillMount(){
        this.setState({
            errName: false,
            name: "",
            modalVisible: false
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
    
    _delete(id){
        Alert.alert(
            lang.cat.remove_title,
            lang.cat.remove_text,
            [
                {text: lang.misc.remove_no, style: 'cancel'},
                {text: lang.misc.remove_yes, onPress: () => { alert("item removed") } },
            ],
        );
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

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    buildButton(){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => this.setModalVisible(true)}/>
        </View>
    }

    buildModal(){
        return <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false) }}
        >
            <TouchableHighlight style={styles.modal_wrapper} onPress={() => { this.setModalVisible(false) }}>
                <View style={styles.modal_container}>
                    <Text style={styles.new_item}>{lang.cat.new_item}</Text>

                    <FormLabel>{lang.expense.item_name}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        onChangeText={(name) => this.setState({name: name})}
                        style={styles.input}
                    />
                    { this.state.errName && <FormValidationMessage>{lang.err.required}</FormValidationMessage> }

                    <Button title={lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit.bind(this)} />
                </View>
            </TouchableHighlight>
        </Modal>
    }

    render(){
        return (
            <View>
                {this.buildModal()}
                {this.buildList()}
                {this.buildButton()}
            </View>  
        );
    }   
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff"
    },

    btnContainer: {
        marginTop: 10, 
        marginBottom: 10
    },
    
    btnStyle: {
        borderRadius: 5
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

    modal_wrapper: {
        flex: 1, 
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    },

    modal_container: {
        marginTop: 50,
        alignSelf: "center",
        backgroundColor: "#fff",
        minHeight: 200,
        width: (Dimensions.get("window").width - 50),
        borderRadius: 10
    },
});