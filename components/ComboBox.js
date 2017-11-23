import React from 'react';
import { Picker, PickerIOS, Platform } from "react-native";

export class ComboBox extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (Platform.OS === "ios") ?  <PickerIOS {...this.props}>{this.props.children}</PickerIOS> : <Picker {...this.props}>{this.props.children}</Picker>
    }
}

export class ComboBoxItem extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return <Picker.Item {...this.props}/>
    }
}