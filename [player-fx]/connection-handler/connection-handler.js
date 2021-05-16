// connection handler
on("onResourceStart", (name) => {
    if (name == GetCurrentResourceName()) {
        console.warn("Initiated instance of Connection Handler.");
    }
});


on("playerConnecting", (name, kickreason) => {
    let _source = source;
    let _license = GetLicense(_source);
    
    if (exports["ban-check"]["IsPlayerBanned"](_license)) {
        kickreason("You are banned from this server.");
        CancelEvent();
        console.log("Player " + name + " tried to join but got rejected because banned. License: " + _license);
    } else {
        console.log("Player " + name + " joined. License: " + _license);
    }
});

// functions & exports

function GetAllIdentifiers(player) {
    if(!player) return null;

    let idcount = GetNumPlayerIdentifiers(player);

    let array = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        array.push(id);
    }

    return JSON.stringify(array);
}

function GetDiscord(player) {
    let _discordid; // to be returned

    // num identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _discord = arr.match(/discord:.*/);

    let ____sntz;

    if (_discord) {
        ____sntz = _discord.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _discordid = _sntz

    return _discordid;
}

function GetIP(player) {
    let _ipaddress; // to be returned

    // identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _ip = arr.match(/ip:.*/);

    let ____sntz;

    if (_ip) {
        ____sntz = _ip.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _ipaddress = _sntz

    return _ipaddress;
}

function GetLicense(player) {
    let _licenseid; // to be returned

    // identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _license = arr.match(/license:.*/);

    let ____sntz;

    if (_license) {
        ____sntz = _license.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _licenseid = _sntz

    return _licenseid;
}

function GetXBL(player) {
    let _xblid; // to be returned

    // identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _xbl = arr.match(/xbl:.*/);

    let ____sntz;

    if (_xbl) {
        ____sntz = _xbl.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _xblid = _sntz

    return _xblid;
}

function GetLive(player) {
    let _liveid; // to be returned

    // identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _live = arr.match(/live:.*/);

    let ____sntz;

    if (_live) {
        ____sntz = _live.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _liveid = _sntz

    return _liveid;
}

function GetFivem(player) {
    let _fivemid; // to be returned

    // identifiers getter
    let idcount = GetNumPlayerIdentifiers(player);

    let arr = [];

    for (let i = 0; i < idcount; i++) {
        let id = GetPlayerIdentifier(player, i);

        arr.push(id);
    }

    arr = JSON.stringify(arr);
    //

    let _fivem = arr.match(/fivem:.*/);

    let ____sntz;

    if (_fivem) {
        ____sntz = _fivem.toString().split(":")[1]; 
    } else {
        ____sntz = "not found";
    }

    let ___sntz = ____sntz.replace(/"/g, "");

    let __sntz = ___sntz.replace(/\,.*/, '');

    let _sntz = __sntz.replace(/\].*/, '');

    _fivemid = _sntz

    return _fivemid;
}

exports("GetDiscord", GetDiscord);
exports("GetIP", GetIP);
exports("GetXBL", GetXBL);
exports("GetLicense", GetLicense);
exports("GetLive", GetLive);
exports("GetFivem", GetFivem);
//

//commands
RegisterCommand("drop", (s, a) => {
    let _s = s;
    let user = a[0];
    let reason = a.slice(1).join(" ");

    if(_s == 0) {
        if(!user || !exports["identity-handler"]["IsIdActive"](user)) {
            console.log("Please specify a valid User ID.");
        } else if (!reason) {
            DropPlayer(user, "No reason specified.");
        } else {
            DropPlayer(user, reason);
        }
    } else if (_s >= 1) {
        let name = GetPlayerName(_s);

        if(!user || !exports["identity-handler"]["IsIdActive"](user)) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*DROP^r", "^*Please specify a valid User ID."]});
        } else if (!reason) {
            DropPlayer(user, `Kicked by ${name} - No reason specified.`);
        } else {
            DropPlayer(user, `Kicked by ${name} - ` + reason);
        }
    }
}, true);
//
//