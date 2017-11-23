import React from 'react';
import { Text } from "react-native";

export default class Required extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return <Text style={{color: "#AF0707", textAlignVertical: "center"}}> *</Text>
    }
}