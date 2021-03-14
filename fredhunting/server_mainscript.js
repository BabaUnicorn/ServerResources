var DefaultAnimals = [
    {
        name: "Boar",
        priceRange: [100, 1000],
        model: "a_c_boar",
        modelHash: GetHashKey("a_c_boar")
    },
    {
        name: "Coyote",
        priceRange: [100, 600],
        model: "a_c_coyote",
        modelHash: GetHashKey("a_c_coyote")
    },
    {
        name: "Mountain Lion",
        priceRange: [100, 500],
        model: "a_c_mtlion",
        modelHash: GetHashKey('a_c_mtlion')
    },
    {
        name: "Deer",
        priceRange: [100, 1000],
        model: "a_c_deer",
        modelHash: GetHashKey("a_c_deer")
    },
    {
        name: "Cormorant",
        priceRange: [100, 1000],
        model: "a_c_cormorant",
        modelHash: GetHashKey("a_c_cormorant")
    },
    {
        name: "Rabbit",
        priceRange: [100, 1000],
        model: "a_c_rabbit_01",
        modelHash: GetHashKey("a_c_rabbit_01")
    },
    {
        name: "Crow",
        priceRange: [100, 500],
        model: "a_c_crow",
        modelHash: GetHashKey('a_c_crow')
    }
];
var Zones = [
	{
		"id": 1,
        "enabled": true,
		"coords": [-1028, 4243, 100],
		"name": "Mount. Josiah & Roton Canyon wilderness",
		"hudColor": null, /* [r, g, b] */
		"zone": 860,
        "playerSwitchType": 289263, // 7373 289263 1
        "blipColor": null,
        "blipSprite": null,
        "blipNameLabel": "HuntingBlipName_1",
        "ongoingGameRadarIsEnabled": true,
        "ongoingGameAnimalBlipsEnabled": false, //
        "radarZoomoutAni": false,
        "enablePopulating": true,
        "killLimit": 100,
        "gameDuration": 3600000,
        "overrideClockTime": null,
        "clockPaused": false,
        "overrideWeather": null,
        "weatherPaused": false,
        "animals": DefaultAnimals,
        "artificialAnimalSpawnPoints": [
            [-1011, 4445, 94.4], [-793, 4369, 73.2]
        ],
        "artificialAnimalSpawnChancePerSecond": [1, 110]
	},
    {
		"id": 2,
        "enabled": true,
		"coords": [2402, -1912, 68],
		"name": "Palomino Highlands",
		"hudColor": null, /* [r, g, b] */
		"zone": 630,
        "playerSwitchType": 289263, // 7373 289263 1
        "blipColor": null,
        "blipSprite": null,
        "blipNameLabel": "HuntingBlipName_1",
        "ongoingGameRadarIsEnabled": true,
        "ongoingGameAnimalBlipsEnabled": true, //
        "radarZoomoutAni": false,
        "enablePopulating": true,
        "killLimit": 100,
        "gameDuration": 3600000,
        "overrideClockTime": null,
        "clockPaused": false,
        "overrideWeather": null,
        "weatherPaused": false,
        "animals": DefaultAnimals,
        "artificialAnimalSpawnPoints": [
            [2436, -1990, 53],
            [2652, -1655, 21.69]
        ],
        "artificialAnimalSpawnChancePerSecond": [1, 150]
	},
    {
		"id": 9999999,
        "enabled": false,
		"coords": [-1819, -783, 8],
		"name": "test zone",
		"hudColor": [100, 0, 0], /* [r, g, b] */
		"zone": 150,
        "playerSwitchType": 289263, // 7373 289263 1
        "blipColor": 1,
        "blipSprite": 442,
        "blipNameLabel": "HuntingBlipName_1",
        "ongoingGameRadarIsEnabled": true,
        "ongoingGameAnimalBlipsEnabled": true, //
        "radarZoomoutAni": false,
        "enablePopulating": true,
        "killLimit": 50,
        "overrideClockTime": [0, 0, 0],
        "clockPaused": true,
        "overrideWeather": "RAIN",
        "weatherPaused": true,
        "animals": DefaultAnimals,
        "artificialAnimalSpawnPoints": [
            [-1839.069, -756, 9], [-1851, -757, 8]
        ],
        "artificialAnimalSpawnChancePerSecond": [1, 20]
	}
];
var HuntingStoppedReasons = {
    0: `Server request`,
    1: `You died`,
    2: `Animal kill limit reached`,
    3: `Exited game while in a round`,
    4: `Game duration exceeded`
};
var DebugLogsEnabled = true;
var RoutingBucketEnabled = true;
var RoutingBucketWorldId = 5;
var Wait = (ms) => new Promise(res => setTimeout(res, ms));
var Games = new Map();
var LastHunts = new Map();
var MeleeWeaponBonusEnabled = true;
var MeleeWeaponBonusPayoutRange = [300, 600];
var StealthBonusEnabled = true;
var StealthBonusPayoutRange = [50, 150];
var RandomBonusEnabled = true;
var RandomBonusPayoutRange = [50, 100];
var RandomBonusChance = [1, 100];

