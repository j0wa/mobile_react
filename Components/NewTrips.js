import React from 'react';
import { StyleSheet,Button, Text, View, TextInput } from 'react-native';
import {StackNavigator} from 'react-navigation';
import store from 'react-native-simple-store';

export default class NewTrips extends React.Component {
    render(){
        return(
            <View>
                <TextInput
                    value= 'Title'
                />
                <TextInput
                    value= 'Description'
                />
                <TextInput
                    value= 'Title'
                />
            </View>
        )
    }
}
