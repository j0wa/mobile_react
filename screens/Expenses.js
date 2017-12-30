import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon, Button, FormValidationMessage, FormInput, FormLabel, CheckBox } from 'react-native-elements'
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, CameraRoll, PermissionsAndroid, Modal, TouchableHighlight, Alert } from "react-native";
import { PhotoGrid } from 'react-native-photo-grid-frame';
import store from 'react-native-simple-store';
import Loader from '../components/Loader';
import { ComboBox, ComboBoxItem } from '../components/ComboBox';
import Required from '../components/Required';
import formatDate from '../utils/date_format';
import updateStorage from '../utils/update_storage';
import {DeviceEventEmitter} from 'react-native'

export default class Expenses extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
        }

        this.updateItems = this.updateItems.bind(this);
        this.updateGallary = this.updateGallary.bind(this);
        this.connectCostData = this.connectCostData.bind(this);
    }

    updateGallary(gallary){
        this.setState({ gallary: gallary });
    }

    updateItems(items){
        this.setState({
            items: items
        });
    }

    // faz o async aqui e depois manda os items por params para os ecrãs
    async componentWillMount(){
        store.get("expenses").then(
            expenses => {
                var neww = this.props.navigation.state.params.new;
                var id = this.props.navigation.state.params.id;
                var expense = {};
                if (!neww)
                {
                    expenses.find((e) => {
                        if (e.id == id){
                            expense = e;
                            return;
                        }
                    });
                }
                //console.log("exp in comwillmount");
                //console.log(expense.membersPaidBy);

                var membersPaidByTMP = [];
                var tmp;
                var i =0;
                //console.log("coucou");
                //console.log(expense.membersPaidBy);
                //Building the list of poeple who paid
                this.props.navigation.state.params.members.forEach(function(element) {
                    expense.membersPaidBy.forEach(function(elementPaidBy){
                        if(elementPaidBy.name == element){
                            //console.log("in the if");
                            //console.log(elementPaidBy.name == element);
                            tmp = elementPaidBy;
                            return;
                        }
                    })


                    if(tmp != null){
                        //console.log("tmp not null");
                        //console.log(tmp);
                        //console.log({id: i, name: element, cost: tmp.cost, selected: tmp.selected });
                        membersPaidByTMP.push({id: i, name: element, cost: tmp.cost, selected: tmp.selected });
                    }else{
                        //console.log("tmp null");
                        //console.log({id: i, name: element, cost: 0, selected: 0 });
                        membersPaidByTMP.push({id: i, name: element, cost: 0, selected: false });
                    }
                    tmp = null;
                    i++;
                });

                i = 0;
                var membersPaidForTMP = [];
                this.props.navigation.state.params.members.forEach(function(element) {
                    expense.membersPaidFor.forEach(function(elementPaidFor){
                        if(elementPaidFor.name == element){
                            //console.log("in the if");
                            //console.log(elementPaidFor.name == element);
                            tmp = elementPaidFor;
                            return;
                        }
                    })


                    if(tmp != null){
                        //console.log("tmp not null");
                        //console.log(tmp);
                        //console.log({id: i, name: element, cost: tmp.cost, selected: tmp.selected });
                        membersPaidForTMP.push({id: i, name: element, cost: tmp.cost, selected: tmp.selected });
                    }else{
                        //console.log("tmp null");
                        //console.log({id: i, name: element, cost: 0, selected: 0 });
                        membersPaidForTMP.push({id: i, name: element, cost: 0, selected: false });
                    }
                    tmp = null;
                    i++;
                });

                this.setState({
                    new: neww,
                    gallery: expense.gallery || [],
                    items: expense.items || [],
                    membersPaidBy: membersPaidByTMP || [],
                    membersPaidFor: membersPaidForTMP || [],
                    info: Object.keys(expense).length != 0 ? {
                        receiver: expense.receiver,
                        type: expense.type,
                        curr: expense.curr,
                        cat: expense.cat,
                        date: new Date(expense.date),
                        cost: expense.cost,
                        notes: expense.notes,
                        id: id
                    } : {
                        id: id
                    },
                    loaded: true,
                });
            }
        )
    }

    connectCostData(nameOfEl){
        return function(element){
            if(element.name == nameOfEl) return element.cost
        };
    }

    connectSelectedData(nameOfEl){
        return function(element){
            if(element.name == nameOfEl) return element.cost
        };
    }

    render(){

        return this.state.loaded ? <Tab screenProps={{
            trip_id: this.props.navigation.state.params.trip_id,
            navigation: this.props.navigation,
            lang: this.props.screenProps,
            new: this.props.navigation.state.params.new,
            info: this.state.info,
            items: this.state.items,
            gallary: this.state.gallary,
            //updateExpenses: this.props.screenProps.updateExpenses,
            updateGallary: this.updateGallary,
            updateItems: this.updateItems,
            members: this.props.navigation.state.params.members.map((item, index) => { return {id: index, name: item, cost: 0, selected: true} }),
            membersPaidBy: this.state.membersPaidBy,
            membersPaidFor: this.state.membersPaidFor,
        }} /> : <Loader/>;
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
            gallary: this.props.screenProps.gallary,
            lang: this.props.screenProps.lang,
            id: this.props.screenProps.info.id,
            trip_id: this.props.screenProps.trip_id,
            members: this.props.screenProps.members,
            membersPaidBy: this.props.screenProps.membersPaidBy,
            membersPaidFor: this.props.screenProps.membersPaidFor,
            errReceiver: false,
            errCost: false,
            cost: ""
        }

        console.log("test members");
        console.log(this.props.screenProps.members);
        console.log("test membersPaidBy");
        console.log(this.state.membersPaidBy);
        console.log("test membersPaidFor");
        console.log(this.props.screenProps.membersPaidFor);


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
                membersPaidBy: this.state.membersPaidBy,
                membersPaidFor: this.state.membersPaidFor,
                cost: this.state.cost,
                notes: this.state.notes,
                items: this.state.items,
                gallary: this.state.gallary,
                trip_id: this.state.trip_id,
            };

            updateStorage("expenses", e, this.state.new, () => {
                //this.props.navigation.state.params.updateExpenses(e);
                this.props.screenProps.navigation.goBack();
                DeviceEventEmitter.emit('goBackFromExpense', e );

            });
        }
    }

    updateValues(){
        var type = this.state.type;

        if (type == 1) {
            var members = this.state.members;
            var len = 0;
            var cost = this.state.cost;

            members.map(m => {
                if (m.selected)
                    len++;
            });

            var value = cost / len;

            members.map((m) => {
                if (m.selected)
                    m.cost = value;
            });

            this.setState({
                members: members
            })
        }
    }

    memberSelection(index){
        var members = this.state.members;

        members[index].selected = !members[index].selected;

        console.log("into members selection");
        console.log(members);

        this.setState({
            members: members
        });

        this.updateValues();
    }

    memberPaidBySelection(index){
        var members = this.state.membersPaidBy;

        members[index].selected = !members[index].selected;

        console.log("into membersPaidBy selection");
        console.log(members);

        this.setState({
            membersPaidBy: members
        });

        this.updateValues();
    }

    memberPaidForSelection(index){
        var members = this.state.membersPaidFor;

        members[index].selected = !members[index].selected;

        console.log("into membersPaidFor selection");
        console.log(members);

        this.setState({
            membersPaidFor: members
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

    updateMemberCost(id, val, tmp){
        tmp.map((m) => {
            if (id == m.id){
                m.cost = this.removeLeadingZeros(val);
                return;
            }

            this.setState({ members: tmp });
        });
    }

    buildPaymentList() {
        console.log("members in buildPaymentList");
        console.log(this.state.members);
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.members}</FormLabel>

                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.members.map((item) => {
                        console.log("item checkbox");
                        console.log(item);
                        return <View key={item.id} style={styles.members_list_item}>
                            <CheckBox
                                containerStyle={styles.members_list_ckbox_container}
                                checked={item.selected}
                                onPress={() => { this.memberSelection(item.id) }}
                                title={item.name}
                                textStyle={styles.members_list_ckbox_text}
                            />
                            <FormInput
                                containerStyle={styles.members_list_text_container}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                editable={this.state.new }
                                onChangeText={(val) => this.updateMemberCost(item.id, val,this.state.members)}
                                value={String(item.cost)}
                            />
                        </View>
                    })}
                </ScrollView>
            </View>
        );
    }

    buildPaidByList() {
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.paidBy}</FormLabel>

                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.membersPaidBy.map((item) => {
                        return <View key={item.id} style={styles.members_list_item}>
                            <CheckBox
                                containerStyle={styles.members_list_ckbox_container}
                                checked={item.selected}
                                onPress={() => { this.memberPaidBySelection(item.id) }}
                                title={item.name}
                                textStyle={styles.members_list_ckbox_text}
                            />
                            <FormInput
                                containerStyle={styles.members_list_text_container}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                editable={this.state.new }
                                onChangeText={(val) => this.updateMemberCost(item.id, val,this.state.membersPaidBy)}
                                value={String(item.cost)}
                            />
                        </View>
                    })}
                </ScrollView>
            </View>
        );
    }

    buildPaidForList() {
        return (
            <View style={styles.members_wrapper}>
                <FormLabel>{this.state.lang.trip.paidFor}</FormLabel>

                <ScrollView style={styles.members_list_wrapper}>
                    {this.state.membersPaidFor.map((item) => {
                        return <View key={item.id} style={styles.members_list_item}>
                            <CheckBox
                                containerStyle={styles.members_list_ckbox_container}
                                checked={item.selected}
                                onPress={() => { this.memberPaidForSelection(item.id) }}
                                title={item.name}
                                textStyle={styles.members_list_ckbox_text}
                            />
                            <FormInput
                                containerStyle={styles.members_list_text_container}
                                keyboardType="numeric"
                                underlineColorAndroid="transparent"
                                editable={this.state.new }
                                onChangeText={(val) => this.updateMemberCost(item.id, val,this.state.membersPaidFor)}
                                value={String(item.cost)}
                            />
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

                    {/* currencies */}
                    <FormLabel>{this.state.lang.misc.curr}</FormLabel>
                    <View style={styles.combobox}>
                        {this.getComboBox(this.state.currs, "curr")}
                    </View>

                    {/* cost */}
                    <FormLabel>{this.state.lang.expense.cost} <Required /></FormLabel>
                    <FormInput
                        editable={this.state.new}
                        style={styles.input}
                        value={String(this.state.cost)}
                        keyboardType="numeric"
                        returnKeyType="next"
                        onEndEditing={cost => this.updateValues() }
                        onChangeText={cost => this.setState({cost: this.removeLeadingZeros(cost)}) }
                    />
                    {this.state.errCost && <FormValidationMessage>{this.state.lang.err.required}</FormValidationMessage> }

                    {/* split type */}
                    <FormLabel>{this.state.lang.expense.types}</FormLabel>
                    <View style={styles.combobox}>
                        {this.getComboBox(this.state.types, "type")}
                    </View>

                    {/* paid by list */}
                    {this.buildPaidByList()}

                    {/* paid for list*/}
                    {this.buildPaidForList()}

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
            <TouchableHighlight style={styles.modal_wrapper} onPress={() => { this.setModalVisible(false) }}>
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
                </View>
            </TouchableHighlight>
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

class GalaryScreen extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            lang: this.props.screenProps.lang,
            gallary: this.props.screenProps.gallary,
            showPhotoGallery: false,
            cameraPhotos: ""
        }
    }

    buildGallery(){
        if  (this.state.gallary  == "" || this.state.gallary == null || this.state.gallary == {})
        {
            return (
                <View style={styles.empty}>
                    <Text style={styles.empty_text}>{this.state.lang.expense.no_img}</Text>
                </View>
            );
        }

        return (
            <ScrollView>
                <PhotoGrid PhotosList={this.state.gallary} borderRadius={10}/>
            </ScrollView>
        );
    }

    getPhotos(){
        CameraRoll.getPhotos({ first: 1000000 }).then(pics => {
            this.setState({
                showPhotoGallery: true,
                cameraPhotos: pics.edges
            })
        });
    }

    buildButton(){
        return <View style={styles.button}>
            <Icon name='add-circle' size={64.0} onPress={() => {this.getPhotos()}} />
        </View>
    }

    selectPic(pic){
        var len = this.state.gallary.lenght + 1;

        console.log(pic);

        this.setState(prevState => ({
            gallary: [...prevState.gallary, {id: len, url: "something"}]
        }));
    }

    buildScreen(){
        if (this.state.showPhotoGallery){
            return (
                <View style={styles.flex_1}>
                    <PhotoGrid PhotosList={this.state.cameraPhotos} borderRadius={10} onPress ={(pic) => { this.selectPic(pic) }} />
                </View>
            );
        }

        return (
            <View style={styles.flex_1}>
                {this.buildGallery()}

                {this.buildButton()}
            </View>
        );
    }

    render() {
        return <View style={{flex: 1}}>{this.buildScreen()}</View>
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
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    members_list_ckbox_container: {
        backgroundColor: "transparent",
    },

    members_list_ckbox_text: {
        fontSize: 16,
        flex: 1
    },

    members_list_text_container: {

        flex: 1,
        backgroundColor: "white",
    },

    members_list_text: {
        alignSelf: "center",
        textAlign:"center",
        fontSize: 20
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
});
