import React from 'react';
import store from 'react-native-simple-store';
import {DeviceEventEmitter} from 'react-native'

export default function updateStorage(collection, item, creating, callback) {
    var tmp = [];

    store.get(collection).then((values) => {
        if (values != null && values != undefined){
            if (values.length == undefined)
                values = Object.keys(values);

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
            store.save(collection, tmp).then(() => { callback && callback() });
        });
    });
}
