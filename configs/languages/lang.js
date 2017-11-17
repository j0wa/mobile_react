import en from "./en";
import fr from "./fr";
import store from 'react-native-simple-store';

export default lang = [
    {id: 1, name: "English", shortName: "en", content: en,},
    {id: 2, name: "Français", shortName: "fr", content: fr,}
];


//export default lang = langs["fr"];

/*
export default class{
    giveMeChocolate(){
        return langs["fr"];
        var id;
        store.get("pref_lang").then(langObj => {id = langObj.langId})
        for (var i = 0; i < langsName.length; i++) {
            if (langsName[i]["id"] == id) {
                return langs[langsName[i]["id"]];
            }else{
                return langs["en"];
                console.log("Problem with requested language, en instead");
            }
        }
    }
}
*/
