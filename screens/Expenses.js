import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Button, FormValidationMessage, FormInput, FormLabel, CheckBox } from 'react-native-elements'
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, CameraRoll, PermissionsAndroid, Modal, TouchableHighlight, Alert, TouchableNativeFeedback } from "react-native";
import { PhotoGrid } from 'react-native-photo-grid-frame';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import Required from '../components/Required';
import formatDate from '../utils/date_format';
import { updateStorage } from '../utils/update_storage';

export default class Expenses extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
        }

        this.updateItems = this.updateItems.bind(this);
        this.updatePayment = this.updatePayment.bind(this);
        this.updateTotalLeft = this.updateTotalLeft.bind(this);
    }

    componentWillMount(){
        if (!this.props.navigation.state.params.new){
            var expense = this.props.navigation.state.params.expense;

            this.setState({
                new: false,
                items: expense.items,
                payments: expense.payments || [],                
                totalLeft: expense.totalLeft || 0,            
                info: {
                    receiver: expense.receiver,
                    type: expense.type,
                    curr: expense.curr,
                    cat: expense.cat,
                    date: new Date(expense.date),
                    cost: expense.cost,
                    notes: expense.notes,
                    id: expense.id
                },
                loaded: true,
            });
        } 
        else {
            this.setState({
                info: {
                    id: this.props.navigation.state.params.id,
                    curr: this.props.navigation.state.params.curr
                },
                items: [],
                loaded: true,
                new: true,
                payments: [],
                totalLeft: 0  
            })
        }
    }

    updateNew(trip){
        this.setState({
            new: false,
            id: this.state.id,
            receiver: this.state.receiver,
            date: this.state.date,
            curr: this.state.curr,
            type: this.state.type,
            cat: this.state.cat,
            members: this.state.members,
            cost: this.state.cost,
            notes: this.state.notes,
            items: this.state.items,
            payments: this.state.payments
        })
    }

    updateItems(items){
        this.setState({ 
            items: items 
        });
    }

    updatePayment(payments, totalLeft){
        this.setState({ 
            payments: [...payments],
            totalLeft: totalLeft
        });
    }

    updateTotalLeft(totalLeft){
        var val = totalLeft;
        
        if (this.state.payments.length > 0){
            this.state.payments.map(item => {
                val -= item.val;
            });
        }

        this.setState({totalLeft: totalLeft});
    }

    render(){
        if (this.state.loaded){
            var props = {
                navigation: this.props.navigation,
                lang: this.props.screenProps,
                new: this.state.new,
                info: this.state.info,
                items: this.state.items,
                payments: this.state.payments,
                totalLeft: this.state.totalLeft,
                updateExpenses: this.props.navigation.state.params.updateExpenses,
                updateId: this.props.navigation.state.params.updateId,
                updateItems: this.updateItems,
                updatePayment: this.updatePayment,
                updateTotalLeft: this.updateTotalLeft,
                members: this.props.navigation.state.params.members.map((item, index) => { return {id: index, name: item.name, cost: 0, selected: true}})
            };

            return this.state.new ? <Tab2 screenProps={props} /> : <Tab screenProps={props} /> 
        }

        return <Loader/>;
    }
}

