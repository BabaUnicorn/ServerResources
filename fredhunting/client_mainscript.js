var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : TickRate));
var MinigameEnabled = true;
var TickRate = 4;
var JoinControlType = 0;
var JoinControlIndex = 51;
var JoinControlButton = "~INPUT_CONTEXT~";
var PedCoords = GetEntityCoords(PlayerPedId());
var PlayerPedIdCache = PlayerPedId();
var PlayerPedIdUpdateFrequency = 220;
var UpdateCoordsTickCount = 0;
var UpdatePlayerPedIdTickCount = 0;
var PedCoordUpdateFrequency = 120; // update after x ticks
var PopulateNowTickCount = 0;
var PopulateNowTickFrequency = 2000;
var DeadOrDyingCheckTickCount = 0;
var DeadOrDyingCheckTickFrequency = 20;
var GamePedPool = GetGamePool("CPed");
var GamePedPoolTickCount = 0;
var GamePedPoolTickFrequency = 170;
var KillCooldown = 500;
var KillCooldownActive = false;
var PauseClockTimeTickCount = 0;
var PauseClockTimeTickFrequency = 200;
var PauseWeatherTickCount = 0;
var PauseWeatherTickFrequency = 1000;
var Joining = false;
var Joined = false;
var _LastNotified = 0;
var _LastZone = 0;
var _LastFeedPostID = 0;
var HuntingInID = null;
var HuntingInInfo = null;
var AnimalsNearby = [];
var OtherPedsNearby = [];
var SentToServer = [];
var Kills = []; // Kills received from server
var ClockTimeOverriden = false;
var WeatherOverriden = false;
var StartedAt = 0;
var GetHuntingZoneByID = null;
var RadarHidden = false;
var FeedIsPaused = false;
var Zones = [];
var MeleeWeaponHashes = {};
var MeleeWeapons = [
	"weapon_dagger",
	"weapon_bat",
	"weapon_bottle",
	"weapon_crowbar",
	"weapon_unarmed",
	"weapon_flashlight",
	"weapon_golfclub",
	"weapon_hammer",
	"weapon_hatchet",
	"weapon_knuckle",
	"weapon_knife",
	"weapon_machete",
	"weapon_switchblade",
	"weapon_nightstick",
	"weapon_wrench",
	"weapon_battleaxe",
	"weapon_poolcue",
	"weapon_stone_hatchet"
].forEach(async w => {
	MeleeWeaponHashes[w] = GetHashKey(w);
	await Wait();
});

AddTextEntry("HuntingNearbyZone", "Press "+JoinControlButton+" to start hunting in this zone.");

function IsMeleeWeapon (hash) {
	if (!hash) return false;
	return (Object.entries(MeleeWeaponHashes).find(o => o[1] === hash) ? true : false);
}

function GetMeleeWeaponByHash (hash) {
	if (!hash) return false;
	return (Object.entries(MeleeWeaponHashes).find(o => o[1] === hash) || null);
}

function SetTickRate (num) {
	//DebugLog(`SetTickRate`);
	TickRate = num;
	return TickRate;
}

function RequestHuntingZones () {
	if (!BusyspinnerIsDisplaying()) {
		BeginTextCommandBusyspinnerOn();
		EndTextCommandBusyspinnerOn(4);
	}

	emitNet("Hunting:ClientHuntingZonesRequest");
	onNet("Hunting:ZonesReceived", (zoneString) => {
		Zones = JSON.parse(zoneString);
		DebugLog(zoneString);
		console.log('Received zones');
	});
}

function HaveZonesBeenReceived () {
	//DebugLog("HaveZonesBeenReceived");
	return (Zones.length > 1 ? true : false);
}

onNet("Hunting:ReceivedServerKills", (KillArray) => {
	Kills = JSON.parse(KillArray);
	DebugLog(`Kills received from server`);
	DebugLog(KillArray);
});

