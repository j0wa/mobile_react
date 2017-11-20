import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Button, FormValidationMessage, FormInput, FormLabel, CheckBox } from 'react-native-elements'
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, CameraRoll, PermissionsAndroid } from "react-native";
import { PhotoGrid } from 'react-native-photo-grid-frame';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import formatDate from '../utils/date_format';

export default class Expenses extends React.Component {
    constructor(props){
        super(props);

        this.state = { loaded: false }
    }

    // faz o async aqui e depois manda os items por params para os ecrãs     
    async componentWillMount(){
        store.get("expenses").then(
            expenses => {
                var neww = this.props.navigation.state.params.new;
                var expense = {};
                if (!neww)
                {
                    var id = this.props.navigation.state.params.id;
                    expenses.find((e) => {
                        if (e.id == id){
                            expense = e;
                            return;
                        }
                    });
                }

                var imgs = expense.gallery || {};
                var items = expense.items || {};
                var {imgs, items, ...expense} = info || {};
                this.setState({ 
                    new: neww,
                    gallery: imgs,
                    items: items,
                    info: info,
                    loaded: true,
                });
            }
        )
    }

    render(){
        return !loaded ? <Loader/> : <Tab screenProps={{
            lang: this.props.screenProps, 
            params: {
                new: this.props.navigation.state.params.new,
                info: this.state.info,
                items: this.state.items,
                summaries: this.state.summaries
            }
        }} />;
    }
}

class GeneralScreen extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            loaded: false,
            new: this.props.screenProps.params.new,
            exp: this.props.screenProps.params.info,
            errReceiver: false,
            catLoaded: false,
            currLoaded: false,
            typeLoaded: false,
            lang: this.props.screenProps.lang
        }

        this._submit = this._submit.bind(this)
    }

    async componentWillMount(){
        store.get("currencies").then(
            (currs) => {  
                this.setState({ 
                    currs: currs 
                });
            }
        );

        store.get("splitType").then(
            (types) => {
                this.setState({ 
                    types: types 
                });
            }
        );

        store.get("categories").then(
            (cats) => {
                var exp = this.state.exp;

                this.setState({ 
                    cats: cats,
                    date: exp.date || new Date(),
                    members: exp.members || [],
                    curr: exp.curr || 1,
                    type: exp.type || 1,
                    cat: exp.cat || 1,
                    loaded: true,
                    id: (exp != null) ? (exp.length + 1) : exp.id,
                });
            }
        );
    }

    _submit(){
        var err = -1;

        if (this.state.receiver == "") {
            this.setState({ errReceiver: true });
            err = 1;
        } else {
            this.setState({ errReceiver: false });
        }

        if (err == -1){
            store.push("expenses", {
                id: this.state.id,
                reciever: this.state.reciever,
                date: this.state.date,
                curr: this.state.curr,
                type: this.state.type,
                cat: this.state.cat,
                members: this.state.members,
                notes: this.state.notes,
            }).then(() => {alert('yuuup'); this.props.navigation.goBack()});
        }
    }

    updateValues(){
        var type = this.state.type;

        if (type == 1) {
            var cost = this.state.cost;
            var members = this.state.members;
            var len = 0;

            members.map(m => {
                if (m.selected)
                    len++;
            });

            var value = cost / len;

            members.map((m, index) => {
                if (m.selected)
                    return {name: m.name, cost: value, selected: m.selected}
            });
            
            this.setState({
                members: members
            })
        }
    }

    memberSelection(index){
        var members = this.state.members;

        members[index].selected = !members[index].selected;

        this.setState({
            members: members
        });

        this.updateValues();
    }

    getComboBox(collection, stateItem){
        var items = [];
        
        if (!collection || collection == "" || collection == [] || collection == null) 
            return;
        
        return <ComboBox>
            {collection.map(item => {
                console.log(item);
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    buildPaymentList() {
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.members}</FormLabel>
                
                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.members != "" && this.state.members.map((item, index) => {
                        return <View key={index} style={styles.members_list_item}>
                            <CheckBox onPress={this.memberSelection(index)} checked={itenm.selected} title={item} />
                            <FormInput keyboardType="numeric" value={item.cost} />
                        </View>
                    })}
                </ScrollView>
            </View>
        );
    }

    buildForm(){
        return (
            <ScrollView style={{paddingBottom: 60}}>
                <View>
                    {/* receiver */}
                    <FormLabel>{this.state.lang.expense.receiver}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.props.new}
                        style={styles.input}
                        onChangeText={(receiver) => this.setState({receiver: receiver})}
                    />
                    {this.state.errReceiver && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    {/* split type */}
                    <FormLabel>{this.state.lang.expense.types}</FormLabel>
                    <View style={styles.combobox}>
                        {this.getComboBox(this.state.types, "type")}
                    </View>

                    {/* currencies */}
                    <FormLabel>{this.state.lang.misc.curr}</FormLabel>
                    <View style={styles.combobox}>
                        {this.getComboBox(this.state.currs, "curr")}
                    </View>

                    {/* category */}
                    <FormLabel>{this.state.lang.cat.title}</FormLabel>
                    <View style={styles.combobox}>
                        {this.getComboBox(this.state.cats, "cat")}
                    </View>

                    {/* expense date */}
                    <FormLabel>{this.state.lang.expense.date}</FormLabel>
                    <FormInput
                        editable={false}
                        value={formatDate(this.state.date.getTime())}
                        style={styles.input}
                    />
                    
                    {/* cost */}
                    <FormLabel>{this.state.lang.expense.cost}</FormLabel>
                    <FormInput
                        editable={this.props.new}                        
                        style={styles.input}
                        value={this.state.cost}
                        keyboardType="numeric"
                        onChangeText={(cost) => { 
                            this.setState({cost: cost});
                            this.updateValues();
                        }}
                    />

                    {/* notes */}
                    <FormLabel>{this.state.lang.expense.notes}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.props.new}
                        multiline={true}
                        autoGrow={true}
                        onChangeText={(notes) => this.setState({notes: notes})}
                        style={StyleSheet.flatten([styles.input, styles.input_textarea])}
                    />

                    {/* payments */}
                    {this.buildPaymentList()}
                    
                    <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit} />
                </View>
            </ScrollView>
        );
    }

    render() {
        return this.state.loaded ? this.buildForm() : <Loader/>;
    }
}

