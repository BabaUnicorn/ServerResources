var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : TickRate));
var ClubsEnabled = true;
var TickRate = 3;
var PedId = PlayerPedId();
var PedIdUpdateTickFrequency = 100; // every 100 ticks
var PedIdUpdateTickCount = 0;
var PlayerPedCoords = GetEntityCoords(PedId);
var PlayerPedCoordsUpdateTickCount = 0;
var PlayerPedCoordsUpdateTickFrequency = 100;
var EnterControlType = 0;
var EnterControlIndex = 51;
var EnterControlButton = "~INPUT_CONTEXT~";
var InsideClub = null;
var EnteringClub = null;
var LastClub = null;
var LastClub2 = null;
var LastCheckpoint = null;
var ExitCheckpoint = null;
var MinimapPositionLocked = false;
var ClubInteriorId = 271617;
var ActiveInteriorEntitySets = [];
var ConcealedPlayers = [];
var InteriorCoords = [-1569.2620849609375, -3014.269287109375, -74.41017150878906];
var InteriorExitCoords = [-1569.38525390, -3016.544921875, -74.40615844];
var NightClubs = [];

AddTextEntry("NightclubsNearbyClubHelpText", `Press ${EnterControlButton} to enter this nightclub`);
AddTextEntry("NightclubsNearbyClubExitHelpText", `Press ${EnterControlButton} to exit this nightclub`);

function SetTickRate(tickRate) {
    TickRate = tickRate;
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

    emitNet('Nightclubs:ClubsRequest');
    onNet('Nightclubs:ClubsReceived', clubs => {
        NightClubs = JSON.parse(clubs);
    });
}

RequestNightClubsFromServer();

