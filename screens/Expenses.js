import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Divider, Button, FormValidationMessage, FormInput, FormLabel, Tile } from 'react-native-elements'
import { View, Text, StyleSheet, Picker, PickerIOS, ScrollView, Platform, Image, Window } from "react-native";
import lang from "../configs/languages/lang";

export default class Expenses extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return <Tab/>;
    }
}

const types = [
    {id: 1, name: "Half"},
    {id: 2, name: "Each"}
];

const currs = [
    {id: 1, name: "euro"},
    {id: 2, name: "dolar"}
];

const cats = [
    {id: 1, name: "Food"},
    {id: 2, name: "Transport"}
];

class GeneralScreen extends React.Component {  
    constructor(props){
        super(props);

        this._submit = this._submit.bind(this)
    }

    componentWillMount(){
        this.setState({
            date: new Date(),
            type: 1,
            curr: 1,
            category: 1,
            errReceiver: false,
            errMembers: false,
            receiver: "",
            location: "",
            members: "",
            notes: "",
        });
    }
    
    getComboBox(collection, stateItem){
        var items = [];
        
        collection.map((item) => {
            items.push(
                <Picker.Item label={item.name} value={item.id} key={item.id}/>
            );
        })

        if (Platform.OS === "ios"){
            return <PickerIOS selectedValue={this.state[stateItem]}
                onValueChange={(itemValue, itemIndex) => this.setState({stateItem: itemValue})}>
                {items}
            </PickerIOS>
        }
        else {
            return <Picker selectedValue={this.state[stateItem]}
                onValueChange={(itemValue, itemIndex) => this.setState({stateItem: itemValue})}>
                {items}
            </Picker>
        }
    }

    _submit(){
        var err = -1;

        if (this.state.receiver == "") {
            this.setState({ errReceiver: true });
            err = 1;
        } else {
            this.setState({ errReceiver: false });
        }

        if (this.state.members == "") {
            this.setState({ errMembers: true });
            err = 1;
        } else {
            this.setState({ errMembers: false });
        }
        
        if (err == -1)
            alert("expense registered (NOT!)");
    }

    formatDate(timestamp){
        var tmp = new Date(timestamp);
        var day = tmp.getDate();
        var month = tmp.getMonth() + 1;
        var hours = tmp.getHours();
        var minutes = tmp.getMinutes();

        day = (day >= 10) ? day : "0" + day;
        month = (month >= 10) ? month : "0" + month;
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = (minutes >= 10) ? minutes : "0" + minutes;

        return hours + ":" + minutes + "  " + day + "/" + month + "/" + tmp.getFullYear();
    }

    render() {
        var infoLang = lang.expense;

        return (
            <ScrollView style={{paddingBottom: 60}}>
                <View style={styles.title}>
                    <Text style={styles.title_font}>{infoLang.info_title}</Text>
                </View>

                <Divider style={styles.divider} />

                <View>
                    {/* receiver */}
                    <FormLabel>{infoLang.receiver}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences" 
                        editable={this.props.new} 
                        style={styles.input} 
                        onChangeText={(receiver) => this.setState({receiver})} 
                    />
                    {this.state.errReceiver && <FormValidationMessage>{lang.err.required}</FormValidationMessage> }

                    {/* split type */}
                    <FormLabel>{infoLang.types}</FormLabel>
                    <View style={styles.combobox}>  
                        {this.getComboBox(types, "type")}
                    </View>
                    
                    {/* currencies */}
                    <FormLabel>{lang.misc.curr}</FormLabel>
                    <View style={styles.combobox}>  
                        {this.getComboBox(currs, "curr")}
                    </View>
                    
                    {/* expense date */}
                    <FormLabel>{infoLang.date}</FormLabel>
                    <FormInput
                        editable={false}
                        value={this.formatDate(this.state.date.getTime())}
                        style={styles.input}
                    />
                    
                    {/* category */}
                    <FormLabel>{lang.misc.curr}</FormLabel>
                    <View style={styles.combobox}>  
                        {this.getComboBox(cats, "category")}
                    </View>

                    {/* location */}
                    <FormLabel>{infoLang.location}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        editable={this.props.new} 
                        style={styles.input}
                        onChangeText={(location) => this.setState({location})} 
                    />
                    {this.state.errLocation && <FormValidationMessage>{lang.err.required}</FormValidationMessage> }

                    {/* list of people */}
                    <FormLabel>{infoLang.members}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        editable={this.props.new} 
                        style={styles.input}
                        onChangeText={(members) => this.setState({members})} 
                    />
                    {this.state.errMembers && <FormValidationMessage>{lang.err.required}</FormValidationMessage> }

                    {/* notes */}
                    <FormLabel>{infoLang.notes}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        editable={this.props.new} 
                        multiline={true} 
                        autoGrow={true} 
                        onChangeText={(notes) => this.setState({notes})} 
                        style={StyleSheet.flatten([styles.input, styles.input_textarea])}
                    />

                    <Button title={lang.misc.btn} style={styles.btn} onPress={this._submit} />
                </View>
            </ScrollView>
        );
    }
}

