var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : TickRate));
var ClubsEnabled = true;
var DefaultTickRate = 3.5;
var TickRate = DefaultTickRate;
var PedId = PlayerPedId();
var PedIdUpdateTickFrequency = 100; // every 100 ticks
var PedIdUpdateTickCount = 0;
var PlayerPedCoords = GetEntityCoords(PedId);
var PlayerPedCoordsUpdateTickCount = 0;
var PlayerPedCoordsUpdateTickFrequency = 90;
var CurrentInteriorCheckTickCount = 0;
var CurrentInteriorCheckTickFrequency = 500;
var EnterControlType = 0;
var EnterControlIndex = 51;
var EnterControlButton = "~INPUT_CONTEXT~";
var InsideClub = null;
var EnteringClub = null;
var ExitingClub = null;
var LastClub = null;
var LastClub2 = null;
var LastClub3 = null;
var ScreenIsBlurred = false;
var LastCheckpoint = null;
var LastGarageCheckpoint = null;
var ExitCheckpoint = null;
var GarageExitCheckpoint = null;
var MinimapPositionLocked = false;
var ClubsLastReceived = 0;
var ClubInteriorId = 271617;
var LastEnteredAt = 0;
var LastExitedAt = 0;
var IplLoadedOnStartup = [];
var IplUnloadedOnStartup = [];
var ActiveInteriorEntitySets = [];
var ConcealedPlayers = [];
var Cooldowns = new Map();
var InteriorGarageExitCoords = [-1642.57070078125, -2989.76953125, -76.9454879607422];
var InteriorExitCoords = [-1569.38525390, -3016.544921875, -74.40615844];
var NightClubs = [];

AddTextEntry("NightclubsNearbyClubHelpText", `Press ${EnterControlButton} to enter this nightclub`);
AddTextEntry("NightclubsNearbyClubExitHelpText", `Press ${EnterControlButton} to exit this nightclub`);

function SetTickRate(tickRate) {
    TickRate = (tickRate ? tickRate : DefaultTickRate);
    DebugLog(`Current tick rate: ${TickRate}`);
    return TickRate;
}

function HaveClubsBeenReceived() {
    return (NightClubs.length > 0 ? true : false);
}

function RequestNightClubsFromServer() {
    if (!BusyspinnerIsDisplaying()) {
        BeginTextCommandBusyspinnerOn();
        EndTextCommandBusyspinnerOn(4);
    }

    DebugLog(`Requesting nightclubs`);
    emitNet('Nightclubs:ClubsRequest');
    onNet('Nightclubs:ClubsReceived', clubs => {
        if (GetGameTimer() - ClubsLastReceived >= 100) { // due to console spam
            ClubsLastReceived = GetGameTimer();
            NightClubs = JSON.parse(clubs);
            DebugLog(`Received ${NightClubs.length} nightclubs.^0\n${NightClubs.map(nc => `${nc.id} ${nc.name}`).join("\n")}`);
        }
    });
}

//RequestNightClubsFromServer(); 

