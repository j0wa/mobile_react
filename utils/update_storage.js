import React from 'react';
import store from 'react-native-simple-store';
import {DeviceEventEmitter} from 'react-native'

export default function updateStorage(collection, item, creating, callback) {
    var tmp = [];

    //console.log("updateState in values :");
    //console.log("collections");
    //console.log(collection);
    //console.log("item");
    //console.log(item);
    //console.log("creating");
    //console.log(creating);
    //console.log("callback");
    //console.log(callback);

    store.get(collection).then((values) => {
        //console.log("values retrieved");
        //console.log(values);
        //added the !creating because the storage sometine retreive a empty arrays in place of null...

        if (values != null && !creating){
            values.map(v => {
                if (!creating && v.id == item.id) {
                    v = item;
                    return;
                }


                tmp.push(v);
            });
        }

        tmp.push(item)

        //console.log("final state of tmp");
    //    console.log(tmp);

    }).then(() => {
        store.delete(collection).then(() => {
            store.save(collection, tmp).then(() => { callback && callback() });
        });
    });
}
