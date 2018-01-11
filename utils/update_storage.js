import React from 'react';
import store from 'react-native-simple-store';

export function updateStorage(collection, item, creating, callback) {
    var tmp = [];

    store.get(collection).then((values) => {
        if (values != null){
            if (Object.prototype.toString.call(item) == "[object Array]")
            {
                item.map(i => {
                    tmp.push(i);
                });
            }
            else {
                values.map(v => {
                    if (!creating && v.id == item.id) {
                        v = item;
                        return;
                    }
                    
                    tmp.push(v);
                });

                tmp.push(item)

            }
        }
    }).then(() => {
        store.delete(collection).then(() => {
            store.save(collection, tmp).then(() => { callback && callback() });
        });
    });
}

export function updateStorageIDs(id) {
    var tmp = [];

    store.get("ids").then((values) => {
        tmp = values;
        console.log("update id b4", tmp);
        tmp[id] = values[id] + 1;
    }).then(() => {
        store.delete("ids").then(() => {
            console.log("update id after", tmp);
            store.save("ids", tmp).then(() => {});
        });
    });
}