(async function () {
	while (!HaveZonesBeenReceived()) {
		console.log("Requesting hunting zones");
		RequestHuntingZones();

		await Wait(2000);
	}

	console.log("Ready to play");
	BusyspinnerOff();

	if (MinigameEnabled) SetHuntingBlips();

	GetHuntingZoneByID = function (ZoneID) {
		//DebugLog(`GetHuntingZoneByID`);
		var _Zone = Zones.find(z => z.id === ZoneID);
		if (!_Zone) return null;
		return _Zone;	
	}

	function IsEntityInHuntingZone (EntityID, ZoneID, EntityCoords) {
		//DebugLog(`IsEntityInHuntingZone`);
		var PedCoords2 = (EntityCoords ? EntityCoords : GetEntityCoords(EntityID));
		var _Zone = GetHuntingZoneByID(ZoneID);
		if (!_Zone) return null;

		var resX = _Zone.coords[0] - PedCoords2[0];
		var resY = _Zone.coords[1] - PedCoords2[1];
		var resZ = _Zone.coords[2] - PedCoords2[2];
		var distance = Math.sqrt((resX * resX) + (resY * resY) + (resZ * resZ));

		if (distance < _Zone.zone) return true;
		return false;
	}

	function IsPlayerInHuntingZone (ZoneID, UseCachedCoords) {
		return IsEntityInHuntingZone(PlayerPedIdCache, ZoneID, UseCachedCoords ? PedCoords : null);
	}

	function ToggleMinigame () {
		//DebugLog(`ToggleMinigame`);
		if (Joined || Joining) return null;

		if (!MinigameEnabled) {
			MinigameEnabled = true;
			if (Blips.length < 1) SetHuntingBlips();

			BeginTextCommandThefeedPost("HuntingEnabledFeedPost");
			EndTextCommandThefeedPostTicker(false, true);
		} else {
			MinigameEnabled = false;
			RemoveHuntingBlips();

			RemoveMinimapRadiusForHuntingZone();
			ThefeedClearFrozenPost();
			ThefeedRemoveItem(_LastFeedPostID);
			_LastZone = 0;
			BeginTextCommandThefeedPost("HuntingDisabledFeedPost");
			EndTextCommandThefeedPostTicker(false, true);
		}


		return MinigameEnabled;
	}
	
	onNet('Hunting:ToggleMinigame', () => {
		DebugLog(ToggleMinigame());
	});

	function JustEnteredHuntingZoneScope (ZoneID) {
		//DebugLog("JustEnteredHuntingZoneScope")
		var ZoneInfo = GetHuntingZoneByID(ZoneID);

		AddMinimapRadiusForHuntingZone(ZoneID, ZoneInfo.radarZoomoutAni);
		FlashMinimapDisplay();

		if (_LastNotified !== ZoneID) {
			_LastNotified = ZoneID;
			ThefeedClearFrozenPost();
			setTimeout(() => {
				ThefeedFreezeNextPost();
				ZoneInfo.hudColor ? ThefeedNextPostBackgroundColor(224) : "";
				BeginTextCommandThefeedPost("HuntingInsideZone");
				AddTextComponentSubstringPlayerName(ZoneInfo.name);
				_LastFeedPostID = EndTextCommandThefeedPostTicker(true, true);
			}, 50);
		}
	}

	function JustExitedHuntingZoneScope (ZoneID) {
		RemoveMinimapRadiusForHuntingZone();
		ThefeedClearFrozenPost();
		ThefeedRemoveItem(_LastFeedPostID);
		//DebugLog("JustExitedHuntingZoneScope")
	}

	function OnNetworkResponse (Response, extra1) {
		//DebugLog(`OnNetworkResponse`);
		switch (Response.toLowerCase()) {
			case 'timeout':
				DebugLog("Timed out");
				BusyspinnerOff();
				PreloadBusyspinner();
				StopPlayerSwitch();
				
				if (extra1 !== false) {
					ThefeedNextPostBackgroundColor(6);
					BeginTextCommandThefeedPost("HuntingJoiningTimeout");
					EndTextCommandThefeedPostTicker(true, true);
				}

				SetHuntingBlips();

				_LastNotified = 0;

				Joining = false;
				Joined = false;
			break;
			case 'accepted':
				StartHunting(_LastZone);
			break;
			case 'rejected':
				Joining = false;
				Joined = false;

				DebugLog("Rejected")

				BusyspinnerOff();
				PreloadBusyspinner();
				StopPlayerSwitch();
				//

				ShowMidsizedNotification("HuntingError", "HuntingJoiningRejected", 15000, 6, true);
			break;
		}
	}

	function StopOngoingHunting (reasonID) {
		Joining = false;
		Joined = false;
		_LastZone = 0;
		_LastNotified = 0;
		StartedAt = 0;
		Kills = [];
		ThefeedClearFrozenPost();
		SetHuntingBlips();
		ResetScriptGfxAlign();
		RemoveAllAnimalBlips();
		if (RadarHidden) {
			DisplayRadar(true);
			RadarHidden = false;
		} 
		if (ClockTimeOverriden) {
			NetworkClearClockTimeOverride();
			ClockTimeOverriden = false;
		}
		if (WeatherOverriden) {
			ClearOverrideWeather();
			WeatherOverriden = false;
		} 
	
		DebugLog(`StopOngoingHunting`);
		emitNet("Hunting:GameEnded", JSON.stringify({
			ZoneID: HuntingInID,
			ZoneInfo: HuntingInInfo,
			reasonID: reasonID
		}));

		HuntingInID = null;
		HuntingInInfo = null;
	}

	async function StartHunting (ZoneID) {
		if (Joined) {
			DebugLog(`We're already joined`);
			return false;
		}

		DebugLog("accepted");

		Joining = false;
		Joined = true;
		HuntingInID = ZoneID;
		HuntingInInfo = GetHuntingZoneByID(ZoneID);

		if (HuntingInInfo.ongoingGameRadarIsEnabled === false) {
			RadarHidden = true;
			DisplayRadar(false);
		}

		RemoveHuntingBlips();
		BusyspinnerOff();
		StopPlayerSwitch();
		ThefeedRemoveItem(_LastFeedPostID);

		BeginTextCommandDisplayHelp("HuntingJoiningAcceptedHelptext");
		EndTextCommandDisplayHelp();

		var ShardColour = null;
		if (HuntingInInfo.hudColor) {
			if (HudColorAutoUpdateEnabled) ReplaceHudColourWithRgba(224, HuntingInInfo.hudColor[0], HuntingInInfo.hudColor[1], HuntingInInfo.hudColor[2], 255);
			ThefeedNextPostBackgroundColor(224);
			SetHelpMessageTextStyle(3, 224, 160, 0, 0);
			ShardColour = 224;
		}

		ShowMidsizedNotification('HuntingJoiningAcceptedHeader', 'HuntingJoiningAcceptedMsgText', 15000, ShardColour, true, null, [HuntingInInfo.name]);

		StartedAt = Date.now();

		return ZoneID;
	}

	onNet("Hunting:StopOngoingHunting", (reasonID) => {
		StopOngoingHunting(reasonID ? reasonID : 0);
	});

	async function NetworkRequestJoin () {
		if (Joining || Joined) return false;
		
		var ZoneInfo = GetHuntingZoneByID(_LastZone);

		DebugLog('NetworkRequestJoin');

		SwitchOutPlayer(PlayerPedId(), ZoneInfo.playerSwitchType, 2);
		ThefeedClearFrozenPost();

		BeginTextCommandBusyspinnerOn(); // "HuntingJoiningSpinner"
		EndTextCommandBusyspinnerOn(5);

		while (!IsPlayerSwitchInProgress()) {
			await Wait(100);
		}

		Joining = true;
		
		DisplayRadar(false);

		await Wait(1500);

		BusyspinnerOff();
		DisplayRadar(true);

		BeginTextCommandBusyspinnerOn("HuntingJoiningSpinner_2");
		EndTextCommandBusyspinnerOn(4);

		emitNet("Hunting:ClientJoinRequest", JSON.stringify({
			"Zone": _LastZone,
			"RequestBy": GetPlayerServerId(PlayerId())
		}));
		onNet("Hunting:JoinRequestRejected", () => {
			OnNetworkResponse("rejected");
		});
		onNet("Hunting:JoinRequestAccepted", async () => {
			if (ZoneInfo.overrideClockTime) {
				var clock = ZoneInfo.overrideClockTime;
				NetworkOverrideClockTime(clock[0], clock[1], clock[2]);
				ClockTimeOverriden = true;
				await Wait(500);
			} 
			if (ZoneInfo.overrideWeather) {
				SetOverrideWeather(ZoneInfo.overrideWeather);
				WeatherOverriden = true;
				await Wait(500);
			} 
	
			OnNetworkResponse("accepted");
		});

		var WarningMessageShown = true;
		var StartedWaiting = GetGameTimer();
		while (Joining !== false) {
			var CurrentTime = GetGameTimer();
		
			SetMouseCursorActiveThisFrame();
			if (CurrentTime - StartedWaiting >= 10000 && Joining) {
				if (WarningMessageShown) {
					SetWarningMessageWithHeader("HUD_ALERT", "HuntingTimeoutWarningMessageBody", 134217748, false, false, false, false);
					SetScriptGfxAlign(76, 66);
					Draw2DText(0.0, 0.753, `Time waiting: ~g~${((CurrentTime - StartedWaiting) / 1000).toFixed(0)}`, 4, 0.8, 255, 255, 255, 100, false);
					ThefeedHideThisFrame();
				}
				
				if (WarningMessageShown && IsControlJustReleased(2, 201)) {
					DoScreenFadeOut();
					OnNetworkResponse('timeout', false);
					setTimeout(() => {
						DoScreenFadeIn(3000);
						if (MinigameEnabled && !Joining) NetworkRequestJoin();
					}, 3000);
				} else if (WarningMessageShown && IsControlJustReleased(2, 202)) {
					OnNetworkResponse('timeout');
				} else if (IsControlJustReleased(2, 203)) {
					if (WarningMessageShown) {
						WarningMessageShown = false;
					} else WarningMessageShown = true;
				}
			}

			HideHudAndRadarThisFrame();

			await Wait();
		}

		BusyspinnerOff();
	}

	while (true) {
		if (MinigameEnabled) {
			UpdatePlayerPedIdTickCount += 1;
			if (UpdatePlayerPedIdTickCount >= PlayerPedIdUpdateFrequency) {
				DebugLog('Ped id updated')
				PlayerPedIdCache = PlayerPedId();
				UpdatePlayerPedIdTickCount = 0;
			} else if (!Joined && !Joining) {
				UpdateCoordsTickCount += 1;
				if (UpdateCoordsTickCount >= PedCoordUpdateFrequency) {
					PedCoords = GetEntityCoords(PlayerPedId());
					UpdateCoordsTickCount = 0;
					DebugLog("Ped coords updated");
				}

				var nearby = (Zones.find(z => IsPlayerInHuntingZone(z.id, true))) || null;

				if (nearby) {
					if (_LastZone !== nearby.id) {
						_LastZone = nearby.id;
						JustEnteredHuntingZoneScope(nearby.id);
					}

					(function HUD () {
						DisplayHelpTextThisFrame("HuntingNearbyZone");
						if (nearby.hudColor) {
							if (HudColorAutoUpdateEnabled) ReplaceHudColourWithRgba(224, nearby.hudColor[0], nearby.hudColor[1], nearby.hudColor[2], 255 /* Opacity */);
							SetHelpMessageTextStyle(3, 224, 160, 0, 0);
						}
					})();

					if (IsControlJustReleased(JoinControlType, JoinControlIndex) && IsPlayerInHuntingZone(nearby.id) && !Joined && !Joining) NetworkRequestJoin();
				} else {
					if (_LastZone !== 0) {
						JustExitedHuntingZoneScope(_LastZone);
						_LastZone = 0;
						_LastNotified = 0;
					}
				}
			} 

			if (Joined && !Joining){
			//	console.log("Hunting match is going on")
			//	console.log(HuntingInInfo)
				PopulateNowTickCount += 1;
				GamePedPoolTickCount += 1;
				DeadOrDyingCheckTickCount += 1;
				if (HuntingInInfo.clockPaused) PauseClockTimeTickCount += 1;
				if (HuntingInInfo.weatherPaused) PauseWeatherTickCount += 1;
				if ((HuntingInInfo.gameDuration && Date.now() - StartedAt) >= HuntingInInfo.gameDuration) {
					StopOngoingHunting(4);
				} else if (GamePedPoolTickCount >= GamePedPoolTickFrequency) {
					DebugLog(`GamePedPool check`);
					GamePedPoolTickCount = 0;
					GamePedPool = GetGamePool("CPed");
					AnimalsNearby = [];
					GamePedPool.forEach(async ped => {
						if (IsEntityInHuntingZone(ped, HuntingInID)) {
							var model = GetEntityModel(ped);
							var coords = GetEntityCoords(ped);
							var AnimalInfo = HuntingInInfo.animals.find(a => a.modelHash === model);
							if (AnimalInfo) {
								AnimalsNearby.push({
									PedID: ped,
									PedAnimalInfo: AnimalInfo, 
									Coords: coords
								});
								if (HuntingInInfo.ongoingGameAnimalBlipsEnabled && !IsPedDeadOrDying(ped) && !DoesAnimalHaveBlip(ped)) {
									SetAnimalBlip(ped)
								}
							} else {
								OtherPedsNearby.push(ped);
							}
						}

						await Wait();
					});
				} else if (HuntingInInfo.enablePopulating && PopulateNowTickCount >= PopulateNowTickFrequency) {
					PopulateNowTickCount = 0;
					PopulateNow();
					DebugLog(`Populating`);
				} else if ((HuntingInInfo.clockPaused && HuntingInInfo.overrideClockTime) && PauseClockTimeTickCount >= PauseClockTimeTickFrequency) {
					PauseClockTimeTickCount = 0;
					var clock = HuntingInInfo.overrideClockTime;
					NetworkOverrideClockTime(clock[0], clock[1], clock[2]);
					DebugLog(`Pause clock time: Clock time set to ${clock[0]}:${clock[1]}:${clock[2]}`);
				} else if ((HuntingInInfo.weatherPaused && HuntingInInfo.overrideWeather) && PauseWeatherTickCount >= PauseWeatherTickFrequency) {
					PauseWeatherTickCount = 0;
					SetOverrideWeather(HuntingInInfo.overrideWeather);
					DebugLog(`Pause weather: Set weather to ${HuntingInInfo.overrideWeather}`);
				} if (DeadOrDyingCheckTickCount >= DeadOrDyingCheckTickFrequency) {
					DebugLog(`DaedOrDying check`);
					DeadOrDyingCheckTickCount = 0;
					var DeadOrDyingAnimals = AnimalsNearby.filter(p => IsPedDeadOrDying(p.PedID, true) && GetPedSourceOfDeath(p.PedID) === PlayerPedIdCache && !SentToServer.find(p2 => p2.PedID === p.PedID));
					if (DeadOrDyingAnimals.length > 0) {
						DeadOrDyingAnimals.forEach(p => {
							if (!KillCooldownActive) {
								KillCooldownActive = true;
								setTimeout(() => {
									KillCooldownActive = false;
								}, KillCooldown);
	
								var PedCoords = GetEntityCoords(p.PedID);
								var CauseOfDeath = GetPedCauseOfDeath(p.PedID);
								var blip = AddBlipForEntity(p.PedID);
								SetBlipSprite(blip, 119);
								SetBlipScale(blip, 1.5);
								SetBlipColour(blip, 1);
								SetBlipHiddenOnLegend(blip, true);
								SetBlipFlashes(blip, true);
								/*BeginTextCommandSetBlipName("HuntingDeadAnimalBlipName");
								EndTextCommandSetBlipName(blip);*/

								SentToServer.push(p);
	
								RemoveAnimalBlip(p.PedID);
									
								DebugLog(`SENDING TO SERVER KILL`);
								var stringified = JSON.stringify({
									"causeOfDeath": CauseOfDeath,
									"wasKilledByStealth": WasPedKilledByStealth(p.PedID),
									"weaponUsedIsMelee": IsMeleeWeapon(CauseOfDeath),
									"meleeWeaponUsed": GetMeleeWeaponByHash(CauseOfDeath),
									"deathCoords": PedCoords,
									"by": PlayerPedIdCache,
									"killerServerID": PlayerId(),
									"animal": p
								});
								DebugLog(stringified);
								emitNet("Hunting:AnimalKilled", stringified);
	
								HuntingInInfo.hudColor ? ThefeedNextPostBackgroundColor(224) : "";
								OnKillNotification(null, p.PedAnimalInfo.name, PlayerPedIdCache, 0);
	
								setTimeout(() => {
									RemoveBlip(blip);
									if (NetworkGetEntityOwner(p.PedID) === PlayerId()) DeleteEntity(p.PedID);
								}, 10000);
							}
						});
					} 
				}

				var BigmapActive = IsBigmapActive();
				var PauseMenuActive = IsPauseMenuActive();
				if (BigmapActive || PauseMenuActive) { 
					if (!IsPlayerInHuntingZone(HuntingInID)) {
						if (!FeedIsPaused) {
							FeedIsPaused = true;
							ThefeedPause();
							DebugLog("Feed paused");
							DebugLog(`FeedIsPaused = ${FeedIsPaused}`);
						}

						SetScriptGfxAlign(76, 66);
						Draw2DText(0.0, 0.46, `~r~You are out of hunting bounds.\n~w~Kills won't count unless you go back in the zone.`, 4, 1, 255, 255, 255, 100, false);
						ThefeedHideThisFrame();
					} else {
						if (!FeedIsPaused) {
							FeedIsPaused = true;
							ThefeedPause();
							DebugLog("Feed paused");
							DebugLog(`FeedIsPaused = ${FeedIsPaused}`);
						}
	
						var X = 0.0;
						var Y = 0.17;
						if (IsRadarHidden() || PauseMenuActive) Y = 0.60;
						var text = `~g~Hunt info\n`+
						`~w~Kills: ~g~${Kills.length}\n`+
						`~w~Animals nearby: ~g~${AnimalsNearby.length}\n`+
						`~w~Time hunting: ~g~${((Date.now() - StartedAt) / 1000).toFixed(0)}`;

						SetScriptGfxAlign(76, 66);
						SetScriptGfxDrawBehindPausemenu(true);
						Draw2DText(X, Y, text, 4, 0.8, 255, 255, 255, 100, false);
						//ResetScriptGfxAlign();
						ThefeedHideThisFrame();
					}
				} else if (!BigmapActive && FeedIsPaused) {
					FeedIsPaused = false;
					ThefeedResume();
					DebugLog("Feed resumed");
					DebugLog(`FeedIsPaused = ${FeedIsPaused}`);
				}

				IsPedDeadOrDying(PlayerPedId()) ? StopOngoingHunting(1) : ""
			}
		}

		await Wait();
	}
})();


/*
RegisterCommand('huntclienteval', (source, args) => {
	console.log(eval(args.join(" ")));
});*/
RegisterCommand('huntspawndebugdeer', () => {
	var coords = GetEntityCoords(PlayerPedId());
	CreatePed(10, GetHashKey('a_c_deer'), coords[0], coords[1], coords[2], true);
});
RegisterCommand('audiotest', async() => {
	RequestAmbientAudioBank("SCRIPT\\HUNTING_1_COYOTE_VOCALS", 0, -1);
	
	PlaySoundFromEntity(-1, "COYOTE_BARK_MASTER", PlayerPedId(), 0, false, 0);
});

RegisterCommand('huntkill', () => {
	SetEntityHealth(PlayerPedId(), 0);
});
RegisterCommand('huntcoords', () => {
	var coords = GetEntityCoords(PlayerPedIdCache);
	BeginTextCommandThefeedPost("STRING");
	AddTextComponentSubstringPlayerName(`X: ${coords[0]}~n~Y: ${coords[1]}~n~Z: ${coords[2]}`);
	EndTextCommandThefeedPostTicker(false, true);
});