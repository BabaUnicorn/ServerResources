var NightClubs = [
    {
        id: 1,
        coords: [194.859619, -3167.304, 5.790269851],
        garageEntryCoords: [227.72196960, -3133.683837890, 5.79026985168336],
        garageEnterZone: 2,
        pedHeading: 90,
        pedHeading_Garage: 0,
        name: "Elysian Island",
        blipTextLabel: "NightclubsBlipName_1",
        description: "Forget homely blue-collar neighborhoods and picturesque abandoned factories. If you want a real challenge, try gentrifying a dockside slum that's knee-deep in industrial discharge and dead fish. If you can bring the A-listers here, you can bring them anywhere.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 50, 
        djLightsStyle: 16, // 1-16
        interiorStyle: 1, // 1-4
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
        ],
        IplLoadOnStartup: [
            'ba_barriers_case7', 
            'ba_case7_madonna' // ba_case7_taleofus, ba_case7_dixon, ba_case7_taleofus
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 2,
        coords: [-676.9856567382812, -2458.77294921874, 13.944400787353516],
        garageEntryCoords: [-665.5626220703125, -2379.70361328125, 13.913711547851562],
        garageEnterZone: 2,
        pedHeading_Garage: 50,
        pedHeading: 90,
        name: "LSIA",
        blipTextLabel: "NightclubsBlipName_1",
        description: "Imagine you're an international businessperson looking for a world-class night out, but you'd rather not stray too far from your private jet in case the FIB hears you're on American soil. There's only one way to cater to that vital demographic, and this location is it.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 100, 
        djLightsStyle: 16, // 1-16
        interiorStyle: 1, // 1-4
        djStyle: 2, //1-4, which dj posters should be on the walls
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
        ],
        IplLoadOnStartup: [
            'ba_barriers_case6',
            'ba_case6_dixon'
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 3,
        coords: [-1173.8505859374, -1153.390869140625, 5.657962799072266],
        garageEntryCoords: [-1171.3313720803125, -1160.2467041015625, 5.643533606665039],
        garageEnterZone: 2,
        pedHeading_Garage: 270,
        pedHeading: 304,
        name: "Vespucci Canals",
        blipTextLabel: "NightclubsBlipName_1",
        description: "There's only one thing needed to push the Vespucci Canals into being more European than Europe, and that's a wildly pretentious and brutally overpriced nightclub set amid the ruins of once-profitable commerce and industry.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 50, 
        djLightsStyle: 15, // 1-16
        interiorStyle: 1, // 1-4
        djStyle: 3, //1-4, which dj posters should be on the walls
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
        ],
        IplLoadOnStartup: [
            'ba_case9_taleofus',
            'ba_barriers_case9'
        ],
        IplUnloadOnStartup: null,
        nearbyObjectsToHide: [
            GetHashKey('prop_boxpile_02d'),
            GetHashKey('prop_rub_cardpile_01')
        ]
    },
    {
        id: 4,
        coords: [870.64013, -2100.448730, 30.4558963],
        garageEntryCoords: [891.0714111328125, -2094.29052734375, 30.74435043334961],
        garageEnterZone: 2,
        pedHeading_Garage: 0,
        pedHeading: 90,
        name: "Cypress Flats",
        blipTextLabel: "NightclubsBlipName_1",
        description: "Cypress Flats is currently in that perfect sweet spot for a new club, it has barrels overflowing with post-industrial cool, but very little housing, so there's nowhere for the hipsters to roost. This place is staying on the edge for years to come.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 50, 
        djLightsStyle: 10, // 1-16
        interiorStyle: 2, // 1-4
        djStyle: 3, //1-4, which dj posters should be on the walls
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
        ],
        IplLoadOnStartup: [
            'ba_barriers_case4',
            'ba_case4_madonna'
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 5,
        coords: [345.8825988769531, -977.84814453125, 29.375164031982422],
        garageEntryCoords: [333.21881103515626, -996.3676513671875336, 29.253732681274414],
        garageEnterZone: 2,
        pedHeading_Garage: 180,
        pedHeading: 270,
        name: "Mission Row",
        blipTextLabel: "NightclubsBlipName_1",
        description: "A wise man once said that wealth is relative. And nothing will accentuate the astonishing wealth of your clientele like stepping out for a cigarette and gazing compassionately at the highest concentration of vagrancy in the stage.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 0.65,
        nearbyZone: 50, 
        djLightsStyle: 13, // 1-16
        interiorStyle: 2, // 1-4
        djStyle: 3, //1-4, which dj posters should be on the walls
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
        ],
        IplLoadOnStartup: [
            'ba_barriers_case1',
            'ba_case1_dixon'
        ],
        IplUnloadOnStartup: [
            'ba_case1_forsale'
        ]
    },
    {
        id: 6,
        coords: [758.0218505859375, -1332.5600000, 27.27522850033621],
        garageEntryCoords: [767.849365234375, -1328.6657494140626, 26.22994692999336336],
        garageEnterZone: 2,
        pedHeading_Garage: 270,
        pedHeading: 270,
        name: "La Mesa",
        blipTextLabel: "NightclubsBlipName_1",
        description: "As well as being walking distance for the young professionals in Mirror Park, this is also the only location in town where the roar of the interstate doubles as the world's biggest sub-woofer.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 0.48,
        nearbyZone: 50, 
        djLightsStyle: 9, // 1-16
        interiorStyle: 2, // 1-4
        djStyle: 1, //1-4, which dj posters should be on the walls
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
        ],
        IplLoadOnStartup: [
            'ba_case0_madonna',
            'ba_barriers_case0'
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 7,
        coords: [-120.69123077, -1258.66028432904, 29.304134234],
        garageEntryCoords: [-164.08103942771094, -1294.605712890625, 31.232319871111111111],
        garageEnterZone: 2,
        pedHeading_Garage: 180,
        pedHeading: 270,
        name: "Strawberry",
        blipTextLabel: "NightclubsBlipName_1",
        description: "One of the little-known perks of setting up a nightclub in a disused paint factory is the presence of high residual levels of industrial solvent. Good atmosphere, happy patrons, all night, guaranteed.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 100, 
        djLightsStyle: 10, // 1-16
        interiorStyle: 3, // 1-4
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
        ],
        IplLoadOnStartup: [
            'ba_case2_taleofus',
            'ba_barriers_case2'
        ],
        IplUnloadOnStartup: [
            'ba_case2_forsale'
        ]
    },
    {
        id: 8,
        coords: [-1285.7475597, -651.4150390, 26.58375358],
        garageEntryCoords: [-1263.8533935546876, -657.4403076171875, 26.664925428933664],
        garageEnterZone: 2,
        pedHeading_Garage: 300,
        pedHeading: 30,
        name: "Del Perro",
        blipTextLabel: "NightclubsBlipName_1",
        description: "This charming 20's style building in Del Perro has just enough residual class to offer a post-ironic thrill when you turn it into a throbbing techno dungeon.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1.5,
        nearbyZone: 50, 
        djLightsStyle: 16, // 1-16
        interiorStyle: 3, // 1-4
        djStyle: 3, //1-4, which dj posters should be on the walls
        miscProps: [ // https://web.archive.org/web/20191207165505/https://wiki.rage.mp/index.php?title=Interior_Props
            'Int01_ba_trophy11',
            'Int01_ba_booze_03',
            'Int01_ba_bar_content',
            'Int01_ba_Screen',
            'int01_ba_lights_screen',
            'Int01_ba_deliverytruck',
            'Int01_ba_dry_ice',
            'Int01_ba_equipment_setup',
            'Int01_ba_security_upgrade',
            'Int01_ba_lightgrid_01'
        ],
        IplLoadOnStartup: [
            'ba_case5_solomun',
            'ba_barriers_case5'
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 9,
        coords: [371.3033447265625, 253.2254333490938, 103.0097427368164],
        garageEntryCoords: [379.62298583984375, 227.6638641357422, 103.040725570800781],
        garageEnterZone: 2,
        pedHeading_Garage: 270,
        pedHeading: 0,
        name: "Downtown Vinewood",
        blipTextLabel: "NightclubsBlipName_1",
        description: "Downtown Vinewood is the entertainment capital of Los Santos: Oriental Theater, Whirligig Theater, Doppler Cinema - and right in the heart of it, basking in all its abandoned commercial chic, there's a nightclub location with your name on it.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 70, 
        djLightsStyle: 15, // 1-16
        interiorStyle: 3, // 1-4
        djStyle: 2, //1-4, which dj posters should be on the walls
        miscProps: [ // https://web.archive.org/web/20191207165505/https://wiki.rage.mp/index.php?title=Interior_Props
            'Int01_ba_trophy11',
            'Int01_ba_booze_03',
            'Int01_ba_bar_content',
            'Int01_ba_Screen',
            'int01_ba_lights_screen',
            'Int01_ba_deliverytruck',
            'Int01_ba_dry_ice',
            'Int01_ba_equipment_setup',
            'Int01_ba_security_upgrade',
            'Int01_ba_lightgrid_01'
        ],
        IplLoadOnStartup: [
            'ba_barriers_case8',
            'ba_case8_solomun'
        ],
        IplUnloadOnStartup: null,
        nearbyObjectsToHide: [
            GetHashKey('prop_dumpster_02b'),
            GetHashKey('prop_dumpster_01a'),
            GetHashKey('prop_rub_boxpile_06'),
            GetHashKey('prop_rub_binbag_06'),
            GetHashKey('prop_rub_binbag_03b'),
            GetHashKey('prop_bin_07b'),
            GetHashKey('prop_rub_boxpile_06')
        ]
    },
    {
        id: 10,
        coords: [4.677425384521484, 220.2642648468017578, 107.51250915527344],
        garageEntryCoords: [-22.04743003845215, 217.9908905029287, 106.59608459472656],
        garageEnterZone: 2,
        pedHeading_Garage: 180,
        pedHeading: 30,
        name: "West Vinewood",
        blipTextLabel: "NightclubsBlipName_1",
        description: "It's hard to find a suitably scuzzy location in West Vinewood. This place was actually in pristine condition until we paid some drifters to live in it for a couple months: now it has all the character it needs, and then some.",
        blipColor: null,
        blipSprite: null,
        markerColor: null,
        enterZone: 1,
        nearbyZone: 50, 
        djLightsStyle: 14, // 1-16
        interiorStyle: 3, // 1-4
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
        ],
        IplLoadOnStartup: [
            'ba_barriers_case3',
            'ba_case3_madonna'
        ],
        IplUnloadOnStartup: null
    },
    {
        id: 11,
        coords: [15.34983052, 6436.1967773437, 31.425300598144],
        garageEntryCoords: [32.33614831542969, 6446.662109375, 31.42527961730457],
        garageEnterZone: 2,
        pedHeading_Garage: 270,
        pedHeading: 170,
        name: "Paleto Bay",
        blipTextLabel: null,
        description: null,
        blipColor: null,
        blipSprite: null,
        markerColor: [0, 90, 199, 150],
        enterZone: 1,
        nearbyZone: 40, 
        djLightsStyle: null, // 1-16
        interiorStyle: 4, // 1-4
        djStyle: null, //1-4, which dj posters should be on the walls
        miscProps: null
    }
];
var DebugLogsEnabled = true;
var MyName = GetCurrentResourceName();
var RoutingBucketEnabled = true;
var NightclubsWorldId = 6;
var InVirtualWorld = [];
var Sessions = new Map();
var PlayersCache = [];
var PlayerInvites = [];
var InviteIds = 0;
var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : TickRate));