Zones.forEach(z => {
    Games.set(z.id, {
        Players: [],
        AnimalKills: [],
        "_ZoneInfo": z
    });
});

function DebugLog (text) {
    if (!DebugLogsEnabled) return false;
    return console.info(text);
}

function GetHuntingZoneByID (ZoneID) {
    if (!ZoneID) {
        console.error("GetHuntingZoneByID: No Zone ID specified");
        return null;
    }
    var _Zone = Zones.find(z => z.id === ZoneID);
    if (!_Zone) return null;

    DebugLog(`GetHuntingZoneByID: Found zone: ${_Zone.id}`);

    return _Zone;	
}

function SetPlayersLastHuntInfo (id, info) {
    if (!id || !info) return null;
    LastHunts.set(id, info);
    return LastHunts;
}

function GetPlayersLastHuntInfo (id) {
    if (!id) return null;
    return LastHunts.get(id);
}

function ClearPlayersLastHuntInfo (id) {
    if (!id) return null;
    LastHunts.delete(id);
    return true;
}

var KillIDs = 0;
function RegisterAnimalKill (ZoneID, Animal, Player) {
    //console.log(ZoneID)
    //console.log(Animal)
    //console.log(Player)
    if (!ZoneID || !Animal || !Player) {
        console.error(`RegisterAnimalKill: No ZoneID, Animal or Player specified`);
        return null;
    }
    var ZoneInfo = GetHuntingZoneByID(ZoneID);
    if (!ZoneInfo) {
        console.error(`RegisterAnimalKill: Incorrect ZoneID specified`);
        return false;
    }
    var Game = Games.get(ZoneInfo.id);
    if (!Game) {
        console.error(`RegisterAnimalKill: No game found for zone ${ZoneInfo.id}`);
        return false;
    }
    KillIDs += 1;
    Game.AnimalKills.push({
        KillID: KillIDs,
        Animal: Animal,
        Killer: Player, 
        KillTimestamp: Date.now(),
        _ZoneInfo: ZoneInfo
    });
    Games.delete(ZoneInfo.id);
    Games.set(ZoneInfo.id, Game);

    DebugLog(`RegisterAnimalKill: Registered kill ${KillIDs}`);

    //console.log(Games)

    return Games;
}

function GetPlayersAnimalKills (PlayerSourceID, ZoneID) {
    if (!PlayerSourceID || !ZoneID) {
        console.error(`GetPlayersAnimalKills: No PlayerSourceID or ZoneID specified.`);
        return null;
    } else if (!Games.has(ZoneID)) {
        console.error(`GetPlayersAnimalKills: Invalid ZoneID specified`);
        return false;
    }    
    var Game = Games.get(ZoneID);
   // console.log(Game.AnimalKills.length)
    return Game.AnimalKills.filter(k => k.Killer.SourceId === PlayerSourceID);
}

