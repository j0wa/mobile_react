import React from 'react';

export default function formatDate(timestamp) {
    var tmp = new Date(timestamp);
    var day = tmp.getDate();
    var month = tmp.getMonth() + 1;
    var hours = tmp.getHours();
    var minutes = tmp.getMinutes();

    day = (day >= 10) ? day : "0" + day;
    month = (month >= 10) ? month : "0" + month;
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = (minutes >= 10) ? minutes : "0" + minutes;

    return hours + ":" + minutes + "  " + day + "/" + month + "/" + tmp.getFullYear();
}