NightClubs.forEach(club => {
    Sessions.set(club.id, {
        Host: null,
        Club: club,
        Players: []
    });
});

function DebugLog(text, bypass) {
    if (DebugLogsEnabled || bypass) {
        var date = new Date();
        var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(`^6(${time}) ${MyName} debug: ^0${text}`);
    }
}

function TimeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " mo";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " ms";
    }

    return Math.floor(seconds) + " s";
  }

function GetPlayerFullName(id) {
    return `[${id}] ${GetPlayerName(id)}`
}

function GetPlayers() {
    let t = []

    for (let i = 0; i < GetNumPlayerIndices(); i++) {
        t.push(parseInt(GetPlayerFromIndex(i)));
    }

    return t;
}

function AddPlayerToCache(id) {
    if (!id) {
        return null;
    } else if (IsPlayerCached(id)) {
        DebugLog(`Error: Player ${id} is already cached.`, true);
        return false;
    }
    
    var name = GetPlayerName(id);
    var Info = {
        id: id,
        name: name,
        fullName: `[${id}] ${name}`,
        identifiers: GetNumPlayerIdentifiers(id)
    };

    PlayersCache.push(Info);
    DebugLog(`AddPlayerToCache: Added player ${id} to cache`);

    return PlayersCache;
}

function IsPlayerCached(id) {
    if (!id) return null;
    return ((PlayersCache.find(p => p.id === id)) ? true : false);
}