const items = [
    {id: 1, name: "water", price: "1.50"},
    {id: 2, name: "beef", price: "1.50"},
    {id: 3, name: "cake", price: "1.50"},
    {id: 4, name: "pasta", price: "1.50"},
]

class ItemsScreen extends React.Component { 
    constructor(props){
        super(props);
    }
    
    buildList(){
        var tmp = [];
        
        if (items == null || items == "" || items == undefined)
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{lang.expense.no_expenses}</Text>
            </View>

        items.map((item) => {
            tmp.push(
                <View key={item.id} style={styles.list_item}>
                    <View style={styles.list_item_info}>
                        <Text>{item.name}</Text>
                        <Text>{item.price}</Text>
                    </View>
                </View>
            );
        })

        return <ScrollView>{tmp}</ScrollView>        
    }

    buildForm(){
        return (
            <View>
                <Divider style={styles.divider} />
                <View>
                    <Text style={{marginLeft: 20, fontSize: 16, marginTop: 10}}>{lang.expense.new_item}</Text>
                </View>
                <View style={{flexDirection:'row', width: window.width }}>
                    <View style={{flex:4}}>
                        <FormLabel>{lang.expense.item_name}</FormLabel>
                        <FormInput 
                            autoCapitalize="sentences"
                            onChangeText={(item_name) => this.setState({item_name})}
                        />
                    </View>
                    <View style={{flex:4}}>
                        <FormLabel>{lang.expense.item_price}</FormLabel>
                        <FormInput 
                            autoCapitalize="sentences"
                            onChangeText={(item_price) => this.setState({item_price})}
                        />
                    </View>
                    
                    <Icon name='add-circle' size={40.0} onPress={() => console.log("add some new item")} containerStyle={styles.item_add}/>
                </View>
            </View>
        );
    }

    render(){
        return (
            <View>
                <View style={styles.title}>
                    <Text style={styles.title_font}>{lang.expense.items}</Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View>
                    {this.buildList()}
                    {this.buildForm()}
                </View>
            </View>
        );
    }   
}

const imgs = [
    {id: 1, caption: "receipt", img: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"},
    {id: 2, caption: "something", img: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"},
    {id: 3, caption: "or other", img: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"}
]

class GalaryScreen extends React.Component {  
    constructor(props){
        super(props);
    }
    
    buildGallery(){
        if (imgs == null || imgs == "" || imgs == undefined){
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{lang.expense.no_img}</Text>
            </View>
        }

        var items = [];

        imgs.map((item) =>  {
            items.push(
                <View key={item.id} style={styles.galery_item}>
                    <Image source={{uri: item.img}} style={styles.galery_image}/>
                    <Text style={styles.galery_caption}>{item.caption}</Text>
                </View>
            );
        });

        return <ScrollView style={styles.galery_wrapper}>{items}</ScrollView>
    }

    buildButton(){
        return <View style={styles.galery_button}>
            <Icon name='add-circle' size={64.0} onPress={() => console.log("someone add new photo")} />
        </View>
    }

    render() {
        return (
            <View>
                <View style={styles.title}>
                    <Text style={styles.title_font}>{lang.expense.galary}</Text>
                </View>
                <Divider style={styles.divider} />

                {this.buildGallery()}
                
                {this.buildButton()}
            </View>
        );
    }
}

const Tab = TabNavigator({
    Home: {
        screen: GeneralScreen,
        navigationOptions :{
            showLabel: false,
            tabBarIcon: ({ tintColor }) => (
                <Icon name='info-outline' color="#fff"/>
            )
       }
    },
    Items: {
        screen: ItemsScreen,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='format-list-bulleted' color="#fff"/>
            )
        }
    },
    Galary: {
        screen: GalaryScreen,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name='image' color="#fff"/>
            )
        }
    },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
        iconStyle: {
            width: 40
        },
        showIcon: true,
        showLabel: false,
        inactiveTintColor: "#303030",
        style: { 
            backgroundColor: "#4C3E54",
            marginTop: 10
        }
    },
});

const styles = StyleSheet.create({
    items_input: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    list_item: {
        padding: 40,
        height: 30,
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
    
    item_input: {
        paddingLeft: 15,
        paddingRight: 50,
        minHeight: 46
    },

    item_add: {
        position: "absolute",
        right: 15, 
        top: 30
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

    galery_item: {
        height: 200,
        marginBottom: 20,
        borderBottomWidth: .5,
        borderColor: "#aaa",
        borderStyle: "solid",
        flex: 1,
        justifyContent: "space-between"
    },

    galery_image: {
        height: 150, 
        resizeMode: "cover"
    },
        
    galery_caption: {
        marginTop: 10,
        alignSelf: "center",
        alignContent:"center",
        fontSize: 20,
        marginBottom: 10
    },
    
    galery_button: {
        marginBottom: 10,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 60,
        alignSelf: "center"
    },
    
    galery_wrapper: {
        marginBottom: 60,
        marginTop: 20
    },
});