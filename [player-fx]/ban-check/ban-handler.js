// ban check
on("onResourceStart", (name) => {
    if (name == GetCurrentResourceName()) {
        console.warn("Initiated instance of Ban Handler.");
    }
});

function IsPlayerBanned(license) {
    if (!license) return null

    let kvpquery = GetResourceKvpString(license);

    if(kvpquery) {
        return true;
    } else {
        return false;
    }
}

function DoesKvpContainIdentifiers(handle) {
    if(!handle) return null

    let kvpquery = GetResourceKvpString(handle);

    if(kvpquery) {
        let parsed = JSON.parse(kvpquery);
        let keys = Object.keys(parsed);

        if (keys.includes("discord" || "ip" || "live" || "xbl" || "fivem")) {
            return true
        } else {
            return false
        }
    }
}

function BanOfflinePlayer(license, source, reason) {
    CreateBanKvp(license, null, source, reason);
}

function BanPlayer(source, id, license, identifiers, reason) {
    let _reason = "You have been banned.";
    
    DropPlayer(id, _reason);

    CreateBanKvp(license, identifiers, source, reason);
}

function UnbanPlayer(license) {
    if(!license) return null

    let kvpquery = GetResourceKvpString(license);

    if(kvpquery) {
        DeleteResourceKvp(license)
    } else {
        return
    }
}

function CreateBanKvp(license, identifiers, source, reason) {
    if(!license) return null
    if(!source) source = "NULL"
    if(!reason) reason = "UNSPECIFIED"

    if (license && !identifiers) {
        let basicObj = CreateBasicInfoObj(source, license, reason);
        let JSONinfo = JSON.stringify(basicObj);
        SetResourceKvp(license, JSONinfo);
    } else if (license && identifiers) {
        let identifierJSON = JSON.stringify(identifiers);

        SetResourceKvp(license, identifierJSON);
    }
}

function UnpackBanData(license) {
    if(!license) return null

    let kvpquery = GetResourceKvpString(license);

    if(kvpquery) {
        let json = JSON.parse(kvpquery);
        return json
    } else {
        return
    }
}

function CreateDate() {
    let _date = new Date();
    let _minutes = _date.getUTCMinutes();
    let _hours = _date.getUTCHours();
    let _day = _date.getUTCDate();
    let _month = _date.getUTCMonth() + 1;
    let _year = _date.getUTCFullYear();

    let date = `${_day}/${_month}/${_year} ${_hours}:${_minutes} UTC.`;

    return date;
}

function CreateIdentifierObj(source, player, reason) {
    if(!player) return null

    let obj = {
        bannedBy: source,
        date: CreateDate(),
        reason: reason,
        name: GetPlayerName(player),
        license: exports["connection-handler"]["GetLicense"](player),
        ip: exports["connection-handler"]["GetIP"](player),
        discord: exports["connection-handler"]["GetDiscord"](player),
        xbl: exports["connection-handler"]["GetXBL"](player),
        live: exports["connection-handler"]["GetLive"](player),
        fivem: exports["connection-handler"]["GetFivem"](player)
    }

    return obj
}

function CreateBasicInfoObj(source, license, reason) {
    let obj = {
        bannedBy: source,
        license: license,
        reason: reason
    }

    return obj
}
//

//exports
exports("IsPlayerBanned", IsPlayerBanned);
exports("BanPlayer", BanPlayer);
exports("BanOfflinePlayer", BanOfflinePlayer);
exports("UnbanPlayer", UnbanPlayer);
exports("UnpackBanData", UnpackBanData);
exports("CreateDate", CreateDate);
//

