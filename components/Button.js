import React from 'react';
import ActionButton from 'react-native-action-button';

export default class Button extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <ActionButton buttonColor="rgba(231,76,60,1)" onPress={() => console.log(this.props)} />
        );
    }
}