import React from 'react';
import { ActivityIndicator } from "react-native";

export default class Loader extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return <ActivityIndicator animating={true} size="large" style={{flex: 1}} />;
    }
}