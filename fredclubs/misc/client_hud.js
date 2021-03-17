AddTextEntry("Nightclubs", "Nightclubs");
AddTextEntry("NightclubsBlipName_1", "Nightclub");
AddTextEntry("NightclubsBlipName_2", "Current nightclub (~a~)");
AddTextEntry("NightclubsNearbyClubHelpText", "...");
AddTextEntry("NightclubsNearbyClubExitHelpText", "...");
AddTextEntry("NightclubsServerTakingTooLongWarningMessageBody", "The server is taking too long to respond... would you like to try again?");
AddTextEntry("NightclubsWelcomeFeedPost", "Enjoy your stay!");
AddTextEntry("NightclubsOutOfInterior", "You have been removed from the nightclub automatically because you left the interior's bounds. Feel free to re-enter from the exterior.");
AddTextEntry("NightclubsToggled", "Clubs are now ~a~. Type ~p~/clubs toggle ~w~to undo.");
AddTextEntry("NightclubsInviteReceived", "You have been invited to a Nightclub. Type ~h~/club accept ~a~~h~ to accept this invite.");
AddTextEntry("NightclubsErrorUnavailable", "This action is unavailable at this time. Try again later.");

var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : DrawTickRate));
var ClubBlips = [];
var DrawTickRate = 3;
var LoadingScreenActive = false;
var DebugLogsEnabled = true;
var CurrentClubBlip = null;
var ExitBlip = null;
var GarageBlip = null;
var NightclubsTxd = CreateRuntimeTxd('script_nightclubs');
var Textures = new Map();

function DebugLog(text, bypass) {
    if (DebugLogsEnabled || bypass) {
        var date = new Date();
        var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(`^6(${time}) ^0${text}`);
    }
}

function PrepareImageForThefeedIcon(url, width, height, txn) {
	if (!url || !width || !height) return false;
	if (!txn) txn = "nightclubs_txn"

    var dui = CreateDui(url, width, height);
    var Handle = GetDuiHandle(dui);
    var tx = CreateRuntimeTextureFromDuiHandle(NightclubsTxd, txn, Handle);

	return {
		txd: "script_nightclubs",
		txn: txn,
		txdHandle: NightclubsTxd,
		txnHandle: tx,
		dui: dui,
		duiHandle: Handle
	}
}

PrepareImageForThefeedIcon('https://i.imgur.com/grmNI6m.png', 707, 707, "nightclubs_default");

function SetGarageBlip() {
    GarageBlip = AddBlipForCoord(-1643.954956054, -2989.80908203125, -76.78476189208984);
    SetBlipSprite(GarageBlip, 357);
    SetBlipScale(GarageBlip, 1.2);

    DebugLog(`Added garage exit blip: ${GarageBlip}`);

    return GarageBlip;  
}

function RemoveGarageBlip() {
    RemoveBlip(GarageBlip);
    DebugLog(`Removed garage exit blip: ${GarageBlip}`);
    GarageBlip = null;
    return true;
}

function SetExitBlip() {
    ExitBlip = AddBlipForCoord(-1569.38525390, -3016.544921875, -74.40615844);
    SetBlipSprite(ExitBlip, 364);
    SetBlipScale(ExitBlip, 1);
    SetBlipColour(ExitBlip, 1);

    DebugLog(`Added exit blip: ${ExitBlip}`);

    return ExitBlip;
}

function RemoveExitBlip() {
    RemoveBlip(ExitBlip);
    DebugLog(`Removed exit blip: ${ExitBlip}`);
    ExitBlip = null;
    return true;
}

function SetInclubBlip (Club) {
    CurrentClubBlip = AddBlipForCoord(Club.coords[0], Club.coords[1], Club.coords[2]);
    SetBlipSprite(CurrentClubBlip, 417);
    if (Club.blipColor) SetBlipColour(CurrentClubBlip, Club.blipColor);
    SetBlipScale(CurrentClubBlip, 1.2);
    SetBlipAsShortRange(CurrentClubBlip, true);
    BeginTextCommandSetBlipName("NightclubsBlipName_2");
    AddTextComponentSubstringPlayerName(Club.name);
    EndTextCommandSetBlipName(CurrentClubBlip);

    DebugLog(`Added exterior club blip ${CurrentClubBlip}`);

    return CurrentClubBlip;
}

