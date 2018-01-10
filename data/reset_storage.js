import React from 'react';
import store from 'react-native-simple-store';

export default resetStorage = {
    trips () {
        store.delete('trips');
    },

    expenses () {
        store.delete('expenses');
    },

    categories() {
        store.delete("cats");
    },

    settings() {
        store.delete("settings");
    },

    langs() {
        store.delete("langs");
    }
}