var NightClubs = [
    {
        id: 1,
        coords: [194.859619, -3167.304, 5.790269851],
        pedHeading: 90,
        name: "Elysian Island",
        blipTextLabel: "NightclubsBlipName_1",
        blipColor: null,
        blipSprite: null,
        markerWidth: 5,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 50, 
        djLightsStyle: 16, // 1-16
        interiorStyle: 2, // 1-4
        djStyle: 4, //1-4, which dj posters should be on the walls
        miscProps: [ // https://web.archive.org/web/20191207165505/https://wiki.rage.mp/index.php?title=Interior_Props
            'Int01_ba_trophy11',
            'Int01_ba_trad_lights',
            'Int01_ba_booze_03',
            'Int01_ba_bar_content',
            'Int01_ba_Screen',
            'int01_ba_lights_screen',
            'Int01_ba_deliverytruck',
            'Int01_ba_dry_ice',
            'Int01_ba_equipment_setup',
            'Int01_ba_security_upgrade',
            'Int01_ba_lightgrid_01'
        ]
    },
    {
        id: 2,
        coords: [51.94660186767, 6486.27685546875, 31.429298950139336],
        pedHeading: 250,
        name: "Paleto Bay",
        blipTextLabel: "NightclubsBlipName_1",
        blipColor: null,
        blipSprite: null,
        markerWidth: 5,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 30, 
        djLightsStyle: null, // 1-16
        interiorStyle: 4, // 1-4
        djStyle: null, //1-4, which dj posters should be on the walls
        miscProps: null
    },
    {
        id: 3,
        coords: [-1285.9260253, -651.1946923, 26.58375359629],
        pedHeading: 30,
        name: "Del Perro",
        blipTextLabel: "NightclubsBlipName_1",
        blipColor: null,
        blipSprite: null,
        markerWidth: 5,
        markerColor: null,
        enterZone: 1.5,
        nearbyZone: 30, 
        djLightsStyle: 16, // 1-16
        interiorStyle: 3, // 1-4
        djStyle: 4, //1-4, which dj posters should be on the walls
        miscProps: [ 
            'Int01_ba_trophy11',
            'Int01_ba_trad_lights',
            'Int01_ba_booze_03',
            'Int01_ba_bar_content',
            'Int01_ba_Screen',
            'int01_ba_lights_screen',
            'Int01_ba_deliverytruck',
            'Int01_ba_dry_ice',
            'Int01_ba_equipment_setup',
            'Int01_ba_security_upgrade',
            'Int01_ba_lightgrid_01',
            'light_rigs_off'
        ]
    }
];
var Sessions = new Map();
var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : TickRate));

NightClubs.forEach(club => {
    Sessions.set(club.id, {
        Club: club,
        Players: []
    });
});

function SendClubsToClient(source) {
    emitNet('Nightclubs:ClubsReceived', source, JSON.stringify(NightClubs))
}

onNet('Nightclubs:ClubsRequest', () => {
    var source = global.source;
    SendClubsToClient(source);
});

function GetNightclubById (id) {
    if (!id) return false;
    return NightClubs.find(n => n.id === id);
} 

function GetNightclubsExcluding(id) {
    if (!id) return false;
    return NightClubs.filter(nc => nc.id !== id);
}

function AddPlayerToNightclubSession(source, club) {
    if (!Sessions.has(club.id)) return false;
    
    var Session = Sessions.get(club.id);
    Session.Players.push({
        name: GetPlayerName(source),
        id: source, 
        enteredAt: Date.now()
    });
    Sessions.delete(club.id);
    Sessions.set(club.id, Session);

    return Sessions;
}

function GetPlayersFromNightclubsExcluding(clubId) {
    if (!clubId) return false;

    var Players = [];
    Sessions.forEach(async Session => {
        if (Session.Club.id !== clubId) {
            var _Players = Session.Players;
            Players = Players.concat(_Players);
        }
    });

    console.log('GetPlayersFromNightclubsExcluding:')
    console.log(Players)

    return Players;
}

function AcceptEnterRequest(source, club) {
    console.log('accepting enter req')
    AddPlayerToNightclubSession(source, club);
    var Players = GetPlayersFromNightclubsExcluding(club);
    emitNet("Nightclubs:EnterRequestAccepted", source, JSON.stringify(Players));
}

function RejectEnterRequest(source, club) {
    emitNet("Nightclubs:EnterRequestRejected", source);
}

function AcceptExitRequest(source, club) {
    RemovePlayerFromNightclubSession(source, club);
    emitNet("Nightclubs:ExitRequestAccepted", source);
}

function RemovePlayerFromNightclubSession(source, club) {
    if (!Sessions.has(club.id)) return false;

    var Session = Sessions.get(club.id);
    Session.Players = Session.Players.filter(p => p.id !== source);
    Sessions.delete(club.id);
    Sessions.set(club.id, Session);

    return Sessions; 
}

function GetNightclubPlayerIsIn(source) {
    var currentClub = null;
    Sessions.forEach(async session => {
        if (session.Players.find(p => p.id === source)) {
            currentClub = session.Club;
        }

        await Wait(0);
    });

    return currentClub;
}

onNet("Nightclubs:EnterRequest", (clubString) => {
    var source = global.source;
    var club = JSON.parse(clubString);
    //RejectEnterRequest(source);
    AcceptEnterRequest(source, club);
});

onNet("Nightclubs:ExitRequest", (clubString) => {
    var source = global.source;
    var club = JSON.parse(clubString);
    AcceptExitRequest(source, club);
});

function CMD (source, args) {
    if (args.length < 1) return emitNet(source, "chat:addMessage", {
        args: [
            "^1Error", "Not enough arguments"
        ]
    });

    switch (args[0].toLowerCase()) {
        case 'enter':
            if (!args[1] || !args[2]) return emitNet(source, "chat:addMessage", {
                args: ["^1Syntax", "/club enter <club name>"]
            });

            var club = NightClubs.find(nc => {
                if (!isNaN(args.slice(1).join(" "))) {
                    return nc.id === parseInt(args[1]);
                } else {
                    return nc.name.replace(/ /g, '').toLowerCase().includes(args.slice(1).join('').toLowerCase());
                }
            });

            if (!club) {
                return emitNet(source, "chat:addMessage", {
                    args: ["^1Error", "Couldn't find a nightclub with such id."]
                });
            }

            AcceptEnterRequest(source, club);
        break;
        case 'clubinfo':
            console.log(GetNightclubPlayerIsIn(source));
        break;
    }
}

RegisterCommand('club', CMD);
/*RegisterCommand('clubseval', (source, args) => {
    const evaled = eval(args.join(" "));
    console.log(evaled)
})*/
RegisterCommand('addfakeplayer', (source, args) => {
    AddPlayerToNightclubSession(parseInt(args[0]), {id: parseInt(args[1])});
})