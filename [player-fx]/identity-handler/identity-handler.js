//identity creator

on("onResourceStart", (name) => {
    if (name == GetCurrentResourceName()) {
        console.warn("Initiated instance of Identity Creator.");
    }
});

// player joining event and identity creation handler, couldnt be done using "playerConnecting" because netID is needed.

// fix for booba
RegisterNetEvent("playerJoining");

on("playerJoining", (old) => {
    
    // parameters
    let _p = source;
    let _name = GetPlayerName(_p);

    let _identifiers = {
        license: exports["connection-handler"]["GetLicense"](_p),
        ip: exports["connection-handler"]["GetIP"](_p),
        discord: exports["connection-handler"]["GetDiscord"](_p),
        xbl: exports["connection-handler"]["GetXBL"](_p),
        live: exports["connection-handler"]["GetLive"](_p),
        fivem: exports["connection-handler"]["GetFivem"](_p)
    }
    let _date = exports["ban-check"]["CreateDate"]();
    //

    // identity creation
    if(!HasIdentity(_p)) {
        CreateIdentity(_p, _name, _date, _identifiers);
        console.log(`Created identity for [${_p}] ${_name}.`);
    } else {
        console.error(`IDENTITY ALREADY EXISTS --- Tried to create identity for ${_p} but failed. This identity already exists. Should it be deleted?`);
    }
    //
});
//

// player dropping event and identity removal handler
on("playerDropped", (reason) => {
    // parameters
    let _p = source;
    //

    //identity removing
    if (HasIdentity(_p)) {
        RemoveIdentity(_p);
        console.log(`Removed identity for [${_p}] ${GetPlayerName(_p)}`);
    } else {
        console.error(`IDENTITY DOESN'T EXIST --- Tried to remove identity for ${_p} but failed. This player had no identity. This shouldn't happen!`);
    }
    //
});
//

/*RegisterCommand("data", (s, a) => {
    // cmd args
    let query = a[0];
    let options = a[1];
    //

    if(!query) {
        console.log("please specify a player")
    } else {
        let kvp = GetResourceKvpString(query);

        if (!kvp) {
            console.log("no such identity in database");
        } else {
            let dataunpacked = UnpackIdentity(query);
        
            switch(options) {
                case "id":
                    console.log("Requested ID: " + dataunpacked.id);
                    break;
                case "join":
                    console.log("Request join date: " + dataunpacked.join);
                    break;
                case "name":
                    console.log("Requested name: " + dataunpacked.name);
                    break;
                case "license":
                    console.log("Requested license: " + dataunpacked.identifiers.license);
                    break;
                case "ip":
                    console.log("Requested IP: " + dataunpacked.identifiers.ip);
                    break;
                case "discord":
                    console.log("Requested Discord ID: " + dataunpacked.identifiers.discord);
                    break;
                case "xbl":
                    console.log("Requested XBL ID: " + dataunpacked.identifiers.xbl);
                    break;
                case "live":
                    console.log("Requested Live ID: " + dataunpacked.identifiers.live);
                    break;
                case "fivem":
                    console.log("Requested FiveM ID " + dataunpacked.identifiers.fivem);
                    break;
                default: console.log("Please specify option parameter. (id, name, join, license, ip, discord, xbl, live, fivem)");
            }
        }
    }
});*/

function CreateIdentity(id, name, joinDate, identifierObj) {
    // create identity object and jsonify it
    let obj = {
        id: id,
        name: name,
        join: joinDate,
        identifiers: identifierObj
    }
    let jsonobj = JSON.stringify(obj);
    //
    
    // save identity kvp    
    SetResourceKvp(id, jsonobj);
    //
}

function HasIdentity(id) {
    // returns whether *player* has already an existing identity

    let _kvp = GetResourceKvpString(id);

    if(!_kvp) {
        return false
    } else {
        return true
    }
}

function RemoveIdentity(id) {
    // removes identity if it exists (it always should)

    if (HasIdentity(id)) {
        DeleteResourceKvp(id);
    } else {
        return
    }
}

