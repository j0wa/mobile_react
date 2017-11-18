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