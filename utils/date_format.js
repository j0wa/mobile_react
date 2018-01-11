import React from 'react';

export default function formatDate(timestamp, short) {
    var tmp = new Date(timestamp);
    var day = tmp.getDate();
    var month = tmp.getMonth() + 1;
    var hours = tmp.getHours();
    var minutes = tmp.getMinutes();

    if (!short){
        day = (day >= 10) ? day : "0" + day;
        month = (month >= 10) ? month : "0" + month;
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }
    else 
        year = tmp.getFullYear() - 2000;

    return (!short) ? hours + ":" + minutes + "  " + day + "/" + month + "/" + tmp.getFullYear() : day + "/" + month + "/" + year;
}