/* eslint-disable promise/catch-or-return */
const { dialogflow } = require('actions-on-google');
const functions = require('firebase-functions');
const request = require('request');
const fs = require('fs');


const app = dialogflow({ debug: true });

app.middleware((conv) => { });

app.intent('obc-event-info-intent', (conv, {date, city})  => {
    let event_data = getEventsTitleAndText();
    let names = event_data[0];
    conv.close("Here are some events.. " + names.join(". ")  + ".. Would you like to know more about any of these events?");
});

app.intent('obc-event-info-intent - yes', (conv, {number})  => {
    let event_data = getEventsTitleAndText();
    let text = event_data[1];
    if(number> 0 && number <= 3) {
        conv.close("Here is some more information about the event. " + text[number-1]);
    }else{
        conv.close("which one caught your attention?");
    }
});

app.intent('obc-event-info-intent - yes - select.number', (conv, {number})  => {
    let event_data = getEventsTitleAndText();
    let text = event_data[1];
    if(number> 0 && number <= 3) {
        conv.close("Here is some more information about the event. " + text[number-1]);
    }
});


function getEventsTitleAndText(){
    let obj = JSON.parse(fs.readFileSync('./mock_data/events.json', 'utf8'));
    let names = [];
    let textes = [];
    obj.Items.forEach(elm => {
        let title = "";
        let text = "";
        if(elm.Detail.en !== undefined){
            title = (elm.Detail.en.Title);
            text = (elm.Detail.en.BaseText);
        } else if (elm.Detail.it !== undefined){
            title = (elm.Detail.it.Title);
            text = (elm.Detail.it.BaseText);
        } else if (elm.Detail.de !== undefined){
            title = (elm.Detail.de.Title);
            text = (elm.Detail.de.BaseText);
        }
        //let su = [];
        //su["title"] = title;
        //su["text"] = text;
        textes.push([text]);
        names.push([title]);
    });
    return [names,textes];
}

exports.InspireMe = functions.https.onRequest(app);

function err_msg() {
    return "Something went wrong.";
}

function isValidVar(varb){
    return varb !== undefined && varb !== null;
}