(async function() {
    while (!HaveClubsBeenReceived()) {
        console.log(`Requesting clubs...`);
        RequestNightClubsFromServer();
        await Wait(1500);
    }

    console.log(`Received ${NightClubs.length} clubs`);
    BusyspinnerOff();

    if (ClubsEnabled) SetClubBlips(NightClubs);

    function GetNightclubById (id) {
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
        ConcealedPlayers.push(PlayerID);
        return NetworkConcealPlayer(PlayerID, true);
    }

    function RemoveHiddenPlayer(PlayerID) {
        ConcealedPlayers = ConcealedPlayers.filter(cp => cp !== PlayerID);
        return NetworkConcealPlayer(PlayerID, false);
    }

    function RemoveAllHiddenPlayers() {
        ConcealedPlayers.forEach(async cp => {
            NetworkConcealPlayer(cp, false);
            console.log('removiong hidden player ' + cp)
            await Wait(0);
        });
        ConcealedPlayers.length = 0;
    }

    function JustEnteredNightclubNearbyScope(club) {
        console.log(`we just entered scope of ${club.id}`);

        var color = [113, 200, 255, 255];
        if (club.markerColor && (club.markerColor.length && club.markerColor.length == 4)) color = club.markerColor;
        LastCheckpoint = CreateCheckpoint(49, club.coords[0], club.coords[1], club.coords[2] - 1, null, null, null, club.enterZone+1, color[0], color[1], color[2], color[3]);
        SetCheckpointCylinderHeight(LastCheckpoint, 1.65);
    }

    function JustExitedNightclubNearbyScope(club) {
        console.log(`we just exited scope of ${club.id}`)
        if (LastCheckpoint) {
            DeleteCheckpoint(LastCheckpoint);
        }
    }

    function JustEnteredNightclubEnterScope(club) {
        console.log(`we just entered enter scope of ${club.id}`)
    }

    function JustExitedNightclubEnterScope(club) {
        console.log(`we just exited enter scope of ${club.id}`)
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
                    Props = ['Int01_ba_Style01', 'Int01_ba_trad_lights', 'light_rigs_off', 'Int01_ba_equipment_setup', 'Int01_ba_Worklamps', 'Int01_ba_Clutter'];
                break;
            }

            Props.forEach(async prop => {
                ActivateInteriorEntitySet(ClubInteriorId, prop);
                ActiveInteriorEntitySets.push(prop);
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
        }
        if (club.miscProps) {
            club.miscProps.forEach(async p => {
                ActivateInteriorEntitySet(ClubInteriorId, p);
                ActiveInteriorEntitySets.push(p);
                await Wait(50);
            });
        }

        await Wait(500);

        RefreshInterior(ClubInteriorId);

        HasPrepared = true;
        setTimeout(() => {
            HasPrepared = false;
        }, 2);
    }

    function HasInteriorPrepared() {
        return HasPrepared;
    }

    function RestartInterior() {
        ActiveInteriorEntitySets.forEach(async set => {
            //console.log(`Deactivating ${set}`)
            DeactivateInteriorEntitySet(ClubInteriorId, set);
            await Wait(10);
        });

        ActiveInteriorEntitySets.length = 0;
        RefreshInterior(ClubInteriorId);
    }

    RegisterCommand('restartinterior', () => {
        RestartInterior();
    });

    async function NetworkOnResponse (response, extra, extra2) {
        if (!response || InsideClub || !EnteringClub) return null;

        switch (response.toLowerCase()) {
            case 'timeout':
                StopLoadingScreen();
                EnteringClub = null;
                BusyspinnerOff();
            break;
            case 'rejected':
                StopLoadingScreen();
                EnteringClub = null;
                BusyspinnerOff();            
            break;
            case 'accepted':
                EnteringClub = null;
                InsideClub = extra;

                SetEntityCoords(PedId, InteriorCoords[0], InteriorCoords[1], InteriorCoords[2]);
                PlayerPedCoords = InteriorCoords;
                BeginTextCommandBusyspinnerOn('MP_SPINLOADING');
                EndTextCommandBusyspinnerOn(5);

                function RequestCollision() {
                    RequestCollisionAtCoord(InteriorCoords[0], InteriorCoords[1], InteriorCoords[2]);
                    RequestAdditionalCollisionAtCoord(InteriorCoords[0], InteriorCoords[1], InteriorCoords[2]);
                }

                FreezeEntityPosition(PedId, true);
                SetEntityHeading(PedId, 0);
                SetGameplayCamRelativeHeading(0);

                while (!HasCollisionLoadedAroundEntity(PedId)) {
                    SetEntityCoords(PedId, InteriorCoords[0], InteriorCoords[1], InteriorCoords[2]);
                    RequestCollision();

                    await Wait(500);
                }

                await PrepareNightclubInterior(extra);
                while (!HasInteriorPrepared()) {
                    await Wait(100);
                }

                DeleteCheckpoint(LastCheckpoint);
                LastCheckpoint = null;
                if (!ExitCheckpoint) {
                    ExitCheckpoint = CreateCheckpoint(49, InteriorExitCoords[0], InteriorExitCoords[1], InteriorExitCoords[2] - 1, null, null, null, 2, 255, 50, 50, 180);
                    SetCheckpointCylinderHeight(ExitCheckpoint, 1.65);
                }

                DoScreenFadeOut();

                StopLoadingScreen();
                BusyspinnerOff(); 
                FreezeEntityPosition(PedId, false);

                await Wait(3000);

                if (extra2) { // players to hide
                    extra2.forEach(async player => {
                        var Player = GetPlayerFromServerId(player.id);
                        if (Player !== PlayerId()) {
                            console.log(player.id)
                            console.log(`playerName = ${Player}`)

                            if (Player) HidePlayer(Player);

                            console.log('(extra2.forEach) Hiding player ' + Player);
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

    async function NetworkRequestEntry (Club) {
        if (!Club) return false;

        Club = GetNightclubById(Club);
        EnteringClub = Club;
        InsideClub = null;

        StartupLoadingScreen();

        await Wait(2000);

        BeginTextCommandBusyspinnerOn('FMMC_DOWNLOAD');
        EndTextCommandBusyspinnerOn(4);

		emitNet("Nightclubs:EnterRequest", JSON.stringify(EnteringClub));
		onNet("Nightclubs:EnterRequestRejected", () => {
			NetworkOnResponse("rejected");
		});
		onNet("Nightclubs:EnterRequestAccepted", async (PlayersToHide) => {
            await Wait(1000);
			NetworkOnResponse("accepted", EnteringClub, JSON.parse(PlayersToHide));
		});

        var StartedWaiting = GetGameTimer();
        while (!InsideClub && EnteringClub) {
            var CurrentTime = GetGameTimer();

            SetMouseCursorActiveThisFrame();

            if ((CurrentTime - StartedWaiting) >= 10000) {
                SetWarningMessageWithHeader("HUD_ALERT", "NightclubsServerTakingTooLongWarningMessageBody", 134217748, false, false, false, false);
                if (IsControlJustReleased(2, 201)) {
                    DoScreenFadeOut();

                    NetworkOnResponse('timeout');

                    setTimeout(() => {
                        NetworkRequestEntry(Club.id);
                        DoScreenFadeIn(1000);
                    }, 3000);
                } else if (IsControlJustReleased(2, 202)) {
                    NetworkOnResponse('timeout');
                }
            }

            await Wait(3);
        }
    }

    async function ExitNightclub(Club) {
        if (!Club) return false;

        InsideClub = null;
        EnteringClub = null;
        LastClub = null;
        LastClub2 = null;

        DeleteCheckpoint(ExitCheckpoint);
        ExitCheckpoint = null;

        DoScreenFadeOut(1500);

        while (IsScreenFadingOut()) {
            await Wait(1);
        }

        RestartInterior();
        RemoveAllHiddenPlayers();

        function RequestCollision() {
            RequestCollisionAtCoord(Club.coords[0], Club.coords[1], Club.coords[2]);
            RequestAdditionalCollisionAtCoord(Club.coords[0], Club.coords[1], Club.coords[2]);
        }

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

        await Wait(1000);

        DoScreenFadeIn(2000);
    }

    async function NetworkRequestExit() {
        if (!InsideClub) return false;

        BeginTextCommandBusyspinnerOn();
        EndTextCommandBusyspinnerOn(4);

        emitNet("Nightclubs:ExitRequest", JSON.stringify(InsideClub));
		onNet("Nightclubs:ExitRequestAccepted", async () => {	
            BusyspinnerOff();
			ExitNightclub(InsideClub); 
		});
    }

    RegisterCommand('exit', () => {
        NetworkRequestExit()
    })

    on('onResourceStop', (resource) => {
        if (GetCurrentResourceName() === resource) {
            RestartInterior();
            RemoveAllHiddenPlayers();
        }
    });

    onNet('Nightclubs:HidePlayer', async (playerServerId) => {
        await Wait(1500);
        
        if (playerServerId !== PlayerId()) HidePlayer(GetPlayerFromServerId(playerServerId));

        console.log("Hid player (Nightclubs:HidePlayer)")
        console.log(playerServerId)
        console.log(GetPlayerFromServerId(playerServerId))
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
            } else if (!EnteringClub && !InsideClub) {
                var Nearby = NightClubs.find(nc => IsEntityNearNightclub(PedId, nc.id, PlayerPedCoords));
                if (Nearby) {
                    var Distance = Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], Nearby.coords[0], Nearby.coords[1], Nearby.coords[2]);
            
                    if (Nearby.id !== LastClub) {
                        LastClub = Nearby.id;
                        JustEnteredNightclubNearbyScope(Nearby);
                    } else if (Distance < Nearby.enterZone) {
                        if (Nearby.id !== LastClub2) {
                            LastClub2 = Nearby.id;
                            JustEnteredNightclubEnterScope(Nearby);
                        } else if (IsControlJustReleased(EnterControlType, EnterControlIndex)) {
                            await NetworkRequestEntry(Nearby.id);
                        }
                        // help text below displays without the if condition despite line 463?
                        if (!EnteringClub && !InsideClub) DisplayHelpTextThisFrame(`NightclubsNearbyClubHelpText`);
                    } else if (LastClub2 && Distance > Nearby.enterZone) {
                        JustExitedNightclubEnterScope(GetNightclubById(LastClub2));
                        LastClub2 = null;
                    }

                } else if (!Nearby && LastClub) {
                    JustExitedNightclubNearbyScope(GetNightclubById(LastClub));
                    LastClub = null;
                }
            } 
            
            if (InsideClub && !EnteringClub) {
                if (Get3dDistance(PlayerPedCoords[0], PlayerPedCoords[1], PlayerPedCoords[2], InteriorExitCoords[0], InteriorExitCoords[1], InteriorExitCoords[2]) < 1) {
                    DisplayHelpTextThisFrame("NightclubsNearbyClubExitHelpText");
                    if (IsControlJustReleased(EnterControlType, EnterControlIndex)) {
                        NetworkRequestExit();
                    }
                }

                DisableControlAction(0, 24, true);
                DisableControlAction(0, 25, true);
                DisableControlAction(0, 257, true);

                var PauseMenuActive = IsPauseMenuActive();
                var BigmapActive = IsBigmapActive();
                if (PauseMenuActive || BigmapActive) {
                    SetPlayerBlipPositionThisFrame(InsideClub.coords[0], InsideClub.coords[1]);
                    if (!MinimapPositionLocked) {
                        LockMinimapPosition(InsideClub.coords[0], InsideClub.coords[1]);
                        MinimapPositionLocked = true;
                    }
                } else if (!PauseMenuActive) {
                    HideMinimapExteriorMapThisFrame();
                    if (MinimapPositionLocked) {
                        UnlockMinimapPosition();
                        MinimapPositionLocked = false;
                    }
                }
            }
        }

        await Wait();
    }
})();