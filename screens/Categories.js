import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, TouchableHighlight, Alert } from "react-native";
import { Icon, Button, FormValidationMessage, FormInput, FormLabel } from 'react-native-elements'
import Required from '../components/Required';
import updateStorage from '../utils/update_storage';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';

export default class Categories extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            modalVisible: false,
            errName: false,
            name: "",
            loaded: false,
            lang: this.props.screenProps.lang,
            cats: [],
        }
    }

    async componentWillMount(){
        store.get("cats").then(cats => {
            this.setState({ 
                cats: cats,
                loaded: true
            });
        })
    }

    buildList(){
        return <ScrollView>{
            this.state.cats.map((item, index) =>  {
                return (
                    <View key={item.id} style={styles.list_item}>
                        <View style={styles.list_item_info}>
                            <Text>{item.name}</Text>
                        </View>
                        <View style={styles.arrow}>
                            <Icon name='delete-forever' onPress={() => { this._delete(item.id) }} size={32.0}/>
                        </View>
                    </View>
                );
            })
        }</ScrollView>
    }
    
    _delete(index) {
        Alert.alert(
            this.state.lang.cat.remove_title,
            this.state.lang.cat.remove_text,
            [
                {text: this.state.lang.misc.remove_no, style: 'cancel'},
                {text: this.state.lang.misc.remove_yes, onPress: () => { 
                    var cats = this.state.cats;
                    cats.splice(index, 1);
                    
                    this.setState({
                        cats: cats
                    });
                }},
            ],
        );
    }

    _submit(){
        var err = -1;

        if (this.state.name == ""){
            this.setState({errName: true});
            err = 1;
        }
        else {
            this.setState({errName: false});
            err = -1;
        }

        if (err == -1)
        {
            var c = {id: this.state.id, name: this.state.name}
            updateStorage("cats", c, true, null);
            this.setState(prevState => ({
                modalVisible: false,
                cats: [
                    ...this.state.cats,
                    c
                ]
            }))
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
                    <Text style={styles.new_item}>{this.state.lang.cat.new_item}</Text>

                    <FormLabel>{this.state.lang.expense.item_name}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        onChangeText={(name) => this.setState({name: name})}
                        style={styles.input}
                    />
                    { this.state.errName && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit.bind(this)} />
                </View>
            </TouchableHighlight>
        </Modal>
    }

    render(){
        return (
            <View style={{flex: 1}}>
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
        width: 64,
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