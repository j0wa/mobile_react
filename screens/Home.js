import React from 'react';
import { StyleSheet, View, ActivityIndicator,Text } from 'react-native';
import { Button } from 'react-native-elements'
import lang from "../configs/languages/lang";
import store from 'react-native-simple-store';

export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
        }
    }
    componentDidMount(){
        var infoLang = this.props.screenProps
        this.setState({isLoading: false,lang: infoLang})
        //console.log("preferred language fetched");
    }
    render() {
        const { navigate } = this.props.navigation;
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }else {
            return(
                <View >
                    <Button
                        style = {styles.button}
                        title = {this.state.lang.trip.title}
                        onPress = {
                            () => {
                                console.log("triplist");
                                navigate('TripsList',this.state.lang)
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
                        title = {this.state.lang.expense.title}
                        onPress = {
                            () => {
                                console.log("expensesListx")
                                navigate('ExpensesList',this.state.lang)
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
}

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    }
})