function ClearPlayersAnimalKills (PlayerSourceID, ZoneID) {
    if (!PlayerSourceID || !ZoneID) {
        console.error(`ClearPlayersAnimalKills: No PlayerSourceID or ZoneID specified.`);
        return null;
    } else if (!Games.has(ZoneID)) {
        console.error(`ClearPlayersAnimalKills: Invalid ZoneID specified`);
        return false;
    }
    var Game = Games.get(ZoneID);
    Game.AnimalKills = Game.AnimalKills.filter(k => k.Killer.SourceId !== PlayerSourceID);
    Games.delete(ZoneID);
    Games.set(ZoneID, Game);
    DebugLog(`ClearPlayersAnimalKills: Cleared animal kills of player ${PlayerSourceID}`);

    return Games;
}

function AddPlayerInOngoingHunt (id, zoneid) {
    if (!id || !zoneid) {
        console.error("AddPlayerInOngoingHunt: No player id or zone id specified");
        return null;
    }
    var Game = Games.get(zoneid);
    if (!Game) {
        console.error("AddPlayerInOngoingHunt: No such zone with id " + zoneid);
        return false;
    }

    Game.Players.push({
        id: id,
        name: GetPlayerName(id),
        payOut: 0,
        startCoords: GetEntityCoords(GetPlayerPed(id))
    });
    Games.delete(zoneid);
    Games.set(zoneid, Game);

    if (RoutingBucketEnabled) SetPlayerRoutingBucket(id, RoutingBucketWorldId);

    DebugLog(`AddPlayerInOngoingHunt: Added ${GetPlayerName(id)} to ongoing hunting in zone ${zoneid}`);

    return Games;
}

function RemovePlayerFromOngoingHunt (id, zoneid) {
    if (!id || !zoneid) {
        console.error("RemovePlayerFromOngoingHunt: No player id or zone id specified");
        return null;
    }
    var Game = Games.get(zoneid);
    if (!Game) {
        console.error("RemovePlayerFromOngoingHunt: No such zone with id " + zoneid);
        return false;
    }
    Game.Players = Game.Players.filter(p => p.id !== id);
    Games.delete(zoneid);
    Games.set(zoneid, Game);

    if (RoutingBucketEnabled) SetPlayerRoutingBucket(id, 0);

    DebugLog(`RemovePlayerFromOngoingHunt: Removed ${GetPlayerName(id)} from ongoing hunting in zone ${zoneid}`);

    return Games;
}

function GetZonePlayerIsHuntingIn (id) {
    if (!id) {
        console.error("GetZonePlayerIsHuntingIn: No player id specified");
        return null;
    }
    var Zone = null;
    var Time = 0;

    Games.forEach(async g => {
        //console.log(g.Players)
        if (g.Players.length > 0 && g.Players.find(p => p.id === id)) {
            Zone = g._ZoneInfo;
            return;
        }
        Time += 1;
        await Wait(Time);
    });

    DebugLog(`GetZonePlayerIsHuntingIn: Player ${GetPlayerName(id)} is hunting in zone ${Zone ? Zone.id : "UNKNOWN"}`);

    return Zone;
}

function GetPlayerPayout (id, zoneid) {
    var Game = Games.get(zoneid);
    if (!Game) return false;
    var found = Game.Players.find(p => p.id === id);
    if (!found) return null;

    DebugLog(`${GetPlayerName(id)} has a payout of ${found.payOut}`);

    return found.payOut;
}

function SetPlayerPayout (payout, id, zoneid) {
    if (!payout || !id || !zoneid) return null;
    var Game = Games.get(zoneid);
    if (!Game) return false;
    var found = Game.Players.find(p => p.id === id);
    if (!found) return null;
    found.payOut = payout;
    Games.delete(zoneid);
    Games.set(zoneid, Game);

    DebugLog(`Set payout of ${GetPlayerName(id)} to ${payout}`);

    return found;
}

