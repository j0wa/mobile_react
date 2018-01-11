import React from 'react';
import store from 'react-native-simple-store';

export default resetStorage = {
    trips () {
        store.delete('trips');
    },

    categories() {
        store.delete("categories");
    },

    settings() {
        store.delete("settings");
    },

    langs() {
        store.delete("langs");
    },

    ids() {
        store.delete("ids");
    }
}