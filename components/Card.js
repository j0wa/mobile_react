import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class Card extends React.Component {
    constructor(props){
        super(props);
    }

    _renderTitle(){
        if (this.props.hasTitle == "true")
            return (
                <View style={styles.title}>
                    <Text>{this.props.title}</Text>
                </View>
            );
    }

    _renderBody(){
        return (
            <View style={styles.body}>
                <Text>{this.props.body}</Text>
            </View>
        );
    }

    _renderCard(){
        return (
            <TouchableHighlight style={styles.container} onPress={this.props.click}>
                <View style={styles.wrapper}>
                    {this._renderTitle()}
                    {this._renderBody()}
                </View>
            </TouchableHighlight>
        )
    }
    
    render() {
        return (
            this._renderCard()
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1, 
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },

    container: {
        height: 200,
        marginTop: 20
    },

    title: {
        padding: 5,
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    body: {
        padding: 15,
        flex: 1
    }
});