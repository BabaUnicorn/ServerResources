// dm using default chat

let HasBeenMessaged = false;
let Replier;

const Staff = {
    fef89de0d6ac7ad53a337c5d54c239c109b074a4: "lou"
}

RegisterCommand("dm", (s, a) => {
    let _source = s;
    let _query = a[0];
    let _msg = a.slice(1).join(" ");
    let _players = getPlayers();

    let _found = _players.includes(_query);

    if (_found && _msg && _query != _source) {
        //console.log("SERVER ID " + _query + " MESSAGE " + _msg);

        let _sendername;

        if (_source >= 1) {
            _sendername = GetPlayerName(_source);
        } else {
            _sendername = "Server Console";
        }

        emitNet("dm:totarget", _query, _source, _sendername, _msg);

        if (!HasBeenMessaged && Replier != _query) {
            HasBeenMessaged = true;
            Replier = _source;
        }

    } else if (!_found) {
        //console.log("NO SERVER ID");
        emitNet("dm:invalidid", _source);
    } else if (!_msg) {
        //console.log("NO MESSAGE");
        emitNet("dm:nomessage", _source);
    } else if (_query == _source) {
        //console.log("cant dm yourself");
        emitNet("dm:selfdmerror", _source);
    }
});

RegisterCommand("r", (s, a) => {
    let _source = s;
    let _msg = a.slice(0).join(" ");

    let _sendername;

    if (_source >= 1) {
        _sendername = GetPlayerName(_source);
    } else {
        _sendername = "Server Console";
    }

    if (HasBeenMessaged && _msg && Replier >= 1) {
        //console.log("You have been messaged before");
        emitNet("dm:totargetreply", Replier, _source, _sendername, _msg);
    } else if (!HasBeenMessaged && Replier == 0) {
        //console.log("You havent been messaged before");
        emitNet("dm:notmessaged", _source);
    } else if (!_msg) {
        //console.log("No message provided.")
        emitNet("dm:nomessage", _source);
    }
});

RegisterCommand("toggledm", (s) => {
    emitNet("dm:toggledm", s);
});

onNet("dm:togerror", (forward) => {
    //console.log("received tog error, sending info to other client.");
    emitNet("dm:notsent", forward);
});

RegisterCommand("adm", (s, a) => {
    let _source = s;
    let _query = a[0];
    let _msg = a.slice(1).join(" ");
    let _players = getPlayers();

    let _found = _players.includes(_query);

    if (_found && _msg) {
        //console.log("SERVER ID " + _query + " MESSAGE " + _msg);

        let _sendername;

        if (_source >= 1) {
            _sendername = "Staff"
        } else {
            _sendername = "Server Console";
        }

        emitNet("dm:stafftotarget", _query, _sendername, _msg);

    } else if (!_found) {
        //console.log("NO SERVER ID");
        emitNet("dm:invalidid", _source);
    } else if (!_msg) {
        //console.log("NO MESSAGE");
        emitNet("dm:nomessage", _source);
    }
}, true);

onNet("chatMessage", (s, a, m) => {
    if (IsPlayerStaff(s) == "Server Console") {
        CancelEvent();
        emitNet("dm:addconsolemsg", -1, m);
    } else if (IsPlayerStaff(s)) {
        CancelEvent();
        emitNet("dm:addstaffmsg", -1, s, a, m);
    } else if (!IsPlayerStaff(s) && m.length > 120 && !DoesMessageContainsBlacklistedWords(m)) {
        let newmsg = ShortenMsg(m);
        CancelEvent();
        emitNet("dm:addplayermsg", -1, s, a, newmsg);
    } else if (!IsPlayerStaff(s) && m.length < 120 && !DoesMessageContainsBlacklistedWords(m)) {
        CancelEvent();
        emitNet("dm:addplayermsg", -1, s, a, m);
    } else if (!IsPlayerStaff(s) && DoesMessageContainsBlacklistedWords(m)) {
        CancelEvent();
    }
})

function DoesMessageContainsBlacklistedWords(message) {
    if (message.includes("faggot") || message.includes("nigger") || message.includes("nigga") || message.includes("tiago modz") || message.includes("dopamine") || message.includes("cheat")) {
        return true;
    } else {
        return false;
    }
}

function ShortenMsg(message) {
    if (message.length > 120) {
        let length = message.length;
        let diff = length - 120;
        let newmsg = message.slice(diff);
        return newmsg;
    } else {
        return message;
    }
}

function IsPlayerStaff(plr) {
    if (plr >= 1) {
        let _query = exports.allowlist.getLicense(plr);
        let _entries = Object.keys(Staff);
        if (_entries.includes(_query)) {
            return true;
        } else {
            return false;
        }    
    } else if (plr == 0) {
        let cns = "Server Console";
        return cns;
    }
}