function RemovePlayerFromCache(id) {
    if (!id) return null;
    PlayersCache = PlayersCache.filter(p => p.id !== id);
    return PlayersCache;
}

function GetPlayerFromCache(id) {
    if (!id) return null;
    var player = PlayersCache.find(player => player.id === id);
    return (player ? player : null);
}

function SearchPlayerFromCacheWithName(name) {
    if (!name) return null;
    var player = PlayersCache.find(player => player.name.toLowerCase().replace(/ /g, '').includes(name.toLowerCase().replace(/ /g, '')));
    return (player ? player : null);
}

GetPlayers().forEach(async player => {
    AddPlayerToCache(player);
    await Wait(5);
});

function CreateInvite(from, to, club) {
    if (!from || !to || !club) return false;

    InviteIds += 1;
    PlayerInvites.push({
        from: from,
        from_Name: GetPlayerName(from),
        to: to,
        to_Name: GetPlayerName(to),
        club: club,
        inviteId: InviteIds,
        invitedTimestamp: Date.now()
    });
    
    return InviteIds;
}

function GetPlayersInvites(id) {
    return PlayerInvites.filter(Inv => parseInt(Inv.to) === id);
}

function IsPlayerInvitedToNightclub(id, club) {
    if (!id || !club) return null;
    var result = PlayerInvites.find(inv => inv.to === id && inv.club.id === club.id);
    return (result ? true : false);
}

