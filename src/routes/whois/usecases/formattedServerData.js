export default function formattedServerData(data) {
    const noUselessText = data.substring(0, data.indexOf(">>>"));
    const lines = splitOnNewLine(noUselessText);

    const noEmptyEntries = getRidOfEmptyEntries(lines);
    const noPrivateFields = getRidOfPrivateFields(noEmptyEntries);
    const noExtraSpaces = getRidOfExtraSpaces(noPrivateFields);

    const turnToJsonObject = makeToJson(noExtraSpaces);

    return turnToJsonObject;
}

function splitOnNewLine(text) {
    return text.split(/\r\n|\r|\n/g);
}

/*
Given data like so
[
    'Tech Phone: +1.9712666028',
    'Tech Phone Ext: ',
]
this function should return
[
    'Tech Phone: +1.9712666028'
]
*/
function getRidOfEmptyEntries(whoisInfo) {
    return whoisInfo.filter((element) => {
        const noSpaces = element.replaceAll(' ', '');
        return noSpaces[noSpaces.length - 1] != ':';
    });
}

function getRidOfPrivateFields(whoisInfo) {
    return whoisInfo.filter((element) => {
        return !element.includes("REDACTED FOR PRIVACY");
    })
}

function getRidOfExtraSpaces(whoisInfo) {
    return whoisInfo.map((info) => {
        return info.trim();
    });
}

function makeToJson(whoisInfo) {
    const split = whoisInfo.map((info) => {
        return info.split(':');
    });

    const whoisObject = {};
    split.forEach(element => {
        if(!element[0] || !element[1]){
            return;
        }
        whoisObject[element[0]] = element[1];
    });
    return whoisObject;
}