import React from 'react';
import store from 'react-native-simple-store';

export default dataFeed = {
    currencies () {
        store.get("currencies").then(currs => {
            if (currs == null) {
                store.save('currencies', [
                    {id: 1, name: "Eur", symbol: "€"},
                    {id: 2, name: "USD", symbol: "$"},
                    {id: 3, name: "AUD", symbol: "$"},
                    {id: 4, name: "GBP", symbol: "£"},
                ]);
            }
        });
    },

    spitType() {
        store.get("splitType").then(type => {
            if (type == null) {
                store.save('splitType', [
                    {id: 1, name: "Split even"},
                    {id: 2, name: "Free choice"},
                ]);
            }
        });
    },
    

    categories() {
        store.get("categories").then(cats => {
            if (cats == null) {
                store.save('categories', [
                    {id: 1, name: "Restaurant"},
                    {id: 2, name: "Transport"},
                    {id: 3, name: "Groceries"},
                    {id: 4, name: "Refund"},
                ]);
            }
        });
    },

    settings() {
        store.get("settings").then(settings => {
            if (settings == null) {
                store.save('settings', [{
                    lang: 1,
                    curr: 1,
                }]);
            }
        });
    },

    langs() {
        store.get("langs").then(settings => {
            if (settings == null) {
                store.save('langs', [
                    {id: 1, name: "English" },
                    {id: 2, name: "Français" },
                    {id: 3, name: "Português" },
                ]);
            }
        });
    },

    ids(){
        store.get("ids").then(settings => {
            if (settings == null) {
                store.save('ids', [{
                    cat_id: 5,
                    trip_id: 1,
                    expense_id: 1,
                    member_id: 1,
                }]);
            }
        });
    }
}