function RemoveInclubBlip () {
    RemoveBlip(CurrentClubBlip);
    DebugLog(`Removed exterior club blip ${CurrentClubBlip}`);
    CurrentClubBlip = null;
    return true;
}

function SetBlipForClub (clubInfo) {
    if (!clubInfo) return false;

    var Blip = AddBlipForCoord(clubInfo.coords[0], clubInfo.coords[1], clubInfo.coords[2]);
    SetBlipSprite(Blip, clubInfo.blipSprite ? clubInfo.blipSprite : 614);
    if (clubInfo.blipColor) SetBlipColour(Blip, clubInfo.blipColor);
    SetBlipScale(Blip, 1.2);
    SetBlipAsShortRange(Blip, true);
    BeginTextCommandSetBlipName(clubInfo.blipTextLabel ? clubInfo.blipTextLabel : "NightclubsBlipName_1");
    EndTextCommandSetBlipName(Blip);

    ClubBlips.push(Blip);
    DebugLog(`Added blip ${Blip} for club ${clubInfo.name}`);

    return Blip;
}

async function SetClubBlips (Clubs) {
    if (!Clubs) return false;

    Clubs.forEach(async c => {
        SetBlipForClub(c);
        await Wait();
    });

    return true;
}

function RemoveClubBlips () {
    ClubBlips.forEach(async club => {
        RemoveBlip(club);
        DebugLog(`Removing club blip ${club}`);
        await Wait();
    });
    ClubBlips.length = 0;
}

async function StartupLoadingScreen () {
    SwitchOutPlayer(PlayerPedId(), 289263, 2);
    //SwitchOutPlayer(PlayerPedId(), 7373, 2);
    DisplayRadar(false);

    while (!IsPlayerSwitchInProgress()) {
        await Wait(0);
    }

    DebugLog(`Loading screen started`);
    LoadingScreenActive = true;
}

function StopLoadingScreen () {
    StopPlayerSwitch();
    DisplayRadar(true);
    DebugLog(`Loading screen stopped`);
    LoadingScreenActive = false;
}

function IsLoadingScreenActive () {
    return LoadingScreenActive;
}

function ScaleformMouse (EnableRot, RotSpeed) {
	SetMouseCursorActiveThisFrame();
	
	DisableControlAction(0, 24, true); // attack
	DisableControlAction(0, 25, true); // aim
	DisableControlAction(0, 1, true); //camera movement left right
	DisableControlAction(0, 2, true); // camer movement left right
	DisableControlAction(0, 16, true); 
	DisableControlAction(0, 17, true);
	DisableControlAction(0, 257, true);

	if (EnableRot) {
		var CamHeading = GetGameplayCamRelativeHeading();
		var CursorX = GetDisabledControlNormal(0, 239);
		var CursorY = GetDisabledControlNormal(0, 240);
		if (!RotSpeed) RotSpeed = 2;
		if (CursorX <= 0.02) {
			//console.log("rotate left")
			if (MouseSprite !== 6) {
				SetMouseCursorSprite(6);
				MouseSprite = 6;
			}
			CamHeading = CamHeading + RotSpeed;
			DisableControlAction(0, 26);
			SetGameplayCamRelativeHeading(CamHeading);
		} else if (CursorX >= 0.97 && CursorY <= 0.88) {
			//console.log("rotate right")
			if (MouseSprite !== 7) {
				SetMouseCursorSprite(7);
				MouseSprite = 7;
			}
			CamHeading = CamHeading - RotSpeed;
			DisableControlAction(0, 26);
			SetGameplayCamRelativeHeading(CamHeading);
		} else if (MouseSprite !== 0) {
			MouseSprite = 0;
			SetMouseCursorSprite(0);
		}
	}
}

