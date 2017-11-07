import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'
import lang from "../configs/languages/lang";

export default class Home extends React.Component {
    render() {
        const { navigate } = this.props.navigation;
        
        return(
            <View >
                <Button 
                    style = {styles.button}
                    title = {lang.trip.title}
                    onPress = {
                        () => {
                            console.log("triplist");
                            navigate('TripsList')
                        }
                    }
                    large={true}
                    borderRadius={15}
                    raised
                    backgroundColor="#4C3E54"
                    containerViewStyle={{marginTop:150}}
                />
                <Button 
                    style = {styles.button}
                    title = {lang.expense.title}
                    onPress = {
                        () => {
                            console.log("expensesListx")
                            navigate('ExpensesList')
                        }
                    }
                    large={true}
                    borderRadius={15}
                    raised
                    backgroundColor="#4C3E54"
                    containerViewStyle={{marginTop:50}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    }
})