class ItemsScreen extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            loaded: false,
            lang: this.props.screenProp,
            items: this.props.screenProps.params.items,
            modalVisible: false,
            errItemName: false,
            errItemPrice: false,
            itemName: "",
            itemPrice: "",
        }

        this._submit_new_item = this._submit_new_item.bind(this)
        this._delete_item = this._delete_item.bind(this)
        this._submit = this._submit.bind(this)
    }

    _delete_item(index){
        Alert.alert(
            lang.trip.remove_title,
            lang.trip.remove_text,
            [
                {text: lang.misc.remove_no, style: 'cancel'},
                {text: lang.misc.remove_yes, onPress: () => { 
                    this.setState(prevState => ({
                        items: [prevState.items.splice(index, 1)]
                    }));
                }},
            ],
        );
    }

    _submit_new_item() {
        var err = -1;

        if (this.state.itemName == "") {
            this.setState({ errItemName: true });
            err = 1;
        } else {
            this.setState({ errItemName: false });
        }

        if (this.state.itemPrice == "") {
            this.setState({ errItemPrice: true });
            err = 1;
        } else {
            this.setState({ errItemPrice: false });
        }

        if (err === -1) {
            this.setState(prevState => ({
                items: [
                    ...prevState.items, 
                    {name: this.state.itemName, price: this.state.itemName}
                ],
                modalVisible: false,
                itemPrice: "",
                itemName: ""
            }));
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    buildList(){
        var tmp = [];
        var items = this.state.items;

        if (items == null || items == "" || items == undefined)
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{this.state.lang.expense.no_expenses}</Text>
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
            <View style={styles.form_wrapper}>
                <View>
                    <Text style={styles.new_item}>{this.state.lang.expense.new_item}</Text>
                </View>
                <View style={styles.form_container}>
                    <View style={{flex:4}}>
                        <FormLabel>{this.state.lang.expense.item_name}</FormLabel>
                        <FormInput
                            autoCapitalize="sentences"
                            onChangeText={(item_name) => this.setState({item_name})}
                        />
                    </View>
                    <View style={{flex:4}}>
                        <FormLabel>{this.state.lang.expense.item_price}</FormLabel>
                        <FormInput
                            autoCapitalize="sentences"
                            onChangeText={(item_price) => this.setState({item_price})}
                            keyboardType="numeric"
                        />
                    </View>
                    <Icon style={styles.list_item_icon} name='delete-forever' onPress={() => { this._delete_item(index) }} size={32.0}/>
                </View>
            </View>
        );
    }

    buildModal(){
        return <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false) }}
        >
            <TouchableHighlight style={styles.modal_wrapper} onPress={() => { this.setModalVisible(false) }}>
                <View style={styles.modal_container}>
                    <Text style={styles.modal_title}>{this.state.lang.trip.new_member_title}</Text>

                    <FormLabel>{this.state.lang.expense.item_name}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        onChangeText={(name) => this.setState({itemName: name})}
                        style={styles.input}
                    />
                    { this.state.errItemName && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <FormLabel>{this.state.lang.expense.item_price}</FormLabel>
                    <FormInput 
                        autoCapitalize="sentences"
                        onChangeText={(price) => this.setState({itemPrice: price})}
                        style={styles.input}
                    />
                    { this.state.errItemPrice && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit_item} />
                </View>
            </TouchableHighlight>
        </Modal>
    }

    render(){
        return (this.state.loaded) ? 
            <View style={styles.flex_1}> 
                {this.buildForm()} 
                {this.buildModal()} 
            </View> : 
            <Loader />

    }
}