async function Scoreboard (Title, Slots, WaitBeforeAllowingConfirm, ButtonText, EnableMouse) {
	if (!Title) Title = "Title";
	if (!Slots) Slots = [
		{
			Left_Text: "Text1",
			Right_Text: "Text2"
		}
	];
	if (!WaitBeforeAllowingConfirm) WaitBeforeAllowingConfirm = 0;
	if (!ButtonText) ButtonText = "OK";
	if (!EnableMouse && EnableMouse !== false) EnableMouse = false;

	var ScoreBoard = RequestScaleformMovie("MP_ONLINE_LIST_CARD"),
	Button = RequestScaleformMovie('INSTRUCTIONAL_BUTTONS');
    while (!HasScaleformMovieLoaded(ScoreBoard) || !HasScaleformMovieLoaded(Button)) {
        await Wait();
    }

    BeginScaleformMovieMethod(ScoreBoard, "SET_TITLE");
    PushScaleformMovieFunctionParameterString(Title);
    EndScaleformMovieMethod();

	if (typeof(Slots) === 'string') Slots = JSON.parse(Slots);
	console.log(Slots)
	var Index = 0;
	Slots.forEach(async Slot => {
		Index += 1;
		BeginScaleformMovieMethod(ScoreBoard, "ADD_SLOT");
		ScaleformMovieMethodAddParamInt(Index);
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamInt(0); 
		ScaleformMovieMethodAddParamInt(Slot.Right_Text_Background_Banner ? Slot.Right_Text_Background_Banner : 0); // right text background banner color
		ScaleformMovieMethodAddParamInt(0);
		PushScaleformMovieFunctionParameterString(Slot.Left_Text);
			ScaleformMovieMethodAddParamInt(Slot.Rockstar_Icon ? Slot.Rockstar_Icon : 0); // rockstar icon
			ScaleformMovieMethodAddParamInt(Slot.Icon ? Slot.Icon : 0); // icons
		if (Slot.Right_Text) {
			PushScaleformMovieFunctionParameterString(Slot.Right_Text);
		}
		EndScaleformMovieMethod();

		console.log("addign slot")

		await Wait(50);
	});

	(function SetupButton() {
		BeginScaleformMovieMethod(Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
	 
		if (EnableMouse) {
			BeginScaleformMovieMethod(Button, "TOGGLE_MOUSE_BUTTONS");
			ScaleformMovieMethodAddParamBool(true);
			EndScaleformMovieMethod();
		}

		BeginScaleformMovieMethod(Button, "SET_DATA_SLOT");
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamPlayerNameString("~INPUT_FRONTEND_ACCEPT~");
		PushScaleformMovieMethodParameterString(ButtonText);
		if (EnableMouse) {
			ScaleformMovieMethodAddParamBool(EnableMouse);
			ScaleformMovieMethodAddParamInt(201);
		}
		EndScaleformMovieMethod();

		BeginScaleformMovieMethod(Button, "DRAW_INSTRUCTIONAL_BUTTONS")
		EndScaleformMovieMethod()
	})();

	var KeepDisplaying = true;

	function StopDisplaying() {
		PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_MP_SOUNDSET");
		SetScaleformMovieAsNoLongerNeeded(ScoreBoard);
		BeginScaleformMovieMethod(Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
		SetScaleformMovieAsNoLongerNeeded(Button);
		KeepDisplaying = false;
	}

	var StartedDrawing = GetGameTimer();
	while (KeepDisplaying) {
		var CurrentTime = GetGameTimer();

		if (!IsPauseMenuActive()) { 
			DrawScaleformMovie(ScoreBoard, 0.5, 0.5, 0.34, 0.84, 0, 0, 0, 100); 
			DrawScaleformMovieFullscreen(Button, 255, 255, 255, 255, 0);
		}

		if (EnableMouse) {
			ScaleformMouse();
		}

		DisableControlAction(2, 200);

		if (IsControlJustReleased(0, 201) /*[[INPUT_FRONTEND_ACCEPT]]*/ || IsControlJustReleased(0, 202) /*[[INPUT_FRONTEND_CANCEL]]*/ 
		|| IsControlJustReleased(0, 238) /*[[Rightclick]]*/) {
			if ((CurrentTime - StartedDrawing) >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else {
				console.log(CurrentTime - StartedDrawing)
				console.log(WaitBeforeAllowingConfirm)
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}

		await Wait();
	}
}

async function Bigfeed (Title, Subtitle, Body, txd, txn, WaitBeforeAllowingConfirm, ButtonText, MouseEnabled, UseTextLabels, TitleTextComponents, SubtitleTextComponents, BodyTextComponents, WaitForTextureToLoad) {
	if (!WaitBeforeAllowingConfirm) WaitBeforeAllowingConfirm = 0;
	
	var BigFeed = RequestScaleformMovie('GTAV_ONLINE'),
	Button = RequestScaleformMovie('INSTRUCTIONAL_BUTTONS');

	while (!HasScaleformMovieLoaded(BigFeed) || !HasScaleformMovieLoaded(Button)) {
		await Wait(30);
	}

	BeginScaleformMovieMethod(BigFeed, "HIDE_ONLINE_LOGO");
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(BigFeed, "SETUP_BIGFEED");
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(BigFeed, "SET_BIGFEED_INFO");
	ScaleformMovieMethodAddParamPlayerNameString(''); // footerStr, useless
	if (UseTextLabels) { //bodyStr
		BeginTextCommandScaleformString(Body);
		AddTextComponentsFromArray(BodyTextComponents);
		EndTextCommandScaleformString();
	} else {
		ScaleformMovieMethodAddParamPlayerNameString(Body);
	}
	ScaleformMovieMethodAddParamInt(0); // whichTab, useless
	ScaleformMovieMethodAddParamPlayerNameString(""); //txd
	ScaleformMovieMethodAddParamPlayerNameString(""); //txn
	if (UseTextLabels) { //subtitle
		BeginTextCommandScaleformString(Subtitle);
		AddTextComponentsFromArray(SubtitleTextComponents);
		EndTextCommandScaleformString();
	} else {
		ScaleformMovieMethodAddParamPlayerNameString(Subtitle);
	}
	ScaleformMovieMethodAddParamInt(0); // urlDeprecated
	if (UseTextLabels) { //title
		BeginTextCommandScaleformString(Title);
		AddTextComponentsFromArray(TitleTextComponents);
		EndTextCommandScaleformString();
	} else {
		ScaleformMovieMethodAddParamPlayerNameString(Title);
	}	
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(BigFeed, "FADE_IN_BIGFEED");
	EndScaleformMovieMethod();

	if (txd && txn) {
		RequestStreamedTextureDict(txd);
		var TicksWaiting = 0;
		while (!HasStreamedTextureDictLoaded(txd)) {
			TicksWaiting += 1;
			if (TicksWaiting >= 500) {
				console.log(`^1Texture dict ${txd} didn't load in time...`);
				break;
			}
			await Wait();
		}
		BeginScaleformMovieMethod(BigFeed, "SET_BIGFEED_IMAGE");
		ScaleformMovieMethodAddParamPlayerNameString(txd);
		DebugLog(`SET_BIGFEED_IMAGE: Passed txd ${txd}`);
		ScaleformMovieMethodAddParamPlayerNameString(txn);
		DebugLog(`SET_BIGFEED_IMAGE: Passed txn ${txn}`);
		EndScaleformMovieMethod();
	}

	///////////////////////////

	BeginScaleformMovieMethod(Button, "CLEAR_ALL");
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(Button, "SET_DATA_SLOT");
	ScaleformMovieMethodAddParamInt(0); // Position
	ScaleformMovieMethodAddParamPlayerNameString("~INPUT_FRONTEND_ACCEPT~");
	ScaleformMovieMethodAddParamPlayerNameString(ButtonText ? ButtonText : "OK");
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(Button, "DRAW_INSTRUCTIONAL_BUTTONS");
	EndScaleformMovieMethod();

	var KeepDisplaying = true;
	function StopDisplaying () {
		KeepDisplaying = false;
		SetScaleformMovieAsNoLongerNeeded(Button);
		SetScaleformMovieAsNoLongerNeeded(BigFeed);
		SetStreamedTextureDictAsNoLongerNeeded(txd);
		PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_MP_SOUNDSET");
	}

	var StartedDrawing = GetGameTimer();
	while (KeepDisplaying) {
		var CurrentTime = GetGameTimer();

		if (MouseEnabled) ScaleformMouse();

		DrawScaleformMovieFullscreen(Button, 255, 255, 255, 255, 0);
		DrawScaleformMovieFullscreen(BigFeed, 255, 255, 255, 255, 0);
		DisableControlAction(2, 200);

		HideHudAndRadarThisFrame();

		if (IsControlJustReleased(0, 201) /*[[INPUT_FRONTEND_ACCEPT]]*/ || IsControlJustReleased(0, 202) /*[[INPUT_FRONTEND_CANCEL]]*/ 
		|| IsControlJustReleased(0, 238) /*[[Rightclick]]*/ || IsControlJustReleased(0, 237) /*Leftclick*/ ) {
			if (CurrentTime - StartedDrawing >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else  {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}		

		await Wait();
	}
}

async function WarningMessage(HeaderTextLabel, BodyTextLabel, Background) {
	if (!BodyTextLabel) BodyTextLabel = 'NightclubsServerTakingTooLongWarningMessageBody';
	DebugLog(`HeaderTextLabel=${HeaderTextLabel}`);
	DebugLog(`BodyTextLabel=${BodyTextLabel}`);
	DebugLog(`Background=${Background}`);

	var KeepLoop = true;
	while (KeepLoop) {
		if (Background) SetWarningMessageWithHeader(HeaderTextLabel, BodyTextLabel, 2) 
		else SetWarningMessageWithHeader(HeaderTextLabel, BodyTextLabel, 2, '', true, true, 0, true);

		if (IsControlJustReleased(2, 201)) KeepLoop = false

		await Wait();
	}
}

async function InviteNotification(PlayerInfo, ClubInfo, InviteId) {
	DebugLog(PlayerInfo);
	if (typeof(PlayerInfo) === 'string') PlayerInfo = JSON.parse(PlayerInfo);
	if (typeof(ClubInfo) === 'string') ClubInfo = JSON.parse(ClubInfo);
	var ped = NetToPed(PlayerInfo.ped);
	DebugLog(`ped=${ped}`);
	var txd, txn = null;
	if (DoesEntityExist(ped)) {
		var handle = RegisterPedheadshot(ped);
		var ticks = 0;
		while (!IsPedheadshotReady(handle)) {
			ticks += 1;
			if (ticks >= 500) {
				console.log(`Ped headshot didn't load in time`);
				break;
			}
			await Wait(0);
		}

		var TxdString = GetPedheadshotTxdString(handle);
		txd = TxdString;
		txn = TxdString;
	} else {
		txd = "CHAR_SOCIAL_CLUB"
		txn = "CHAR_SOCIAL_CLUB"
	}

	//ThefeedNextPostBackgroundColor(21);
	BeginTextCommandThefeedPost('NightclubsInviteReceived');
	AddTextComponentSubstringPlayerName(String(InviteId));
	EndTextCommandThefeedPostMessagetext(txd, txn, true, 2, PlayerInfo.name, ClubInfo.name);
}

onNet('Nightclubs:Bigfeed', Bigfeed);
onNet("Nightclubs:Scoreboard", Scoreboard);
onNet("Nightclubs:WarningMessage", WarningMessage);
onNet("Nightclubs:InviteNotification", InviteNotification);

RegisterCommand('nightclubs::bigfeeddebug', () => Bigfeed());
RegisterCommand('nightclubs::scoreboarddebug', () => Scoreboard());
RegisterCommand('nightclubs::warningmessagedebug', () => WarningMessage())