function GetInviteById(id) {
    if (!id) return false;
    var result = PlayerInvites.find(i => i.inviteId === id);
    return (result ? result : null);
}

function DeleteInvite(id) {
    if (!id) return false;
    PlayerInvites = PlayerInvites.filter(i => i.inviteId !== id);
    return PlayerInvites;
}

function SendClubsToClient(source) {
    DebugLog(`Sent ${NightClubs.length} clubs to ${GetPlayerFullName(source)}`);
    emitNet('Nightclubs:ClubsReceived', source, JSON.stringify(NightClubs))
}

onNet('Nightclubs:ClubsRequest', () => {
    var source = global.source;
    DebugLog(`${GetPlayerFullName(source)} requested all nightclubs...`);
    SendClubsToClient(source);
    if (!IsPlayerCached(source)) AddPlayerToCache(source);
});

on('onResourceStop', (resource) => { // TEST THIS
    if (GetCurrentResourceName() === resource) {
        DebugLog(`^1The resource has stopped.^0`);
        InVirtualWorld.forEach(async p => {
            DebugLog(`Set virtual world to 0 for player [${p}] ${GetPlayerName(p)} due to resource stop.`);
            SetPlayerRoutingBucket(p, 0);
            await Wait(5);
        });
    }
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

    DebugLog(`AddPlayerToNightclubSession: Added player ${GetPlayerFullName(source)} to a nightclub (${club.id} ${club.name}) session.`);

    return Sessions;
}

function SessionsGetPlayer(playerId, clubId) {
    if (!playerId || !clubId || (clubId && !Sessions.has(clubId))) return null;
    var Session = Sessions.get(clubId);
    var result = Session.Players.find(Player => Player.id === playerId);

    return (result ? result : null);
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

    DebugLog(`GetPlayersFromNightclubsExcluding: ${Players.length} players found`);

    return Players;
}

async function AcceptEnterRequest(source, club, EnterMethod) {
    DebugLog('AcceptEnterRequest: accepting enter req');
    if (RoutingBucketEnabled) {
        SetPlayerRoutingBucket(source, NightclubsWorldId);
        InVirtualWorld.push(source);
        DebugLog(`AcceptEnterRequest: Set routing bucket of ${GetPlayerFullName(source)} to ${NightclubsWorldId}`);
    }

    await Wait(1000);

    AddPlayerToNightclubSession(source, club);
    var Players = GetPlayersFromNightclubsExcluding(club.id);
    emitNet("Nightclubs:EnterRequestAccepted", source, JSON.stringify(Players), EnterMethod);
    var Time = 0;
    Players.forEach(async p => {
        DebugLog(`AcceptEnterRequest: Sending request to hide ${source} ${GetPlayerFullName(source)} (player who just entered) to player ${p.id} (${GetPlayerFullName(p.id)})`);
        emitNet("Nightclubs:HidePlayer", p.id, source);

        Time += 10;
        await Wait(Time)
    });
}

function RejectEnterRequest(source, club) {
    DebugLog(`RejectEnterRequest: Rejected entry request of ${GetPlayerFullName(source)}`);
    emitNet("Nightclubs:EnterRequestRejected", source);
}

function RemovePlayerFromNightclubSession(source, club) {
    if (!Sessions.has(club.id)) return false;

    var Session = Sessions.get(club.id);
    Session.Players = Session.Players.filter(p => p.id !== source);
    Sessions.delete(club.id);
    Sessions.set(club.id, Session);

    DebugLog(`RemovePlayerFromNightclubSession: Removed player ${GetPlayerFullName(source)} from session ${club.id}`);

    return Sessions; 
}

function RunExitFunctions(source, club, Method) {
    if (RoutingBucketEnabled) {
        SetPlayerRoutingBucket(source, 0);
        InVirtualWorld = InVirtualWorld.filter(p => p !== source);
        DebugLog(`RunExitFunctions: Set routing bucket of ${GetPlayerFullName(source)} **back** to 0`);
    }
    RemovePlayerFromNightclubSession(source, club);
}

function AcceptExitRequest(source, club, Method) {
    DebugLog(`AcceptExitRequest: Accepting request.....`);
    DebugLog(`AcceptExitRequest: Running exit functions...`);
    RunExitFunctions(source, club, Method);
    emitNet("Nightclubs:ExitRequestAccepted", source, Method);
    DebugLog(`AcceptExitRequest: Accepted exit request with exit method ${Method}`);
}

function GetNightclubPlayerIsIn(source) {
    var currentClub = null;
    Sessions.forEach(async session => {
        if (session.Players.find(p => p.id === source)) {
            currentClub = session.Club;
        }

        //await Wait(0);
    });

    return currentClub;
}

function GetClubTxd(clubId) {
	if (!clubId) return null;

	switch (clubId) {
		case 1:	
			return "club_elysian";
		break;
		case 2:
			return "club_lsia";
		break;
		case 3:
			return "club_vespucci";
		break;
		case 4:
			return "club_cypress";
		break;
		case 5:
			return "club_mission";
		break;
		case 6:
			return "club_lamesa";
		break;
		case 7:
			return "club_strawberry";
		break;
		case 8:
			return "club_delperro";
		break;
		case 9:
			return "club_terminal";
		break;
		case 10:
			return "club_vinewood";
		break;
		default:
			return "club_vinewood";
		break;
	}
}

function SendErrorMessage(playerId, msg) {
    if (!playerId || !msg) return false;
    emitNet('chat:addMessage', playerId, {args: ['^1Error', msg]});
    return true;
}

onNet("Nightclubs:EnterRequest", async (clubString, EnterMethod) => {
    var source = global.source;
    DebugLog(`Nightclubs:EnterRequest: ${GetPlayerFullName(source)} requested entry...`);
    var club = JSON.parse(clubString);
    //RejectEnterRequest(source);
    await AcceptEnterRequest(source, club, EnterMethod);
});

onNet("Nightclubs:ExitRequest", (clubString, Method) => {
    var source = global.source;
    DebugLog(`Nightclubs:ExitRequest: ${GetPlayerFullName(source)} requested exit...`);
    var club = JSON.parse(clubString);
    AcceptExitRequest(source, club, Method);
});

on('playerDropped', reason => {
    var source = global.source;
    var club = GetNightclubPlayerIsIn(source)
    if (club) {
        DebugLog(`${GetPlayerFullName(source)} dropped (reason: ${reason}) while inside a nightclub. Removing them from session...`);
        RemovePlayerFromNightclubSession(source, club);
        RemovePlayerFromCache(source);
        InVirtualWorld = InVirtualWorld.filter(vwp => vwp !== source);
    }
});

function CMD (source, args) {
    if (args.length < 1) return emitNet("chat:addMessage", source, {
        args: [
            "^1Error", "Not enough arguments"
        ]
    });

    switch (args[0].toLowerCase()) {
        case 'exit':
            var Club = GetNightclubPlayerIsIn(source);
            if (!Club) return emitNet("chat:addMessage", source, {
                args: [
                    "^1Error", "You aren't inside any nightclub."
                ]
            });
            var Session = SessionsGetPlayer(source, Club.id);
            if ((Date.now() - Session.enteredAt) <= 10000) return SendErrorMessage(source, `Exit cooldown active... try again later!`);

            RunExitFunctions(source, Club, 1);
            emitNet('Nightclubs:ExitNightClub', source, JSON.stringify(Club));
        break;
        case 'tp':
        case 'teleport':
            if (GetNightclubPlayerIsIn(source)) return SendErrorMessage(source, `Unavailable while inside a nightclub.`);

            var Club = NightClubs.find(nc => nc.name.toLowerCase().replace(/ /g, '').includes(args.slice(1).join('').toLowerCase()));
            if (!Club) return emitNet("chat:addMessage", source, {
                args: [
                    "^1Error", "Incorrect nightclub name was specified."
                ]
            });

            emitNet('Nightclubs:Tp', source, JSON.stringify(Club));
        break;
        case 'toggle':
        case 'tog':
            if (GetNightclubPlayerIsIn(source)) return SendErrorMessage(source, `Unavailable while inside a nightclub.`);

            emitNet('Nightclubs:Toggle', source);
        break;
        case 'list':
            var Fields = [];
            Sessions.forEach(async session => {
                Fields.push({
                    Left_Text: ` ${session.Club.name}`,
                    Right_Text: "~l~" + String(session.Players.length),
                    Right_Text_Background_Banner: 3,
                    _Players: session.Players.length
                });
            });
            Fields = Fields.sort((a, b) => a._Players - b._Players).reverse();
            emitNet('Nightclubs:Scoreboard', source, "NIGHTCLUBS", JSON.stringify(Fields));
        break;
        case 'info':
            var Club = GetNightclubPlayerIsIn(source);
            if (!Club) return SendErrorMessage(source, `You have to be in a nightclub.`);
            emitNet('Nightclubs:Bigfeed', source, "Nightclubs", Club.name, Club.description, "foreclosures_club", "lighting4", 0, "Close", true);
        break;
        case 'help':
            emitNet('Nightclubs:Bigfeed', source, "Nightclubs", "NightclubsInformation", "NightclubsHelpBody", "foreclosures_club", "lighting4", 0, "Close", true, true);
        break;
        case 'invite':
            if (!args[1]) return SendErrorMessage(source, `Incorrect syntax.`);
            var Player = SearchPlayerFromCacheWithName(args.slice(1).join(" "));
            var InvitersClub = GetNightclubPlayerIsIn(source);
            if (!InvitersClub) {
                return SendErrorMessage(source, `You have to be in a nightclub.`);
            } else if (!Player) {
                return SendErrorMessage(source, `Invalid player: ${args.slice(1).join(" ")}`);
            } else if (GetNightclubPlayerIsIn(Player.id) && GetNightclubPlayerIsIn(Player.id) === InvitersClub.id) {
                return SendErrorMessage(source, `Player is already inside.`);
            } else if (IsPlayerInvitedToNightclub(Player.id, InvitersClub)) {
                return SendErrorMessage(source, `Player has already been invited to this club.`);;
            }

            var InviterInfo = GetPlayerFromCache(source);
            var Invite = CreateInvite(source, Player.id, InvitersClub);

            emitNet('Nightclubs:InviteNotification', Player.id, JSON.stringify(InviterInfo), JSON.stringify(InvitersClub), Invite);
            emitNet('chat:addMessage', source, {args: ['^2Success', `Invited ${Player.name} to ${InvitersClub.name}`]});
        break;
        case 'accept':
            if (!args[1]) return emitNet('chat:addMessage', source, {args: ['^1Syntax', `/club accept <Invite ID>. Use /club invites to view all your invites.`]});
            var Invite = GetInviteById(parseInt(args[1]));
            if (!Invite) {
                return SendErrorMessage(source, `Invalid invite ID. Use /club invites to your all invites.`);
            } else if (GetNightclubPlayerIsIn(source)) {
                return SendErrorMessage(source, `Unavailable while inside a nightclub.`);
            } else if ((Date.now() - Invite.invitedTimestamp) >= 600000) {
                DeleteInvite(Invite.inviteId);
                return SendErrorMessage(source, `This invite is expired.`);
            }

            DeleteInvite(Invite.inviteId);
            emitNet('Nightclubs:TpToClubInside', source, JSON.stringify(Invite.club));
        break;
        case 'invites':
            var Invites = GetPlayersInvites(source);
            if (Invites.length < 1) return SendErrorMessage(source, `No invites yet...`);
            var Fields = [];
            Invites.forEach(inv => {
                Fields.push({
                    type: 0,
                    text1: '~h~'+ inv.inviteId,
                    text2: '',
                    text3: '',
                    text4: inv.from_Name,
                    text5: '', //
                    text6: inv.club.name,
                    text7: '',
                    text8: String(((Date.now() - inv.invitedTimestamp) / 60000).toFixed()) + '/10 minutes',
                    text9: '',
                    text10: ''
                });
            });
            Fields.push({
                type: 7,
                text1: "TIP:",
                text2: 'Use /club accept [invite id] to accept an invite.',
                text3: '',
                text4: '',
                text5: '', //
                text6: '',
                text7: '',
                text8: '',
                text9: '',
                text10: ''
            });
            var Titles = ['Invite ID', 'Invited by', '', 'Club name', '', 'Expires in', '', ''];

            emitNet('Nightclubs:Scoreboard_2', source, "NIGHTCLUB INVITES", Titles, Fields);           
        break;
    }
}

RegisterCommand('club', CMD);
RegisterCommand('clubs', CMD);
RegisterCommand('nightclub', CMD);
RegisterCommand('nightclubs', CMD);
/*RegisterCommand('clubseval', (source, args) => {
    const evaled = eval(args.join(" "));
    console.log(evaled)
})
RegisterCommand('addfakeplayer', (source, args) => {
    AddPlayerToNightclubSession(parseInt(args[0]), {id: parseInt(args[1])});
})*/
