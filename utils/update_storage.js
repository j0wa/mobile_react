import React from 'react';
import store from 'react-native-simple-store';

export default function updateStorage(collection, item, creating, callback) {
    var tmp = [];

    store.get(collection).then((values) => {
        if (values != null){
            values.map(v => {
                if (!creating && v.id == item.id) {
                    v = item;
                    return;
                }
                
                tmp.push(v);
            });
        }

        tmp.push(item)
    
    }).then(() => {
        store.delete(collection).then(() => {
            store.save(collection, tmp).then(() => { callback() });
        });
    });
}