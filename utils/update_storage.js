import React from 'react';
import store from 'react-native-simple-store';
import {DeviceEventEmitter} from 'react-native'

export default function updateStorage(collection, item, creating, callback) {
    var tmp = [];

    console.log("updateState in values :");
    console.log("collections");
    console.log(collection);
    console.log("item");
    console.log(item);
    console.log("creating");
    console.log(creating);
    console.log("callback");
    console.log(callback);

    store.get(collection).then((values) => {
        console.log("values retrieved");
        console.log(values);
        //added the value[0] != null because the storage sometime retreive a empty arrays in place of null...
        var ar1 = [];
        var ar2 = [ar1];
        //console.log("val of ar2");
        //console.log(ar2);
        //console.log(JSON.stringify(values)==JSON.stringify(ar2));
        if (values != null && JSON.stringify(values)!=JSON.stringify(ar2)){
            //console.log("in the if");
            values.map(v => {

                if (!creating && v.id == item.id) {
                    v = item;
                    return;
                }


                tmp.push(v);
            });
        }


        tmp.push(item)

        console.log("final state of tmp");
        console.log(tmp);

    }).then(() => {
        store.delete(collection).then(() => {
            store.save(collection, tmp).then(() => { callback && callback() });
        });
    });
}
