import React from 'react';
import { StyleSheet, Text, View  } from 'react-native';

export default class Card extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <View style={styles.wrapper}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        borderWidth: .5,
        borderRadius: 5,
        borderColor: '#666',
        margin: 5,
        elevation: 5,
        height: 100,
        backgroundColor: "#fff", 
        padding: 10
    }
});