(async function() {
    while (!HaveClubsBeenReceived()) {
        console.log(`Requesting clubs...`);
        RequestNightClubsFromServer();
        await Wait(1500);
    }

    console.log(`Received ${NightClubs.length} clubs`);
    BusyspinnerOff();

    if (ClubsEnabled) SetClubBlips(NightClubs);

    function SetCooldown(code, time) {
        if (!code || !time) return false;

        Cooldowns.set(code, true);
        setTimeout(() => {
            Cooldowns.delete(code);
        }, time);

        return true;
    }

    function IsCooldownActive(code) {
        return (Cooldowns.has(code) ? true : false);
    }

    function LoadClubIplsOnStartup () {
        NightClubs.filter(nc => nc.IplLoadOnStartup).forEach(async nc => {
            DebugLog(`LoadClubIplsOnStartup: Loading IPLs for ${nc.name}`);
            if (nc.IplLoadOnStartup.length && nc.IplLoadOnStartup.length > 0) {
                nc.IplLoadOnStartup.forEach(async ipl => {
                    if (!IsIplActive(ipl)) {
                        DebugLog(`LoadClubIplsOnStartup: Requesting Ipl ${ipl} of ${nc.name}`);
                        RequestIpl(ipl);
                        IplLoadedOnStartup.push(ipl);
                        await Wait(100);
                    }
                });
            }
            await Wait(1000);
        });
    }

    function UnloadClubIpls() {
        DebugLog(IplLoadedOnStartup);
        IplLoadedOnStartup.forEach(async ipl => {
            DebugLog(`UnloadClubIpls: Removing Ipl ${ipl}`);
            RemoveIpl(ipl);
            await Wait(100);
        });
        IplLoadedOnStartup.length = 0;
    }

    function UnloadClubIplsOnStartup () {
        NightClubs.filter(nc => nc.IplUnloadOnStartup).forEach(async nc => {
            DebugLog(`UnloadClubIplsOnStartup: Unloading IPLs for ${nc.name}`);
            if (nc.IplUnloadOnStartup.length && nc.IplUnloadOnStartup.length > 0) {
                nc.IplUnloadOnStartup.forEach(async ipl => {
                    if (IsIplActive(ipl)) {
                        DebugLog(`UnloadClubIplsOnStartup: Removing Ipl ${ipl} of ${nc.name}`);
                        RemoveIpl(ipl);
                        IplUnloadedOnStartup.push(ipl);
                        await Wait(100);
                    }
                });
            }
            await Wait(1000);
        });
    }

    function LoadUnloadedOnStartupIpls() {
        IplUnloadedOnStartup.forEach(async ipl => {
            DebugLog(`LoadUnloadedInStartupIpls: Loading ipl ${ipl}`);
            RequestIpl(ipl);
            await Wait(100);
        });
        IplUnloadedOnStartup.length = 0;
    }

    UnloadClubIplsOnStartup();
    LoadClubIplsOnStartup();

    function GetNightclubById(id) {
        if (!id) return false;

        return NightClubs.find(n => n.id === id);
    } 

    function Get3dDistance (x1, y1, z1, x2, y2, z2) {
        /*console.log (`${x1} ${y1} ${z1}`)
        console.log (`${x2} ${y2} ${z2}`)*/
		var resX = x1 - x2;
		var resY = y1 - y2;
		var resZ = z1 - z2;

		return Math.sqrt((resX * resX) + (resY * resY) + (resZ * resZ));   
    }

	function IsEntityNearNightclub (EntityID, ClubID, EntityCoords) {
		var PedCoords2 = (EntityCoords ? EntityCoords : GetEntityCoords(EntityID));
		var Club = GetNightclubById(ClubID);
		if (!Club) return null;

		var distance = Get3dDistance(PedCoords2[0], PedCoords2[1], PedCoords2[2], Club.coords[0], Club.coords[1], Club.coords[2]);

		if (distance < Club.nearbyZone) return true;
		return false;
	}

    function HidePlayer (PlayerID) {
        if (PlayerID !== -1) {
            DebugLog(`HidePlayer: Hiding player ${PlayerID}`);
            ConcealedPlayers.push(PlayerID);
            return NetworkConcealPlayer(PlayerID, true);
        } else DebugLog(`HidePlayer: Specified player local ID is -1. This is our id.`);
    }

    function RemoveHiddenPlayer(PlayerID) {
        DebugLog(`RemoveHidenPlayer: Removing hidden player ${PlayerID}`);
        ConcealedPlayers = ConcealedPlayers.filter(cp => cp !== PlayerID);
        return NetworkConcealPlayer(PlayerID, false);
    }

    function RemoveAllHiddenPlayers() {
        DebugLog(`RemoveAllHiddenPlayers: Removing all hidden players`);
        ConcealedPlayers.forEach(async cp => {
            NetworkConcealPlayer(cp, false);
            DebugLog('Removing hidden player ' + cp)
            await Wait(5);
        });
        ConcealedPlayers.length = 0;
    }

    function JustEnteredNightclubNearbyScope(club) {
        DebugLog(`we just entered scope of ${club.id}`);

        var color = [113, 200, 255, 255];
        if (club.markerColor && (club.markerColor.length && club.markerColor.length == 4)) color = club.markerColor;
        LastCheckpoint = CreateCheckpoint(49, club.coords[0], club.coords[1], club.coords[2] - 1, null, null, null, club.enterZone+1, color[0], color[1], color[2], color[3]);
        SetCheckpointCylinderHeight(LastCheckpoint, 1.65);

        if (club.garageEntryCoords) {
            LastGarageCheckpoint = CreateCheckpoint(49, club.garageEntryCoords[0], club.garageEntryCoords[1], club.garageEntryCoords[2] - 1, null, null, null, club.garageEnterZone+1.5, color[0], color[1], color[2], color[3]);
            SetCheckpointCylinderHeight(LastGarageCheckpoint, 2.3);
        }

        if (club.nearbyObjectsToHide && (club.nearbyObjectsToHide.length && club.nearbyObjectsToHide.length > 0)) {
            var Objpool = GetGamePool("CObject");
            Objpool.forEach(async OBJ => {
                if (club.nearbyObjectsToHide.find(obj2 => obj2 === GetEntityModel(OBJ))) {
                    SetEntityCoords(OBJ, 0, 0, 0);
                    DebugLog(`club.nearbyObjectsToHide: Moved object entity ${OBJ} to 0, 0, 0`);
                }
                await Wait(5000);
            });
        }
    }

    function JustExitedNightclubNearbyScope(club) {
        DebugLog(`we just exited scope of ${club.id}`)
        if (LastCheckpoint) {
            DeleteCheckpoint(LastCheckpoint);
            LastCheckpoint = null;
        }
        if (LastGarageCheckpoint) {
            DeleteCheckpoint(LastGarageCheckpoint);
            LastGarageCheckpoint = null;
        }

        LastClub = null;
    }

    function JustEnteredNightclubEnterScope(club) {
        DebugLog(`we just entered enter scope of ${club.id}`)
    }

    function JustEnteredNightclubEnterScope_2(club) {
        DebugLog(`we just entered garage enter scope of ${club.id}`)
    }

    function JustExitedNightclubEnterScope(club) {
        DebugLog(`we just exited enter scope of ${club.id}`);
        LastClub2 = null;
    }

    function JustExitedNightclubEnterScope_2(club) {
        DebugLog(`we just exited garage enter scope of ${club.id}`);
        LastClub3 = null;
    }

    var HasPrepared = false;
    async function PrepareNightclubInterior(club) {
        if (club.djLightsStyle) {
            var name = null;
            switch (club.djLightsStyle) {
                case 1: 
                    name = 'DJ_01_Lights_01'
                break;
                case 2:
                    name = 'DJ_01_Lights_02'
                break;
                case 3: 
                    name = 'DJ_01_Lights_03'
                break;
                case 4:
                    name = 'DJ_01_Lights_04'
                break;      
                case 5: 
                    name = 'DJ_02_Lights_01'
                break;
                case 6:
                    name = 'DJ_02_Lights_02'
                break;
                case 7: 
                    name = 'DJ_02_Lights_03'
                break;
                case 8:
                    name = 'DJ_02_Lights_04'
                break;      
                case 9: 
                    name = 'DJ_03_Lights_01'
                break;
                case 10:
                    name = 'DJ_03_Lights_02'
                break;
                case 11: 
                    name = 'DJ_03_Lights_03'
                break;
                case 12:
                    name = 'DJ_03_Lights_04'
                break;   
                case 13: 
                    name = 'DJ_04_Lights_01'
                break;
                case 14:
                    name = 'DJ_04_Lights_02'
                break;
                case 15: 
                    name = 'DJ_04_Lights_03'
                break;
                case 16:
                    name = 'DJ_04_Lights_04'
                break;          
            }
            ActivateInteriorEntitySet(ClubInteriorId, name);
            ActiveInteriorEntitySets.push(name);
            DebugLog(`Activated entity set ${name} (club.djLightsStyle)`);
        }

        if (club.interiorStyle) {
            var Props = [];
            switch (club.interiorStyle) {
                case 1:
                    Props = ['Int01_ba_Style01', 'Int01_ba_Style01_podium'];
                break;
                case 2:
                    Props = ['Int01_ba_Style02', 'Int01_ba_Style02_podium'];
                break;
                case 3:
                    Props = ['Int01_ba_Style03', 'Int01_ba_Style03_podium'];
                break;
                case 4:
                    Props = ['Int01_ba_Style01', 'light_rigs_off', 'Int01_ba_Worklamps', 'Int01_ba_Clutter'];
                break;
            }

            Props.forEach(async prop => {
                ActivateInteriorEntitySet(ClubInteriorId, prop);
                ActiveInteriorEntitySets.push(prop);
                DebugLog(`Activated entity set ${prop} (club.interiorStyle). Interior style: ${club.interiorStyle}`);
                await Wait(5);
            });
        }
        if (club.djStyle) {
            var name = null;
            switch (club.djStyle) {
                case 1:
                    name = 'Int01_ba_dj01'
                break;
                case 2:
                    name = 'Int01_ba_dj02'
                break;
                case 3:
                    name = 'Int01_ba_dj03'
                break;
                case 4:
                    name = 'Int01_ba_dj04'
                break;
            }
            ActivateInteriorEntitySet(ClubInteriorId, name);
            ActiveInteriorEntitySets.push(name);
            DebugLog(`Activated entity set ${name} (club.djStyle)`);
        }
        if (club.miscProps) {
            club.miscProps.forEach(async p => {
                ActivateInteriorEntitySet(ClubInteriorId, p);
                ActiveInteriorEntitySets.push(p);
                DebugLog(`Activated entity set ${p} (club.miscProps)`);
                await Wait(50);
            });
        }

        await Wait(500);

        RefreshInterior(ClubInteriorId);
        DebugLog(`Refreshed interior ${ClubInteriorId}. ${ActiveInteriorEntitySets.length} active Interior sets:\n${ActiveInteriorEntitySets.join("\n")}`);

        HasPrepared = true;
        DebugLog(`Interior has finished preparing!`);
        setTimeout(() => {
            HasPrepared = false;
        }, 2);
    }

    function HasInteriorPrepared() {
        return HasPrepared;
    }

    function RestartInterior() {
        ActiveInteriorEntitySets.forEach(async set => {
            DebugLog(`RestartInterior: Deactivating interior (${ClubInteriorId}) entity set ${set}`)
            DeactivateInteriorEntitySet(ClubInteriorId, set);
            await Wait(10);
        });

        ActiveInteriorEntitySets.length = 0;
        RefreshInterior(ClubInteriorId);
        DebugLog(`RestartInterior: Refreshed interior ${ClubInteriorId}`);
    }

    async function NetworkOnResponse (response, extra, extra2, extra3) {
        if (!response || InsideClub || !EnteringClub) return null;

        switch (response.toLowerCase()) {
            case 'timeout':
                DebugLog(`NetworkOnResponse: timeout`);
                StopLoadingScreen();
                EnteringClub = null;
                BusyspinnerOff();
            break;
            case 'rejected':
                DebugLog(`NetworkOnResponse: rejected`);
                StopLoadingScreen();
                EnteringClub = null;
                BusyspinnerOff();            
            break;
            case 'accepted':
                DebugLog(`NetworkOnResponse: accepted`);
                DebugLog(`Loading: Stage 2, loading interior, hiding players, setting player in interior`);

                BeginTextCommandBusyspinnerOn('MP_SPINLOADING');
                EndTextCommandBusyspinnerOn(5);

                EnteringClub = null;
                InsideClub = extra;

                RemoveClubBlips();
                SetInclubBlip(InsideClub);
                SetExitBlip();
                if (extra.garageEntryCoords) SetGarageBlip();

                var Coords = null;
                var EntryMethod2 = null;
                switch (extra3) {
                    case 1:
                        DebugLog(`switch (extra3): case 1: Coords = InteriorCoords`);
                        Coords = InteriorExitCoords;
                        EntryMethod2 = "door";
                    break;
                    case 2:
                        DebugLog(`switch (extra3): case 2: Coords = GarageInteriorCoords`);
                        Coords = InteriorGarageExitCoords;
                        EntryMethod2 = "garage";
                    break;
                    default:
                        DebugLog(`switch (extra3): default: Coords = InteriorCoords`);
                        Coords = InteriorExitCoords;
                        EntryMethod2 = "door";
                    break;
                }

                FreezeEntityPosition(PedId, true);
                SetEntityHeading(PedId, EntryMethod2 === 'door' ? 0 : 270);
                SetGameplayCamRelativeHeading(0);
                var Y = Coords[1];
                if (EntryMethod2 === 'door') Y += 3;
                SetEntityCoords(PedId, Coords[0], Y, Coords[2]);
                PlayerPedCoords = Coords;
                DebugLog(`Set player coords to ${PlayerPedCoords.join(', ')}`);

                function RequestCollision() {
                    DebugLog(`Requesting collision at interior coords ${InteriorExitCoords.join(', ')}`);
                    RequestCollisionAtCoord(Coords[0], Coords[1], Coords[2]);
                    RequestAdditionalCollisionAtCoord(Coords[0], Coords[1], Coords[2]);
                }

                while (!HasCollisionLoadedAroundEntity(PedId)) {
                    SetEntityCoords(PedId, Coords[0], Coords[1], Coords[2]);
                    RequestCollision();

                    await Wait(50);
                }

                DebugLog(`Preparing nightclub interior`);
                await PrepareNightclubInterior(extra);
                while (!HasInteriorPrepared()) {
                    DebugLog(`Waiting for interior to prepare`);
                    await Wait(50);
                }

                DeleteCheckpoint(LastCheckpoint);
                LastCheckpoint = null;
                if (LastGarageCheckpoint) {
                    DeleteCheckpoint(LastGarageCheckpoint);
                    LastGarageCheckpoint = null;
                }
                if (!ExitCheckpoint) {
                    ExitCheckpoint = CreateCheckpoint(49, InteriorExitCoords[0], InteriorExitCoords[1], InteriorExitCoords[2] - 1, null, null, null, 2, 255, 50, 50, 180);
                    SetCheckpointCylinderHeight(ExitCheckpoint, 1.65);
                }
                if (extra.garageEntryCoords) {
                    if (GarageExitCheckpoint) DeleteCheckpoint(GarageExitCheckpoint);
                    GarageExitCheckpoint = CreateCheckpoint(49, InteriorGarageExitCoords[0], InteriorGarageExitCoords[1], InteriorGarageExitCoords[2] - 1.5, null, null, null, 4.5, 255, 50, 50, 180);
                    SetCheckpointCylinderHeight(GarageExitCheckpoint, 4);
                }

                DoScreenFadeOut();

                StopLoadingScreen();
                BusyspinnerOff(); 
                FreezeEntityPosition(PedId, false);
                LastEnteredAt = Date.now();

                DebugLog(`Cloud loading screen stopped`);

                await Wait(3000);

                if (extra2) { // players to hide
                    DebugLog(`Hiding players (extra2)`);
                    DebugLog(`There are ${extra2.length} players to hide`);
                    extra2.forEach(async player => {
                        var Player = GetPlayerFromServerId(player.id);
                        if (Player !== PlayerId()) {
                            DebugLog(`Player's server ID = ${player.id}`)
                            DebugLog(`Player's local ID = ${Player}`);
                            DebugLog('(extra2.forEach) Hiding player ' + Player);

                            if (Player) HidePlayer(Player);
                        }

                        await Wait(30);
                    });
                }     

                DoScreenFadeIn(2000);

                BeginTextCommandThefeedPost('NightclubsWelcomeFeedPost');
                EndTextCommandThefeedPostMessagetext(`CHAR_SOCIAL_CLUB`, `CHAR_SOCIAL_CLUB`, true, 0, "Nightclubs", extra.name);
            break;
        }
    }

    function IsSafeToExit() {
        return (((Date.now() - LastEnteredAt) > 7000) ? true : false);
    }

    function IsSafeToEnter() {
        return (((Date.now() - LastExitedAt) > 5000) ? true : false);
    }

    async function NetworkRequestEntry(Club, EntryMethod) {
        if (!Club) {
            return false;
        } else if (!IsSafeToEnter()) {
            BeginTextCommandThefeedPost("NightclubsErrorUnavailable");
            return EndTextCommandThefeedPostTicker(true, true);
        }
        DebugLog(`NetworkRequestEntry: Requesting entry`);

        Club = GetNightclubById(Club);
        EnteringClub = Club;
        InsideClub = null;

        // BigfeedEnabled, BigfeedTitle, BigfeedSubtitle, BigfeedBody, BigfeedTxd, BigfeedTxn
        StartupLoadingScreen(true, "NIGHTCLUBS", Club.name, Club.description, 'foreclosures_club', 'lighting4');
        while (!IsLoadingScreenActive()) {
            await Wait(1);
        }

        await Wait(2000);

        DebugLog(`Loading: Stage 1, Requesting entry and players to hide`);

        BeginTextCommandBusyspinnerOn('FMMC_DOWNLOAD');
        EndTextCommandBusyspinnerOn(4);

		emitNet("Nightclubs:EnterRequest", JSON.stringify(EnteringClub), EntryMethod);
		onNet("Nightclubs:EnterRequestRejected", () => {
			NetworkOnResponse("rejected");
		});
		onNet("Nightclubs:EnterRequestAccepted", async (PlayersToHide, EntryMethod) => {
            if (!IsCooldownActive('Nightclubs:EnterRequestAccepted')) {
                SetCooldown('Nightclubs:EnterRequestAccepted', 50);

                DebugLog(`Enter request accepted. Players to hide:`);
                DebugLog(PlayersToHide);
                DebugLog(`Entry method:`);
                DebugLog(EntryMethod);
                await Wait(1000);
                NetworkOnResponse("accepted", EnteringClub, JSON.parse(PlayersToHide), EntryMethod);
            }
		});

        var StartedWaiting = GetGameTimer();
        var DisplayWarningMessage = true;
        while (!InsideClub && EnteringClub) {
            var CurrentTime = GetGameTimer();

            SetMouseCursorActiveThisFrame();

            if (((CurrentTime - StartedWaiting) >= 10000)) {
                if (DisplayWarningMessage) SetWarningMessageWithHeader("HUD_ALERT", "NightclubsServerTakingTooLongWarningMessageBody", 134217748, false, false, false, false);
                
                if (IsControlJustReleased(2, 201)) {
                    DoScreenFadeOut();

                    NetworkOnResponse('timeout');

                    setTimeout(() => {
                        NetworkRequestEntry(Club.id, EntryMethod);
                        DoScreenFadeIn(1000);
                    }, 3000);
                } else if (IsControlJustReleased(2, 202)) {
                    NetworkOnResponse('timeout');
                } else if (IsControlJustReleased(2, 203)) {
                    DisplayWarningMessage = (DisplayWarningMessage ? false : true);
                }
            }

            await Wait(3);
        }
    }

    async function ExitNightclub(Club, ExitType) {
        if (!Club) {
            return false;
        } else if (!IsSafeToExit()) {
            BeginTextCommandThefeedPost('NightclubsErrorUnavailable');
            return EndTextCommandThefeedPostTicker(true, true);
        }

        DebugLog(`ExitNightclub`);

        InsideClub = null;
        EnteringClub = null;
        LastClub = null;
        LastClub2 = null;
        CurrentInteriorCheckTickCount = 0;

        DeleteCheckpoint(ExitCheckpoint);
        ExitCheckpoint = null;
        if (GarageExitCheckpoint) {
            DeleteCheckpoint(GarageExitCheckpoint);
            GarageExitCheckpoint = null;
        }

        DoScreenFadeOut(500);

        while (IsScreenFadingOut()) {
            await Wait(1);
        }

        DebugLog(`ExitNightclub: Restarting interior, removing hidden players`);
        SetClubBlips(NightClubs);
        RemoveInclubBlip();
        RemoveExitBlip();
        RemoveGarageBlip();
        RestartInterior();
        RemoveAllHiddenPlayers();
        if (MinimapPositionLocked) {
            MinimapPositionLocked = false;
            UnlockMinimapAngle();
            UnlockMinimapPosition();
        }

        var ExitedVia = null;
        var ExitCoords = Club.coords;
        switch (ExitType) {
            case 1: 
                DebugLog(`ExitCoords: Case 1, normal exit`);
                ExitCoords = Club.coords;
                ExitedVia = 'door';
            break;
            case 2:
                DebugLog(`ExitCoords: Case 2, garage`);
                ExitCoords = Club.garageEntryCoords;
                ExitedVia = 'garage';
            break;
            default:
                DebugLog(`ExitCoords: Case 3, default`);
                ExitCoords = Club.coords;
                ExitedVia = 'door';
            break;
        }

        function RequestCollision() {
            DebugLog(`Requesting collision`);
            RequestCollisionAtCoord(ExitCoords[0], ExitCoords[1], ExitCoords[2]);
            RequestAdditionalCollisionAtCoord(ExitCoords[0], ExitCoords[1], ExitCoords[2]);
        }

        DebugLog(`Teleporting player to club exterior (${ExitCoords.join(', ')})`);
        FreezeEntityPosition(PedId, true);
        SetEntityCoords(PedId, ExitCoords[0], ExitCoords[1], ExitCoords[2]);
        DebugLog(`Club.pedHeading_Garage = ` + Club.pedHeading_Garage);
        DebugLog(`Club.pedHeading = ${Club.pedHeading}`);
        DebugLog(`ExitedVia = ${ExitedVia}`);
        SetEntityHeading(PedId, (ExitedVia === 'garage' ? Club.pedHeading_Garage : Club.pedHeading));
        SetGameplayCamRelativeHeading(0);

        while (!HasCollisionLoadedAroundEntity(PedId)) {
            SetEntityCoords(PedId, ExitCoords[0], ExitCoords[1], ExitCoords[2]);
            RequestCollision();

            await Wait(500);
        }

        ExitingClub = null;
        LastExitedAt = Date.now();

        FreezeEntityPosition(PedId, false);

        await Wait(1000);

        DoScreenFadeIn(2000);
    }

    async function NetworkRequestExit(Method) { 
        if (!InsideClub) {
            return false;
        } else if (!IsSafeToExit()) {
            BeginTextCommandThefeedPost('NightclubsErrorUnavailable');
            return EndTextCommandThefeedPostTicker(true, true);
        }

        if (!Method) Method = 1;
        DebugLog(`NetworkRequestExit: (1) Method = ${Method}`);

        ExitingClub = InsideClub;

        BeginTextCommandBusyspinnerOn();
        EndTextCommandBusyspinnerOn(4);

        DebugLog(`NetworkRequestExit: Requesting exit with method ${Method}`);

        emitNet("Nightclubs:ExitRequest", JSON.stringify(InsideClub), Method);
		onNet("Nightclubs:ExitRequestAccepted", async (Method2) => {
            if (!IsCooldownActive('Nightclubs:ExitRequestAccepted')) {
                SetCooldown('Nightclubs:ExitRequestAccepted', 50);
                BusyspinnerOff();
                DebugLog(`NetworkRequestExit: Exit request was accepted by server`);
                DebugLog(`NetworkRequestExit: (2) Method = ${Method}`);
                DebugLog(`NetworkRequestExit: (3) Method2 = ${Method2}`);
                ExitNightclub(InsideClub, Method2);
            }
		});
    }

    function ToggleNightclubs() {
        if (EnteringClub || InsideClub || ExitingClub) {
            DebugLog(`Minigame won't be toggled due to the player either entering, exiting or being inside a nightclub...`);
            return false;
        }

        if (ClubsEnabled) {
            ClubsEnabled = false;
            DebugLog(`ClubsEnabled = ${ClubsEnabled}`);
            RemoveClubBlips();
            BeginTextCommandThefeedPost('NightclubsToggled');
            AddTextComponentSubstringPlayerName('~r~disabled~w~');
            EndTextCommandThefeedPostTicker(false, true);
            LastClub = null;
            LastClub2 = null;
            LastClub3 = null;
            SetTickRate(1000);
            if (LastCheckpoint) {
                DeleteCheckpoint(LastCheckpoint);
                LastCheckpoint = null;
                DebugLog(`ToggleNightclubs: Removed entrance marker checkpoint. Current checkpoint: ${LastCheckpoint} (Should be null)`);
            }
            if (LastGarageCheckpoint) {
                DeleteCheckpoint(LastGarageCheckpoint);
                LastGarageCheckpoint = null;
                DebugLog(`ToggleNightclubs: Removed garage entrance marker checkpoint. Current checkpoint: ${LastGarageCheckpoint} (Should be null)`);
            }
        } else {
            SetTickRate(null);
            ClubsEnabled = true;
            DebugLog(`ClubsEnabled = ${ClubsEnabled}`);
            SetClubBlips(NightClubs);
            BeginTextCommandThefeedPost('NightclubsToggled');
            AddTextComponentSubstringPlayerName('~g~enabled~w~');
            EndTextCommandThefeedPostTicker(false, true);
        }
    }

    on('onResourceStop', (resource) => {
        if (GetCurrentResourceName() === resource) {
            if (ActiveInteriorEntitySets.length > 0) RestartInterior();
            RemoveAllHiddenPlayers();
            UnloadClubIpls();
            LoadUnloadedOnStartupIpls();
            if (IsLoadingScreenActive()) StopLoadingScreen();
        }
    });

    onNet("Nightclubs:Toggle", () => ToggleNightclubs());

    onNet("Nightclubs:ExitNightClub", (club) => {
        if (!IsCooldownActive("Nightclubs:ExitNightClub")) {
            SetCooldown("Nightclubs:ExitNightClub", 50);
            ExitNightclub(JSON.parse(club));
        }
    });

    onNet('Nightclubs:HidePlayer', async (playerServerId) => {
        //await Wait(1500);
        var ticks = 0;
        while (GetPlayerFromServerId(playerServerId) === -1) {
            ticks += 1;
            DebugLog(`Waiting.. ${ticks}`);
            if (ticks >= 5) {
                DebugLog(`^1Nightclubs:HidePlayer: Player didn't load in time...`);
                break;
            }
            await Wait(100);
        }
        var LocalId = GetPlayerFromServerId(playerServerId);
        var MyId = PlayerId();

        DebugLog(`Nightclubs:HidePlayer: Player id has loaded locally! Id: ${LocalId} our Id: ${MyId}`);

        if (LocalId !== PlayerId()) {
            HidePlayer(PlayerLocalId);
            DebugLog("Nightclubs:HidePlayer: Hid player");
            DebugLog(`Player's server ID: ${playerServerId}`);
            DebugLog(`Player's local ID: ${LocalId}`);
            DebugLog(`Our ID: ${MyId}`);
        } else {
            DebugLog(`^1Nightclubs:HidePlayer: Player's local id is the same as our id. Player won't be hidden...`);
            DebugLog(`Player's server ID: ${playerServerId}`);
            DebugLog(`Player's local ID: ${LocalId}`);
            DebugLog(`Our ID: ${MyId}`);
        }
    });

    onNet("Nightclubs:Tp", async Club => {
        if (!Club) return;

        Club = JSON.parse(Club);

        DoScreenFadeOut();

        function RequestCollision() {
            DebugLog(`Requesting collision`);
            RequestCollisionAtCoord(Club.coords[0], Club.coords[1], Club.coords[2]);
            RequestAdditionalCollisionAtCoord(Club.coords[0], Club.coords[1], Club.coords[2]);
        }

        DebugLog(`Teleporting player to club exterior (${Club.coords.join(', ')})`);
        FreezeEntityPosition(PedId, true);
        SetEntityCoords(PedId, Club.coords[0], Club.coords[1], Club.coords[2]);
        SetEntityHeading(PedId, Club.pedHeading);
        SetGameplayCamRelativeHeading(0);

        while (!HasCollisionLoadedAroundEntity(PedId)) {
            SetEntityCoords(PedId, Club.coords[0], Club.coords[1], Club.coords[2]);
            RequestCollision();

            await Wait(500);
        }

        FreezeEntityPosition(PedId, false);
        DoScreenFadeIn(1500);
    });

    onNet("Nightclubs:TpToClubInside", async clubInfo => {
        clubInfo = JSON.parse(clubInfo);
        if (EnteringClub || ExitingClub || InsideClub) {
            BeginTextCommandThefeedPost("NightclubsErrorUnavailable");
            return EndTextCommandThefeedPostTicker(true, true);
        }
        
        await NetworkRequestEntry(clubInfo.id, 1);
    });

    while (true) {
        if (ClubsEnabled) {
            PedIdUpdateTickCount += 1;
            PlayerPedCoordsUpdateTickCount += 1;
            if (PedIdUpdateTickCount >= PedIdUpdateTickFrequency) {
                PedId = PlayerPedId();
                PedIdUpdateTickCount = 0;
            } else if (PlayerPedCoordsUpdateTickCount >= PlayerPedCoordsUpdateTickFrequency) {
                PlayerPedCoords = GetEntityCoords(PedId);
                PlayerPedCoordsUpdateTickCount = 0;
            } 

            if (!EnteringClub && !InsideClub) {
                var Nearby = NightClubs.find(nc => IsEntityNearNightclub(PedId, nc.id, PlayerPedCoords));
                if (Nearby) {
                    var Distance = Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], Nearby.coords[0], Nearby.coords[1], Nearby.coords[2]);
                    var DistanceFromGarage = (Nearby.garageEntryCoords ? Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], Nearby.garageEntryCoords[0], Nearby.garageEntryCoords[1], Nearby.garageEntryCoords[2]) : null);

                    if (Nearby.id !== LastClub) {
                        LastClub = Nearby.id;
                        JustEnteredNightclubNearbyScope(Nearby);
                    } else if (Distance < Nearby.enterZone) {
                        if (Nearby.id !== LastClub2) {
                            LastClub2 = Nearby.id;
                            JustEnteredNightclubEnterScope(Nearby);
                        } else if (IsControlJustReleased(EnterControlType, EnterControlIndex) && !IsCooldownActive('ENTRY_REQUEST_1')) {
                            SetCooldown("ENTRY_REQUEST_1", 1000);
                            await NetworkRequestEntry(Nearby.id, 1);
                        }

                        if (!IsLoadingScreenActive()) DisplayHelpTextThisFrame(`NightclubsNearbyClubHelpText`);
                    } else if (Distance > Nearby.enterZone && LastClub2) {
                        JustExitedNightclubEnterScope(Nearby);
                    } else if (DistanceFromGarage < Nearby.garageEnterZone) {
                        if (Nearby.id !== LastClub3) {
                            LastClub3 = Nearby.id;
                            JustEnteredNightclubEnterScope_2(Nearby);
                        } else if (IsControlJustReleased(EnterControlType, EnterControlIndex) && !IsCooldownActive('ENTRY_REQUEST_2')) {
                            SetCooldown('ENTRY_REQUEST_2', 1000);
                            await NetworkRequestEntry(Nearby.id, 2);
                        }

                        if (!IsLoadingScreenActive()) DisplayHelpTextThisFrame(`NightclubsNearbyClubHelpText`);
                    } else if (DistanceFromGarage > Nearby.garageEnterZone && LastClub3) {
                        JustExitedNightclubEnterScope_2(Nearby);
                    }
                } else if (!Nearby && LastClub) {
                    JustExitedNightclubNearbyScope(GetNightclubById(LastClub));
                    LastClub = null;
                }
            } 
            
            if (InsideClub && !EnteringClub) {
                CurrentInteriorCheckTickCount += 1;
                var DistanceFromDoor = Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], InteriorExitCoords[0], InteriorExitCoords[1], InteriorExitCoords[2]);
                var DistanceFromGarage = (InsideClub.garageEntryCoords ? Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], InteriorGarageExitCoords[0], InteriorGarageExitCoords[1], InteriorGarageExitCoords[2]) : 9999999999);
                if (DistanceFromDoor < 1.1) {
                    if (!IsLoadingScreenActive()) DisplayHelpTextThisFrame("NightclubsNearbyClubExitHelpText");

                    if (IsControlJustReleased(EnterControlType, EnterControlIndex) && !ExitingClub && !IsCooldownActive('EXIT_REQUEST_1')) {
                        SetCooldown('EXIT_REQUEST_1', 1000);
                        NetworkRequestExit(1);
                        DebugLog(`REQUESTING EXIT 1`);
                    }
                } else if (DistanceFromGarage < 2.5) {
                    if (!IsLoadingScreenActive()) DisplayHelpTextThisFrame("NightclubsNearbyClubExitHelpText");

                    if (IsControlJustReleased(EnterControlType, EnterControlIndex) && !ExitingClub && !IsCooldownActive('EXIT_REQUEST_2')) {
                        SetCooldown("EXIT_REQUEST_2", 1000);
                        NetworkRequestExit(2);
                        DebugLog(`REQUESTING EXIT 2`);
                    }                    
                }

                DisableControlAction(0, 24, true);
                DisableControlAction(0, 257, true);

                var PauseMenuActive = IsPauseMenuActive();
                var BigmapActive = IsBigmapActive();
                if (PauseMenuActive || BigmapActive) {
                    SetPlayerBlipPositionThisFrame(InsideClub.coords[0], InsideClub.coords[1]);
                    if (!MinimapPositionLocked) {
                        LockMinimapPosition(InsideClub.coords[0], InsideClub.coords[1]);
                        LockMinimapAngle();
                        SetBlipDisplay(ExitBlip, 0);
                        SetBlipDisplay(GarageBlip, 0);
                        MinimapPositionLocked = true;
                    }
                } else {
                    HideMinimapExteriorMapThisFrame();
                    if (MinimapPositionLocked) {
                        SetBlipDisplay(ExitBlip, 10);
                        SetBlipDisplay(GarageBlip, 10);
                        UnlockMinimapPosition();
                        UnlockMinimapAngle();
                        MinimapPositionLocked = false;
                    }
                }

                if (CurrentInteriorCheckTickCount >= CurrentInteriorCheckTickFrequency) { 
                    var CurrentInterior = GetInteriorFromEntity(PlayerPedId());
                    if (CurrentInterior !== ClubInteriorId && (InsideClub && !ExitingClub && !EnteringClub)) {
                        DebugLog(`Player isn't inside the nightclub interior, removing and unloading...`);
                        BeginTextCommandThefeedPost('NightclubsOutOfInterior');
                        EndTextCommandThefeedPostTicker(true, true);
                        NetworkRequestExit(1);
                    }
                }
            }
        }

        await Wait();
    }
})();

RegisterCommand('clubsdebug', () => {
    if (DebugLogsEnabled) {
        DebugLogsEnabled = false;
        DebugLog(`DebugLogsEnabled = false`, true);
    } else {
        DebugLogsEnabled = true;
        DebugLog(`DebugLogsEnabled = true`, true);
    }
});
/*RegisterCommand('clubsevalc', (source, args) => {
    console.log(eval(args.join(" ")))
})*/
