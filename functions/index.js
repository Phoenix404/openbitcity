/* eslint-disable promise/catch-or-return */
const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const request = require('request');
const app = dialogflow({ debug: true });

global.titles = [];
app.middleware((conv) => { });

app.intent('obc-event-info-intent', async function (conv, {date, city}) {
    //return getEventsData().then(titles => conv.close("asdf"));
    return await getEventsData().then((titles) => {
        conv.close("Events for " + titles.join(", "));
        return titles;
    });
    //conv.close("Events for ");
    //getEventsData();
    //conv.close("Events for " + global.titles.join(", "));c

});

exports.InspireMe = functions.https.onRequest(app);

function getEventsTitle(items){
    if (items.length <=0) return "";
    let names = [];
    items.forEach(elm => {
        if(elm.Detail.en !== undefined){
            names.push(elm.Detail.en.Title);
        } else if (elm.Detail.it !== undefined){
            names.push(elm.Detail.it.Title);
        } else if (elm.Detail.de !== undefined){
            names.push(elm.Detail.de.Title);
        }
    });
    return names;
}

function getEventsItems() {
    events =  getEventsData();
    return ;
}

function getEventsData() {
    return new Promise((resolve, reject) => {
        request('https://mindfeed.one/events/event.php', (err, resp) => {
            if (err) {
                reject(err_msg());
            } else {
                let json = JSON.parse(resp.body);
                let items = json.Items;
                let names = [];
                items.forEach(elm => {
                    if(elm.Detail.en !== undefined){
                        names.push(elm.Detail.en.Title);
                    } else if (elm.Detail.it !== undefined){
                        names.push(elm.Detail.it.Title);
                    } else if (elm.Detail.de !== undefined){
                        names.push(elm.Detail.de.Title);
                    }
                });
                global.titles = names;
                resolve( names);
            }
        });
    });
}

function err_msg() {
    return "Something went wrong.";
}

function isValidVar(varb){
    return varb !== undefined && varb !== null;
}