//debug
RegisterCommand("ban", (s, a) => {
    let _source = s;
    let user = a[0];
    let reason = a.slice(1).join(" ");

    if (_source == 0) {
        if(!user || !exports["identity-handler"]["IsIdActive"](user)) {
            console.log("Please specify a valid User ID. If the player is offline, use /licenseban.");
        } else if (!reason) {
            console.log("Please specify a reason.");
        } else {
            let obj = CreateIdentifierObj("Console", user, reason);
            let name = GetPlayerName(user);
            BanPlayer("Console", user, obj.license, obj, reason);
            console.log(`Banned player [${user}] ${name} with license ${obj.license} and reason ${reason}.`);
        }
    } else if (_source >= 1) {
        if(!user || !exports["identity-handler"]["IsIdActive"](user)) {
            emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", "^*Please specify a valid User ID. If the player is offline, use /licenseban."]});
        } else if (!reason) {
            emitNet("chat:addMessage", _source, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", "^*Please specify a reason."]});
        } else {
            let obj = CreateIdentifierObj(_source, user, reason);
            let name = GetPlayerName(user);
            let sname = GetPlayerName(_source);
            BanPlayer(_source, user, obj.license, obj, reason);
            console.log(`[${_source}] ${sname}} has banned player [${user}] ${name} with license ${obj.license} and reason ${reason}.`);
            emitNet("chat:addMessage", -1, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^1^*[${user}] ${name} has been banned.`]});
        }
    }
}, true);

RegisterCommand("licenseban", (s, a) => {
    let _s = s;
    let license = a[0];
    let reason = a.slice(1).join(" ");

    if (_s == 0) {
        if(!license) {
            console.log("Please specify a valid Rockstar license.");
        } else if (!reason) {
            console.log("Please specify a reason.");
        } else if (IsPlayerBanned(license)) {
            console.log("This license is already banned.");
        } else {
            BanOfflinePlayer(license, "Console", reason);
            console.log(`Banned player license ${license} with reason ${reason}.`);
        }
    } else if (_s >= 1) {
        if(!license) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", "^*Please specify a valid Rockstar license."]});
        } else if (!reason) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", "^*Please specify a reason."]});
        } else if (IsPlayerBanned(license)) {
            console.log("This license is already banned.");
        } else {
            let sname = GetPlayerName(_s);
            BanOfflinePlayer(license, sname, reason);
            console.log(`[${_s}] ${sname} has banned player license ${license} with reason ${reason}.`);
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^1^*Banned license ${license} for ${reason}.`]});
        }
    }
}, true);

RegisterCommand("baninfo", (s, a) => {
    let _s = s;
    let license = a[0];

    if (_s == 0) {
        if(!license) {
            console.log("Please specify a valid Rockstar license.");
        } else if (!IsPlayerBanned(license)) {
            console.log("This license is not banned.");
        } else {
            let data = UnpackBanData(license);

            console.log(data);
        }
    } else if (_s >= 1) {
        if(!license) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^*Please specify a valid Rockstar license.`]});
        } else if (!IsPlayerBanned(license)) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^*This license is not banned.`]});
        } else {
            let data = UnpackBanData(license);
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^*Ban info: Banned by: ${data.bannedBy} Date: ${data.date} Reason: ${data.reason} Name: ${data.name} License: ${data.license} IP: ${data.ip} Discord: ${data.discord} XboxLive: ${data.xbl} Live: ${data.live} FiveM: ${data.fivem}`]});
        }
    }
}, true);

RegisterCommand("unban", (s, a) => {
    let _s = s;
    let license = a[0];

    if (_s == 0) {
        if(!license) {
            console.log("Please specify a valid Rockstar license.");
        } else if (!IsPlayerBanned(license)) {
            console.log("This license is not banned.");
        } else {
            UnbanPlayer(license);
            console.log("License "+ license +" has been unbanned.");
        }
    } else if (_s >= 1) {
        if(!license) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^*Please specify a valid Rockstar license.`]});
        } else if (!IsPlayerBanned(license)) {
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^*This license is not banned.`]});
        } else {
            UnbanPlayer(license);
            emitNet("chat:addMessage", _s, { color: [255, 255, 255], multiline: true, args: ["^1^*BAN^r", `^1^*Unbanned license ${license}.`]});
        }
    }
}, true);
//
