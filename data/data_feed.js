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
        store.get("expenseTypes").then(type => {
            if (type == null) {
                store.save('expenseTypes', [
                    {id: 1, name: "Split even"},
                    {id: 2, name: "To each his own"},
                    {id: 3, name: "Free choice"},
                ]);
            }
        });
    },

    categories() {
        store.get("cats").then(cats => {
            if (cats == null) {
                store.save('cats', [
                    {id: 1, name: "Restaurant"},
                    {id: 2, name: "Transport"},
                    {id: 3, name: "Groceries"},
                ]);
            }
        });
    }
}