function UnpackIdentity(id) {
    // retrieves data stored in KVP and parses it as JS OBJECT, in order for it to be used in code

    if (HasIdentity(id)) {
        let kvp = GetResourceKvpString(id)

        if(kvp) {
            let unpacked = JSON.parse(kvp);

            return unpacked;
        }
    } else {
        return
    }
}

function IsIdActive(id) {
    if(!id) return false

    let players = getPlayers();

    if(players.includes(id)) {
        return true
    } else {
        return false
    }
}

//exports
exports("HasIdentity", HasIdentity);
exports("UnpackIdentity", UnpackIdentity);
exports("IsIdActive", IsIdActive);
//

// commands
RegisterCommand("identity", (source, args) => {
    let _source = source;
    let secondaryCmd = args[0];

    if (!secondaryCmd) {
        if (_source == 0) {
            console.log("To access other features, use arguments: list, data");
        } else if (source >= 1) {
            emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", "^*To access other features, use arguments: list, data"]});
        }
    } else if (secondaryCmd == "list") {
        let players = getPlayers();
        let arrayofIdentities = [];

        players.forEach(player => {
            if (HasIdentity(player)) {
                arrayofIdentities.push(player);
            }
        });

        let str = arrayofIdentities.toString();

        if (_source == 0) {
            console.log("These are currently the active identities: " + str);
        } else if (_source >= 1) {
            emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", "^*These are currently the active identities: " + str]});
        }
    } else if (secondaryCmd == "data") {
        let user = args[1];
        let query = args[2];

        if (source == 0) {
            if(!user || !IsIdActive(user)) {
                console.log("Please specify an active User ID.");
            } else if(!query) {
                console.log("Please specify a valid query: id, name, license, ip, discord, xbl, live, fivem");
            } else {
                let dataUnpacked = UnpackIdentity(user);

                switch(query) {
                    case "id":
                        console.log(`ID: ${dataUnpacked.id}`);
                        break;
                    case "name":
                        console.log(`Name: ${dataUnpacked.name}`);
                        break;
                    case "join":
                        console.log(`Joined: ${dataUnpacked.join}`);
                        break;
                    case "license":
                        console.log(`License: ${dataUnpacked.identifiers.license}`);
                        break;
                    case "ip":
                        console.log(`IP: ${dataUnpacked.identifiers.ip}`);
                        break;
                    case "discord":
                        console.log(`Discord: ${dataUnpacked.identifiers.discord}`);
                        break;
                    case "xbl":
                        console.log(`Xbox Live: ${dataUnpacked.identifiers.xbl}`);
                        break;
                    case "live":
                        console.log(`Live: ${dataUnpacked.identifiers.live}`);
                        break;
                    case "fivem":
                        console.log(`FiveM: ${dataUnpacked.identifiers.fivem}`);
                        break;
                    default: console.log( "Not a valid query.");
                }
            }
        } else if (source >= 1) {
            if(!user || !IsIdActive(user)) {
                emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", "^*Please specify an active User ID."]});
            } else if(!query) {
                emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", "^*Please specify a valid query: id, name, license, ip, discord, xbl, live, fivem"]});
            } else {
                let dataUnpacked = UnpackIdentity(user);

                switch(query) {
                    case "id":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*ID: ${dataUnpacked.id}`]});
                        break;
                    case "name":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*Name: ${dataUnpacked.name}`]});
                        break;
                    case "join":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*Joined: ${dataUnpacked.join}`]});
                        break;
                    case "license":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*License: ${dataUnpacked.identifiers.license}`]});
                        break;
                    case "ip":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*IP: ${dataUnpacked.identifiers.ip}`]});
                        break;
                    case "discord":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*Discord: ${dataUnpacked.identifiers.discord}`]});
                        break;
                    case "xbl":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*Xbox Live: ${dataUnpacked.identifiers.xbl}`]});
                        break;
                    case "live":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*Live: ${dataUnpacked.identifiers.live}`]});
                        break;
                    case "fivem":
                        emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", `^*FiveM: ${dataUnpacked.identifiers.fivem}`]});
                        break;
                    default: emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^3^*IDENTITY^r", "^*Not a valid query."]});
                }
            }
        }
    }
}, true);
//