function RejectJoinRequest (id, Zone) {
    emitNet("Hunting:JoinRequestRejected", id);
}

function AcceptJoinRequest (id, Zone) {
    console.log(`Accepted join request of ${GetPlayerName(id)}`);
    emitNet("Hunting:JoinRequestAccepted", id);
    AddPlayerInOngoingHunt(id, Zone.Zone);
}

function SendZonesToClient (id) {
    if (!id) {
        console.error("SendZonesToClient: No player/client id specified");
        return null;
    }
    emitNet("Hunting:ZonesReceived", id, JSON.stringify(Zones.filter(z => z.enabled)))
}

function NumberRandomBetween (min, max) {
    //if (!min || !max || min > max) return false;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ArrayRandom (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

onNet("Hunting:ClientJoinRequest", async (Zone) => {
    var source = global.source;
    console.log(`${GetPlayerName(source)} requested to join...`);
    //RejectJoinRequest(source, JSON.parse(Zone));
    SendZonesToClient(source);
    await Wait(1000);
    AcceptJoinRequest(source, JSON.parse(Zone));
});

onNet("Hunting:ClientHuntingZonesRequest", () => {
    SendZonesToClient(global.source);
});

onNet("Hunting:ZoneKillsToServer", () => {
    var source = global.source;
    var Zone = GetZonePlayerIsHuntingIn(source);
    if (Zone) {
        var Kills = GetPlayersAnimalKills(source, Zone.id);
        emitNet("Hunting:ReceivedServerKills", source, JSON.stringify(Kills));
    } 
});

onNet("Hunting:AnimalKilled", KillInfo => {
    var Info = JSON.parse(KillInfo);
    var source = global.source;
    var Zone = GetZonePlayerIsHuntingIn(source);
    var Game = Games.get(Zone.id);
    Game.Players.forEach(async p => {
        //console.log(Info.animal.PedAnimalInfo.name)
        if (p.id !== source) emitNet("Hunting:KillNotification", p.id, GetPlayerName(source), Info.animal.PedAnimalInfo.name, GetPlayerPed(source));
        await Wait(100);
    });

    var Zone = GetZonePlayerIsHuntingIn(source);
    if (Zone) {
        var payout = GetPlayerPayout(source, Zone.id);
        var PriceRange = Info.animal.PedAnimalInfo.priceRange;
        payout += NumberRandomBetween(PriceRange[0], PriceRange[1]);
        if (Info.weaponUsedIsMelee && MeleeWeaponBonusEnabled) {
            var bonus = NumberRandomBetween(MeleeWeaponBonusPayoutRange[0], MeleeWeaponBonusPayoutRange[1]);
            payout += bonus;
            emitNet("Hunting:MeleeKillNotification", source, String(bonus));
        } else if (!!Info.wasKilledByStealth && StealthBonusEnabled) {
            var bonus = NumberRandomBetween(StealthBonusPayoutRange[0], StealthBonusPayoutRange[1]);
            payout += bonus;
            emitNet("Hunting:StealthKillNotification", source, String(bonus));
        } else if (RandomBonusEnabled && NumberRandomBetween(RandomBonusChance[0], RandomBonusChance[1]) === 1) {
            var bonus = NumberRandomBetween(RandomBonusPayoutRange[0], RandomBonusPayoutRange[1]);
            payout += bonus;
            emitNet("Hunting:RandomBonusNotification", source, String(bonus));           
        }

        SetPlayerPayout(payout, source, Zone.id);

        RegisterAnimalKill(Zone.id, Info.animal, {
            Ped: Info.by,
            PlayerId: Info.killerServerID,
            SourceId: source,
            Payout: payout,
            Name: GetPlayerName(source)
        });

        var PlayerKills = GetPlayersAnimalKills(source, Zone.id);
        
        if (Zone.killLimit && PlayerKills.length >= Zone.killLimit) {
            emitNet("Hunting:StopOngoingHunting", source, 2);
        } else emitNet("Hunting:ReceivedServerKills", source, JSON.stringify(GetPlayersAnimalKills(source, Zone.id)));
    }
});

onNet("Hunting:GameEnded", Info => {
    var source = global.source;
    Info = JSON.parse(Info);
    var Body;
    var color = null;
    var Kills = GetPlayersAnimalKills(source, Info.ZoneID);
    var Components = [];
    var Header = 'HuntingEndedHeader';
 
    if (Info.reasonID == 1) { 
        DebugLog("Case 1, died wile hunting, no payout should be given");
        color = 6;
        Body = 'HuntingEndedBodyPlayerDied';
        Header = "HuntingEndedHeader_FAIL";
        SetPlayerPayout(0, source, Info.ZoneID); // SetPlayerPayout(payout, id, zoneid)
    } else if (Info.reasonID == 2) { 
        DebugLog("Case 2, reached kill limit");
        color = null;
        Body = 'HuntingEndedBodyWithKills';
        Components = [String(Kills.length), Info.ZoneInfo.name, (Payout ? Payout.toLocaleString() : "0")];    
    } else if (Kills && Kills.length < 1) { 
        DebugLog("Case 3, killed no animals");
        Body = 'HuntingEndedBodyNoKills';
        Components = [Info.ZoneInfo.name];
    } else if (Kills && Kills.length > 0) {
        DebugLog("Case 4, killed at least one animal, round ended before reaching kill limit or dying");
        Body = 'HuntingEndedBodyWithKills';
        Components = [String(Kills.length), Info.ZoneInfo.name, (Payout ? Payout.toLocaleString() : "0")];   
    } 

    emitNet('Hunting:MidsizedNotification', source, Header, Body, 15000, color, true, null, Components);
    emitNet("Hunting:GameEndedNotification", source, (HuntingStoppedReasons[Info.reasonID] || "UNKNOWN"));

    var Payout = GetPlayerPayout(source, Info.ZoneID);
    if (Payout > 0) emit('Hunting:Payout', {
        PlayerSrc: source,
        Payout: Payout,
        Kills: Kills
    });

    SetPlayersLastHuntInfo(source, {
        Kills: GetPlayersAnimalKills(source, Info.ZoneID),
        Payout: Payout,
        Zone: Info.ZoneInfo,
        EndingReason: Info.reasonID,
        Player: {
            Source: source,
            Name: GetPlayerName(source)
        }
    });

    RemovePlayerFromOngoingHunt(source, Info.ZoneInfo.id);
    ClearPlayersAnimalKills(source, Info.ZoneInfo.id);
})

on("playerDropped", (reason) => {
    var source = global.source;
    var HuntedIn = GetZonePlayerIsHuntingIn(source);
    if (HuntedIn) {
        SetPlayersLastHuntInfo(source, {
            Kills: GetPlayersAnimalKills(source, HuntedIn.id),
            Payout: GetPlayerPayout(source),
            Zone: HuntedIn,
            EndingReason: 3,
            Player: {
                Source: source,
                Name: GetPlayerName(source)
            }
        });
        SetPlayerPayout(0, source, HuntedIn.id);
        ClearPlayersAnimalKills(source, HuntedIn.id);
        RemovePlayerFromOngoingHunt(source, HuntedIn.id);
    }

    DebugLog(`${GetPlayerName(source)} dropped. They were hunting in zone ${HuntedIn.id}. Removing...`);
});

/*RegisterCommand("getinfo", (source, args) => {
    //var pzone = GetZonePlayerIsHuntingIn(source);
    console.log(Games)
});

RegisterCommand('hunteval', (source, args) => {
    const evaled = eval(args.join(" "));
    console.log(evaled)
});*/

function Command (source, args) {
    if (args.length < 1) args.push('info');

    switch (args[0].toLowerCase()) {
        case 'zones':
            var Fields = [
                {
                    Left_Text: "~HUD_COLOUR_GREYLIGHT~<i>Name</i>",
                    Right_Text: "~HUD_COLOUR_GREYLIGHT~<i>Players</i>"
                }
            ];

            Games.forEach(async g => {
                Fields.push({
                    Left_Text: `<font size='10'>${g._ZoneInfo.name}</font>`,
                    Right_Text: String(g.Players.length),
                    Right_Text_Background_Banner: 167
                });

                await Wait(1);
            });

            //console.log(Fields)

            emitNet("Hunting:Scoreboard", source, `Hunting zones (${Zones.length})`, Fields, null, "OK", false);  
        break;
        case 'players':
            var HuntingIn = GetZonePlayerIsHuntingIn(source);
            if (!HuntingIn) return emitNet('Hunting:CommandError', source, "You aren't hunting in any zone.");
            var Game = Games.get(HuntingIn.id);
            var Fields = [
                {
                    Left_Text: "~HUD_COLOUR_GREYLIGHT~<i>Name</i>",
                    Right_Text: "~HUD_COLOUR_GREYLIGHT~<i>Kills</i>"
                }
            ];

            Game.Players.forEach(async p => {
                Fields.push({
                    Left_Text: `<font face='$Font2_cond' size='23'>${p.name}</font>`,
                    Right_Text: String(GetPlayersAnimalKills(p.id, Game._ZoneInfo.id).length),
                    Right_Text_Background_Banner: 167
                });

                await Wait(1);
            });

            emitNet("Hunting:Scoreboard", source, `<font size='10'>${Game._ZoneInfo.name} players (${Game.Players.length})</font>`, Fields, null, "OK", false);  
        break;
        case 'stop':
            var huntingIn = GetZonePlayerIsHuntingIn(source);
            if (!huntingIn) return emitNet('Hunting:CommandError', source, "You aren't hunting in any zone.");
            emitNet("Hunting:StopOngoingHunting", source);
        break;
        case 'toggle':
            if (GetZonePlayerIsHuntingIn(source)) {
                return emitNet('Hunting:CommandError', source, "You have to leave your current hunting minigame in order to toggle it.");
            }
            emitNet('Hunting:ToggleMinigame', source);
        break;
        case 'info':
            emitNet("Hunting:PopupMessage", source, `Hunting`, "HuntingInfoPopupBody", null, null, null, false, true);
        break;
        case 'last':
            var LastHunt = GetPlayersLastHuntInfo(source);
            if (!LastHunt) return emitNet('Hunting:CommandError', source, "No information yet.");
            var Fields = [
                {
                    Left_Text: "Zone",
                    Right_Text: LastHunt.Zone.name
                },
                {
                    Left_Text: "Kills",
                    Right_Text: "~r~" + String(LastHunt.Kills.length)
                },
                {
                    Left_Text: "Payout",
                    Right_Text: "~g~$" + String(LastHunt.Payout)
                }
            ];
            emitNet("Hunting:Scoreboard", source, "~g~Last hunt information", Fields, null, "OK", false);
        break;
    }
}

RegisterCommand('hunting', (source, args) => Command(source, args));
RegisterCommand('hunt', (source, args) => Command(source, args));

setInterval(async () => { // spawn artifical animals
    Games.forEach(async Game => {
        if (Game.Players.length > 0 && Game._ZoneInfo.artificialAnimalSpawnPoints && Game._ZoneInfo.artificialAnimalSpawnChancePerSecond) {
            var ZoneInfo = Game._ZoneInfo;
            var chance = ZoneInfo.artificialAnimalSpawnChancePerSecond;
            var Number = NumberRandomBetween(chance[0], chance[1]);
            if (Number === chance[0]) {
                var Coords = ArrayRandom(ZoneInfo.artificialAnimalSpawnPoints);
                var ped = CreatePed(29, ArrayRandom(ZoneInfo.animals).modelHash, Coords[0], Coords[1], Coords[2], 0, true);
                await Wait(1000);
                if (RoutingBucketEnabled) SetEntityRoutingBucket(ped, RoutingBucketWorldId);
            }
        }
    });
}, 1000);