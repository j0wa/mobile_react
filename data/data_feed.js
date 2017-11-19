import React from 'react';
import store from 'react-native-simple-store';

export default dataFeed = {
    currencies () {
        store.get("currencies").then(currs => {
            if (currs == null) {
                store.save('currencies', [
                    {id: 1, name: "Eur"},
                    {id: 2, name: "USD"},
                    {id: 3, name: "AUD"},
                    {id: 4, name: "GBP"},
                ]);
            }
        });
    },

    expenseType() {
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
                ]);
            }
        });
    }
}