const imgs = [
    {id: 1, url: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"},
    {id: 2, url: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"},
    {id: 3, url: "https://beebom-redkapmedia.netdna-ssl.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg"}
]

class GalaryScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
        }
    }

    async componentDidMount(){
        var infoLang = this.props.screenProps
        this.setState({isLoading: false,lang: infoLang})
    }

    buildGallery(){
        return  <ScrollView>
            <PhotoGrid PhotosList={imgs} borderRadius={10}/>
        </ScrollView>;
    }

    buildButton(){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {
            }} />
        </View>
    }

    render() {
        if(this.state.isLoading){
            return(<View style={{flex: 1, paddingTop: 20}}>
                <Loader />
            </View>)
        }
        else{return (
            <View style={{flex: 1}}>
                {this.buildGallery()}

                {this.buildButton()}
            </View>
        );}
    }
}

const Tab = TabNavigator({
    General: {
        screen: GeneralScreen,
    },
    Items: {
        screen: ItemsScreen,
    },
    Galary: {
        screen: GalaryScreen,
    },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
        iconStyle: {
            width: 40
        },
        showIcon: false,
        inactiveTintColor: "#CECECE",
        style: {
            backgroundColor: "#4C3E54",
            marginTop: 10
        }
    },
});

const styles = StyleSheet.create({
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

    flex_1: {
        flex:1 
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

    members_wrapper: {
        marginBottom: 20
    },

    members_list_wrapper: {
        marginTop: 20,
        flex: 1
    },

    members_list_item: {
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        borderBottomColor: "#aaa",
        borderBottomWidth: .5,
    },

    btnContainer: {
        marginTop: 10, 
        marginBottom: 10,
        marginLeft: 50,
        marginRight: 50,
    },
    
    btnStyle: {
        borderRadius: 5
    },

    list_item_icon: {
        flex: 1,
        position: "absolute",
        right: 10,
        top: 10
    },
});