class GeneralScreen extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            loaded: false,
            new: this.props.screenProps.new,
            exp: this.props.screenProps.info,
            items: this.props.screenProps.items,
            lang: this.props.screenProps.lang,
            id: this.props.screenProps.info.id,
            members: this.props.screenProps.members,
            errReceiver: false,
            errCost: false,
            cost: this.props.screenProps.cost,
            totalLeft: this.props.screenProps.totalLeft,
            payments: this.props.screenProps.payments,
        }

        this._submit = this._submit.bind(this)
        this.updateValues = this.updateValues.bind(this)
        this.updateMemberCost = this.updateMemberCost.bind(this)
    }

    componentWillMount(){
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
                    curr: exp.curr || 1,
                    type: exp.type || 1,
                    cat: exp.cat || 1,
                    receiver: exp.receiver || "",
                    loaded: true,
                    cost: exp.cost || "",
                    notes: exp.notes || ""
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

        if (this.state.cost == "") {
            this.setState({ errCost: true });
            err = 1;
        } else {
            this.setState({ errCost: false });
        }

        if (err == -1){
            var e = {
                id: this.state.id,
                receiver: this.state.receiver,
                date: this.state.date,
                curr: this.state.curr,
                type: this.state.type,
                cat: this.state.cat,
                members: this.state.members,
                cost: this.state.cost,
                notes: this.state.notes,
                items: this.state.items,
                payments: this.state.payments
            };


            updateStorage("expenses", e, this.state.new, () => {
                this.props.screenProps.updateExpenses(e);
                
                if (this.state.new){
                    this.props.screenProps.updateId();
                }

                this.props.screenProps.navigation.goBack();
            });
        }
    }

    updateValues(){
        var type = this.state.type;
        
        // split evenly
        if (type == 1) {
            var members = this.state.members;
            var cost = this.state.cost;
            var len = 0;

            members.map(m => {
                if (m.selected)
                    len++;
            });

            var value = (cost / len).toFixed(2);
            
            members.map((m) => {
                m.cost = (m.selected) ? value : 0;
            });

            this.setState({
                members: members
            })
        }
        else {
            var members = this.state.members;
            var cost = this.state.cost;
            var total = 0;

            members.map(m => {
                total += total.cost;
                if (total > this.state.cost){
                    m.cost = "0";

                    Alert.alert(
                        this.state.lang.err.title,
                        this.state.lang.expense.overbudget,
                        [
                            {text: this.state.lang.setting.updated }
                        ],
                    );
                }
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

        return <ComboBox
                selectedValue={this.state[stateItem]}
                onValueChange={(value) => {
                    if (stateItem == "type")
                        this.setState({type: value});
                    else if (stateItem == "curr")
                        this.setState({curr: value});
                    else
                        this.setState({cat: value});
                }}
            >
            {collection.map(item => {
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    removeLeadingZeros(val){
        if (typeof val == "string"){
            var index = 0;
            for (var i = 0; i < val.length; i++){
                if (val[i] == "0")
                    index++;
                else
                    break;
            }
    
            if (index != -1){
                return val.substr(index);
            }
    
            return val;
        }
    }

    updateMemberCost(id, val){
        var tmp = this.state.members;
        tmp.map((m) => {
            if (id == m.id){
                m.cost = this.removeLeadingZeros(val);
                return;
            }

            this.setState({ members: tmp });
            this.updateMemberCost();
        });
    }

    buildPaymentList() {
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.members}</FormLabel>

                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.members.map((item) => {
                        
                        return <View key={item.id} style={styles.members_list_item}>
                            <CheckBox 
                                containerStyle={styles.members_list_ckbox_container} 
                                checked={item.selected} 
                                onPress={() => { this.memberSelection(item.id) }}
                                textStyle={styles.members_list_ckbox_text}
                                title={item.name}
                            />
                            <FormInput 
                                containerStyle={styles.members_list_text_container} 
                                keyboardType="numeric"
                                style={styles.members_list_text} 
                                underlineColorAndroid="transparent"
                                editable={this.state.new && this.state.type != 1 && this.state.cost != ""}
                                onChangeText={(val) => this.updateMemberCost(item.id, val)}
                                value={String(item.cost)}
                            />
                        </View>
                    })}
                </ScrollView>
            </View>
        );
    }

    onCostEdit(){
        this.updateValues();
        this.props.screenProps.updateTotalLeft(this.state.cost);
    }

    buildForm(){
        return (
            <ScrollView style={{paddingBottom: 60}}>
                <View>
                    {/* receiver */}
                    <FormLabel>{this.state.lang.expense.receiver}<Required /></FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        value={this.state.receiver}
                        editable={this.state.new}
                        style={styles.input}
                        returnKeyType="next"
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
                    <FormLabel>{this.state.lang.expense.cost} <Required /></FormLabel>
                    <FormInput
                        editable={this.state.new}                        
                        style={styles.input}
                        value={String(this.state.cost)}
                        keyboardType="numeric"
                        returnKeyType="next"
                        onEndEditing={cost => this.onCostEdit()}
                        onChangeText={cost => this.setState({cost: this.removeLeadingZeros(cost)})}
                    />
                    {this.state.errCost && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    {/* notes */}
                    <FormLabel>{this.state.lang.expense.notes}</FormLabel>
                    <FormInput
                        autoCapitalize="sentences"
                        editable={this.state.new}
                        multiline={true}
                        autoGrow={true} 
                        value={this.state.notes}
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
            lang: this.props.screenProps.lang,
            items: this.props.screenProps.items,
            modalVisible: false,
            errItemName: false,
            errItemPrice: false,
            itemName: "",
            itemPrice: "",
        }

        this._submit_new_item = this._submit_new_item.bind(this);
        this._delete_item = this._delete_item.bind(this);
    }

    _delete_item(index){
        Alert.alert(
            this.state.lang.expense.remove_title,
            this.state.lang.expense.remove_text,
            [
                {text: this.state.lang.misc.remove_no, style: 'cancel'},
                {text: this.state.lang.misc.remove_yes, onPress: () => {
                    var items = this.state.items;
                    items.splice(0, 1);

                    this.setState({
                        items: items
                    });

                    this.props.screenProps.updateItems(this.state.items);
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
            var items =  [
                ...this.state.items,
                {name: this.state.itemName, price: this.state.itemPrice}
            ];

            this.setState({
                items: items,
                modalVisible: false,
                itemPrice: "",
                itemName: ""
            });

            this.props.screenProps.updateItems(items);
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    buildList(){
        var items = this.state.items;

        if (Object.keys(items).length == 0)
            return <View style={styles.empty}>
                <Text style={styles.empty_text}>{this.state.lang.expense.no_items}</Text>
            </View>

        return (
            <ScrollView>
                {items.map((item, index) => {
                    return <View key={index} style={styles.list_item}>
                        <View style={styles.list_item_info}>
                            <View>
                                <Text>{item.name}</Text>
                            </View>
                            <View>
                                <Text>{item.price}</Text>
                            </View>
                    </View>
                        <Icon style={styles.list_item_icon} name='delete-forever' onPress={() => { this._delete_item(index) }} size={32.0}/>
                    </View>
                })}
            </ScrollView>
        )
    }

    buildModal(){
        return <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setModalVisible(false) }}
        >
            <View style={styles.modal_wrapper} >
                <View style={styles.modal_container}>
                    <Text style={styles.modal_title}>{this.state.lang.expense.new_item_title}</Text>

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
                        keyboardType="numeric"
                        onChangeText={(price) => this.setState({itemPrice: price})}
                        style={styles.input}
                    />
                    { this.state.errItemPrice && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit_new_item} />
                    <TouchableHighlight onPress={() => { this.setModalVisible(false) }}>
                        <View><FormLabel containerStyle={styles.modal_back_button_wrapper}>{this.state.lang.payment.back}</FormLabel></View>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    }

    buildButton(){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {this.setModalVisible(true)}}/>
        </View>
    }

    render(){
        return <View style={styles.flex_1}>
            {this.buildModal()}
            {this.buildList()}
            {this.buildButton()}
        </View>
    }
}

class PaymentsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: this.props.screenProps.lang,
            members: this.props.screenProps.members,
            payments: this.props.screenProps.payments,
            totalLeft:  this.props.screenProps.totalLeft,
            showModal: false,
            errVal: false,  
            errSame: false,
            from: 0,  
            to: 0,  
            val: "",  
        }

        this._submit_payment = this._submit_payment.bind(this);
    }
    
    _submit_payment(){
        var err = -1;

        if (this.state.val == "") {
            this.setState({ errVal: true });
            err = 1;
        } else {
            this.setState({ errVal: false });
        }
        
        if (this.state.from == this.state.to) {
            this.setState({ errSame: true });
            err = 1;
        } else {
            this.setState({ errSame: false });
        }

        if (err == -1){
            var tmp = {to: this.state.to, from: this.state.from, amount: this.state.val, date: new Date().getTime()};
            var val = this.state.totalLeft - this.state.val;
            
            this.setState(prev => ({
                totalLeft: val,
                payments: [...prev.payments, tmp]
            }));

            this.props.screenProps.updatePayment(tmp);
            this.toggleModal();
        }
    }

    toggleModal(){
        this.setState(prev => ({
            showModal: !prev.showModal
        }));
    }

    buildModal(){
        return (
            <Modal
                transparent={true}
                visible={this.state.showModal}
                onRequestClose={() => { this.toggleModal(false) }}
            >
                <View style={styles.modal_wrapper}>
                    <View style={styles.modal_container}>
                        <Text style={styles.modal_title}>{this.state.lang.payment.new_payment}</Text>

                        <FormLabel>{this.state.lang.payment.from}</FormLabel>
                        { this.getComboBox(this.state.members, "to") }
                        { this.state.errSame && <FormValidationMessage>{this.state.lang.payment.same}</FormValidationMessage> }
                        
                        <FormLabel>{this.state.lang.payment.to}</FormLabel>
                        { this.getComboBox(this.state.members, "from") }
                        { this.state.errSame && <FormValidationMessage>{this.state.lang.payment.same}</FormValidationMessage> }

                        <FormLabel>{this.state.lang.payment.val}</FormLabel>
                        <FormInput
                            autoCapitalize="sentences"
                            onChangeText={(val) => this.setState({val: val})}
                            style={styles.input}
                            keyboardType="numeric"
                        />
                        { this.state.errVal && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                        <Button title={this.state.lang.misc.btn} containerViewStyle={styles.btnContainer} buttonStyle={styles.btnStyle} onPress={this._submit_payment} />
                        
                        <TouchableHighlight onPress={() => { this.toggleModal(false) }}>
                            <View><FormLabel containerStyle={styles.modal_back_button_wrapper}>{this.state.lang.payment.back}</FormLabel></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    getComboBox(collection, stateItem){
        var items = [];

        if (!collection || collection == "" || collection == [] || collection == null)
            return;

        return <ComboBox
                selectedValue={this.state[stateItem]}
                onValueChange={(value) => this.setState({[stateItem]: value})}
                style={styles.combobox}
            >
            {collection.map((item, index) => {
                return <ComboBoxItem label={item.name} value={item.id} key={item.id}/>
            })}
        </ComboBox>
    }

    buildList(){
        return (
            <View style={{flex: 1}}>
                <Text style={styles.total_left}>{this.state.lang.payment.total_left} {this.state.totalLeft}</Text>
                <View style={{marginBottom: 20}}>
                    <FormLabel>{this.state.lang.payment.payments}</FormLabel>
                    { this.state.totalLeft > 0 && 
                        <TouchableNativeFeedback onPress={() => { this.toggleModal(true) }} >
                            <FormLabel containerStyle={styles.new_member}>{this.state.lang.payment.new_payment}</FormLabel>
                        </TouchableNativeFeedback>
                    }
                </View>
                
                <ScrollView style={{flex: 1, paddingLeft: 20, paddingRight: 20}}>
                    <View style={{flex:1, flexDirection: "row", justifyContent:"space-between"}}>
                        <Text style={styles.theader}>{this.state.lang.payment.to}</Text>
                        <Text style={styles.theader}>{this.state.lang.payment.from}</Text>
                        <Text style={styles.theader}>{this.state.lang.payment.val}</Text>
                        <Text style={styles.theader}>{this.state.lang.payment.date}</Text>
                    </View>
                    {this.state.payments.map((item, index) => {
                        return <View key={index} style={styles.members_list_item}>
                            <Text>{this.getName(item.from)}</Text>
                            <Text>{this.getName(item.to)}</Text>
                            <Text>{item.amount}</Text>
                            <Text>{formatDate(item.date, true)}</Text>
                        </View>
                    })}
                </ScrollView>
            </View>
        )
    }
 
    render() {
        return (
            <View style={styles.flex_1}>
                {this.buildList()}
                {this.buildModal()}
            </View>
        );
    }

    getName(id){
        var name = "";
        
        this.state.members.map((item, index) => {
            if (item.id == id){
                name = item.name;
            }
        });
        
        return name;
    }
}

const Tab = TabNavigator({
    General: {
        screen: GeneralScreen,
    },
    Items: {
        screen: ItemsScreen,
    },
    Payments: {
        screen: PaymentsScreen,
    },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    lazy: true,
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

const Tab2 = TabNavigator({
    General: {
        screen: GeneralScreen,
    },
    Items: {
        screen: ItemsScreen,
    },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    lazy: true,
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
        flex: 1
    },

    list_item_info: {
        marginRight: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"space-between"
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

    new_member: {
        position: "absolute",
        right: 15,
        paddingBottom: 15,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "dashed",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        top: 8,
        height: 30
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
        borderBottomColor: "#aaa",
        borderBottomWidth: .5,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    members_list_ckbox_container: {
        backgroundColor: "transparent",
        flex: 1
    },
            
    members_list_ckbox_text: {
        fontSize: 16,
        flex: 1
    },
    
    members_list_text_container: {
        right: 10,
        bottom: 6,
        position: "absolute",
        width: 100
    },
    
    members_list_text: {
        alignSelf: "center", 
        textAlign: "right", 
        fontSize: 20,
        width: 100
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
        top: 15
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

    modal_title: {
        marginLeft: 20,
        fontSize: 16,
        marginTop: 20
    },

    total_left: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 20,
    },

    total_left_red: {
        color: "#E51616",
    },

    total_left_none: {
        color: "#35AA31"
    },

    modal_back_button_wrapper: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: "center"
    },

    theader: {
        fontWeight: "bold",
        textAlign: "center"
    }
});