AddTextEntry("Nightclubs", "Nightclubs");
AddTextEntry("NightclubsInformation", "Information");
AddTextEntry("NightclubsBlipName_1", "Nightclub");
AddTextEntry("NightclubsBlipName_2", "Current nightclub (~a~)");
AddTextEntry("NightclubsNearbyClubHelpText", "...");
AddTextEntry("NightclubsNearbyClubExitHelpText", "...");
AddTextEntry("NightclubsServerTakingTooLongWarningMessageBody", "The server is taking too long to respond... would you like to try again?");
AddTextEntry("NightclubsWelcomeFeedPost", "Enjoy your stay!");
AddTextEntry("NightclubsOutOfInterior", "You have been removed from the nightclub automatically because you left the interior's bounds. Feel free to re-enter from the exterior.");
AddTextEntry("NightclubsToggled", "Clubs are now ~a~. Type ~p~/clubs toggle ~w~to undo.");
AddTextEntry("NightclubsInviteReceived", "You have been invited to a Nightclub. Type ~h~/club accept ~a~~h~ to accept this invite. Type ~h~/club invites~h~ to view all invites.");
AddTextEntry("NightclubsErrorUnavailable", "This action is currently unavailable. Try again later.");
AddTextEntry("NightclubsHostTransferred", "Host transferred");
AddTextEntry("NightclubsSessionHostTransferred", "You have been set as the session host of this nightclub. Use ~p~/clubhost help ~w~to view all the commands that are available to you.");
AddTextEntry("NightclubsKicked", "You have been kicked from the nightclub by its current host.");
AddTextEntry("NightclubsVehicleDeleted", "Your vehicle has been deleted.");
AddTextEntry("NightclubsHelpBody", `Nightclubs are located all over Los Santos. `+
`You can easily find them by checking your Pause Menu map. Once you're near a Club, go inside one of its markers and press ~h~[E]~h~ to enter.`+
`\nThere are various commands you can use:\n`+
`~p~/club list ~w~- View all nightclubs\n`+
`~p~/club tp [name] ~w~- Teleport to a nightclub\n`+
`~p~/club toggle ~w~- Enable or disable nightclubs (Only works for you)\n`+
`~p~/club exit ~w~- Exit your current nightclub\n`+
`~p~/club info ~w~- View your current nightclub's description\n`+
`~p~/club invites ~w~- View club invites you have received\n`+
`~p~/club invite [player name] ~w~- Invite a player to your nightclub\n`+
`~p~/club accept [invite id] ~w~- Accept an invite`+
`\nHave fun!`);
AddTextEntry("NightclubsHelpBody_Host", `~p~/clubhost set [player name] ~w~- Make someone else a host (removes your privileges)\n`+
`~p~/clubhost kick [player name] ~w~- Kick someone from the nightclub\n`+
`~p~/clubhost lights ~w~- Toggle lights inside the nightclub\n`+
`~p~/clubhost notify [message] ~w~- Send everyone inside club a message\n`+
`~p~/clubhost help ~w~- Shows this screen\n`+
`~HUD_COLOUR_GREY~Note: Leaving the nightclub will remove you as the host and choose someone else.`);

var MyName = GetCurrentResourceName();
var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : DrawTickRate));
var ClubBlips = [];
var InteriorBlips = []
var DrawTickRate = 3;
var LoadingScreenActive = false;
var DebugLogsEnabled = true;
var CurrentClubBlip = null;
var ClubsDefaultBlipColour = 0;
var ClubsDefaultBlipScale = 1;
var ExitBlip = null;
var GarageBlip = null;
var NightclubsTxd = CreateRuntimeTxd('script_nightclubs');
var ArtificialLightsState = false;

function DebugLog(text, bypass) {
    if (DebugLogsEnabled || bypass) {
        var date = new Date();
        var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        console.log(`^6(${time}) ${MyName} debug: ^0${text}`);
    }
}

function SetBlipAsInterior (blip) {
	if (!blip) return false;
	InteriorBlips.push(blip);
	DebugLog(`SetBlipAsInterior: Blip ${blip} has been set as an interior blip.`);
	return blip;
}

function ClearInteriorBlips() {
	DebugLog(`ClearInteriorBlips: Clearing ${InteriorBlips.length} interior blips`);
	InteriorBlips.length = 0;
	return true;
}

function IsInteriorBlip(blip) {
	return (InteriorBlips.includes(blip) ? true : false);
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

function SetGarageBlip() {
    GarageBlip = AddBlipForCoord(-1643.954956054, -2989.80908203125, -76.78476189208984);
    SetBlipSprite(GarageBlip, 357);
    SetBlipScale(GarageBlip, 1.2);
	SetBlipAsInterior(GarageBlip);

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
	SetBlipAsInterior(ExitBlip);

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
    SetBlipColour(Blip, clubInfo.blipColor || ClubsDefaultBlipColour);
    SetBlipScale(Blip, ClubsDefaultBlipScale);
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
	SetPlayerControl(PlayerId(), false);

    while (!IsPlayerSwitchInProgress()) {
        await Wait(0);
    }

    DebugLog(`Loading screen started`);
    LoadingScreenActive = true;

	while (LoadingScreenActive) {
		SetMouseCursorActiveThisFrame();
		/*DisableControlAction(0, 24, true); // attack
		DisableControlAction(0, 25, true); // aim
		DisableControlAction(0, 1, true); // camera movement left right
		DisableControlAction(0, 2, true); // camera movement left right
		DisableControlAction(0, 257, true); // attack2*/

		await Wait(0);
	}
}

function StopLoadingScreen () {
    StopPlayerSwitch();
    DisplayRadar(true);
	SetPlayerControl(PlayerId(), true);
    DebugLog(`Loading screen stopped`);
    LoadingScreenActive = false;
}

function IsLoadingScreenActive () {
    return LoadingScreenActive;
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

function ScaleformMouse (EnableRot = false, RotSpeed = 2) {
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

async function AddTextComponentsFromArray (Arr) {
	if (typeof(Arr) === 'string') {
		AddTextComponentSubstringPlayerName(Arr);
	} else if (typeof(Arr) === 'object') {
		Arr.forEach(async component => {
			switch (typeof component) {
				case 'string':
					AddTextComponentSubstringPlayerName(component);
				break;
				case 'number':
					if (NumberIsInt(component)) {
						AddTextComponentInteger(component);
					} else if (NumberIsFloat) {
						AddTextComponentFloat(component);
					}
				break;
			}
			await Wait(10);
		});
	}
}

async function PopupMessage (Header = 'alert', BodyText1 = '...', BodyText2 = '...', WaitBeforeAllowingConfirm = 0, ButtonText = GetLabelText('IB_OK'), EnableMouse = true, UseTextEntries = false, HeaderTextComponents, BodyTextComponents, BodyText2Components) {
	var Popup_Body = RequestScaleformMovie("POPUP_WARNING"),
	Popup_Button = RequestScaleformMovie("INSTRUCTIONAL_BUTTONS");
	while (!HasScaleformMovieLoaded(Popup_Body) || !HasScaleformMovieLoaded(Popup_Button)) { 
		await Wait(100); 
	}
 
	DebugLog(`Popup_Body=${Popup_Body} Popup_Button=${Popup_Button}`);

	(function SetupBody () {
		BeginScaleformMovieMethod(Popup_Body, "SHOW_POPUP_WARNING");
		ScaleformMovieMethodAddParamFloat(500.0);
		if (UseTextEntries) {
			BeginTextCommandScaleformString(Header);
			AddTextComponentsFromArray(HeaderTextComponents);
			EndTextCommandScaleformString();
			BeginTextCommandScaleformString(BodyText1);
			AddTextComponentsFromArray(BodyTextComponents);
			EndTextCommandScaleformString();
			BeginTextCommandScaleformString(BodyText2);
			AddTextComponentsFromArray(BodyText2Components);
			EndTextCommandScaleformString();
		} else { 
			ScaleformMovieMethodAddParamPlayerNameString(Header);
			ScaleformMovieMethodAddParamPlayerNameString(BodyText1);
			ScaleformMovieMethodAddParamPlayerNameString(BodyText2);
		}
		EndScaleformMovieMethod();
	})();
 
	(function SetupButton () {
		BeginScaleformMovieMethod(Popup_Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
 
		BeginScaleformMovieMethod(Popup_Button, "SET_DATA_SLOT");
		ScaleformMovieMethodAddParamInt(0); // Position
		ScaleformMovieMethodAddParamPlayerNameString("~INPUT_FRONTEND_ACCEPT~");
		ScaleformMovieMethodAddParamPlayerNameString(ButtonText);
		EndScaleformMovieMethod();
 
		BeginScaleformMovieMethod(Popup_Button, "DRAW_INSTRUCTIONAL_BUTTONS");
		EndScaleformMovieMethod();
	})();
 
 
	var KeepDisplaying = true;
	function StopDisplaying () {
		KeepDisplaying = false;
		SetScaleformMovieAsNoLongerNeeded(Popup_Body);
		BeginScaleformMovieMethod(Popup_Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
		SetScaleformMovieAsNoLongerNeeded(Popup_Button);
		PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_MP_SOUNDSET");
	}
 

	var DisplayingSince = Date.now()
	while (KeepDisplaying) {
		var CurrentTime = Date.now()

		DrawScaleformMovieFullscreen(Popup_Body, 255, 255, 255, 255, 0)
		DrawScaleformMovieFullscreen(Popup_Button, 255, 255, 255, 255, 0)
 
		HideHudAndRadarThisFrame();
		DisableControlAction(2, 200);
 
		if (EnableMouse) ScaleformMouse();

		if (IsControlJustReleased(2, 201) || IsControlJustReleased(2, 202) || IsControlJustReleased(2, 238) || IsControlJustReleased(2, 237)) {
			if (CurrentTime - DisplayingSince >= WaitBeforeAllowingConfirm) {
				StopDisplaying();
			} else  {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}

		await Wait();
	}
}

async function Scoreboard (Title = 'title', Slots = [{},{}], WaitBeforeAllowingConfirm = 0, ButtonText = 'OK', EnableMouse = true) {
	var ScoreBoard = RequestScaleformMovie("MP_ONLINE_LIST_CARD"),
	Button = RequestScaleformMovie('INSTRUCTIONAL_BUTTONS');
    while (!HasScaleformMovieLoaded(ScoreBoard) || !HasScaleformMovieLoaded(Button)) {
        await Wait();
    }

    BeginScaleformMovieMethod(ScoreBoard, "SET_TITLE");
    PushScaleformMovieFunctionParameterString(Title);
    EndScaleformMovieMethod();

	if (typeof(Slots) === 'string') Slots = JSON.parse(Slots);

	var Index = 0;
	Slots.forEach(async Slot => {
		Index += 1;
		BeginScaleformMovieMethod(ScoreBoard, "ADD_SLOT");
		ScaleformMovieMethodAddParamInt(Index);
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamInt(0); 
		ScaleformMovieMethodAddParamInt(Slot.Right_Text_Background_Banner || 0); // right text background banner color
		ScaleformMovieMethodAddParamInt(0);
		PushScaleformMovieFunctionParameterString(Slot.Left_Text || "");
		ScaleformMovieMethodAddParamInt(Slot.Rockstar_Icon || 0); // rockstar icon
		ScaleformMovieMethodAddParamInt(Slot.Icon || 0); // icons
		PushScaleformMovieFunctionParameterString(Slot.Right_Text || "");
		EndScaleformMovieMethod();

		await Wait(50);
	});

	(function SetupButton() {
		BeginScaleformMovieMethod(Button, "CLEAR_ALL");
		EndScaleformMovieMethod();

		BeginScaleformMovieMethod(Button, "SET_DATA_SLOT");
		ScaleformMovieMethodAddParamInt(0);
		ScaleformMovieMethodAddParamPlayerNameString("~INPUT_FRONTEND_ACCEPT~");
		PushScaleformMovieMethodParameterString(ButtonText);
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

	var StartedDrawing = Date.now();
	while (KeepDisplaying) {
		var CurrentTime = Date.now();

		DrawScaleformMovie(ScoreBoard, 0.5, 0.5, 0.34, 0.84, 0, 0, 0, 100); 
		DrawScaleformMovieFullscreen(Button, 255, 255, 255, 255, 0);

		if (EnableMouse) {
			ScaleformMouse();
		}

		DisableControlAction(2, 200);

		if (IsControlJustReleased(2, 201) || IsControlJustReleased(2, 202) || IsControlJustReleased(2, 238) || IsControlJustReleased(2, 237)) {
			if ((CurrentTime - StartedDrawing) >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}

		await Wait();
	}
}

async function Bigfeed (Title = ' ', Subtitle = '', Body = '', txd, txn, WaitBeforeAllowingConfirm = 0, ButtonText = 'OK', MouseEnabled = true, UseTextLabels, TitleTextComponents, SubtitleTextComponents, BodyTextComponents) {
	var BigFeed = RequestScaleformMovie('GTAV_ONLINE'),
	Button = RequestScaleformMovie('INSTRUCTIONAL_BUTTONS');

	while (!HasScaleformMovieLoaded(BigFeed) || !HasScaleformMovieLoaded(Button)) {
		await Wait(30);
	}

	BeginScaleformMovieMethod(BigFeed, "SETUP_BIGFEED");
	ScaleformMovieMethodAddParamBool(false);
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
	ScaleformMovieMethodAddParamInt(0); // whichTab
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

	BeginScaleformMovieMethod(BigFeed, "HIDE_ONLINE_LOGO");
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
	ScaleformMovieMethodAddParamPlayerNameString(ButtonText);
	EndScaleformMovieMethod();

	BeginScaleformMovieMethod(Button, "DRAW_INSTRUCTIONAL_BUTTONS");
	EndScaleformMovieMethod();

	var KeepDisplaying = true;
	function StopDisplaying () {
		KeepDisplaying = false;
		BeginScaleformMovieMethod(Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
		SetScaleformMovieAsNoLongerNeeded(Button);
		SetScaleformMovieAsNoLongerNeeded(BigFeed);
		SetStreamedTextureDictAsNoLongerNeeded(txd);
		PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_MP_SOUNDSET");
	}

	var StartedDrawing = Date.now();
	while (KeepDisplaying) {
		var CurrentTime = Date.now();

		if (MouseEnabled) ScaleformMouse();

		DrawScaleformMovieFullscreen(Button, 255, 255, 255, 255, 0);
		DrawScaleformMovieFullscreen(BigFeed, 255, 255, 255, 255, 0);

		DisableControlAction(2, 200);
		HideHudAndRadarThisFrame();

		if (IsControlJustReleased(0, 201) || IsControlJustReleased(0, 202) || IsControlJustReleased(0, 238) || IsControlJustReleased(0, 237)) {
			if (CurrentTime - StartedDrawing >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else  {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}		

		await Wait();
	}
}

var Scoreboard_2_DefaultTitles = ['title1', 'title2', 'title3', 'title4', 'title5', 'title6', 'title7', 'title8'];
var Scoreboard_2_DefaultSlots = [
	{
		type: 1,
		text1: 'slot1',
		text2: 'slot2',
		text3: 'slot3',
		text4: 'slot4',
		text5: 'slot5',
		text6: 'slot6',
		text7: 'slot7',
		text8: 'slot8',
		text9: 'slot9',
		text10: 'slot10'
	},
	{
		type: 0,
		text1: '4',
		text2: 'iii',
		text3: '{*%NE',
		text4: 'slot4',
		text5: 'slot5',
		text6: 'slot6',
		text7: 'slot7',
		text8: 'slot8',
		text9: 'slot9',
		text10: 'slot10'
	},
	{
		type: 10,
		text1: '4',
		text2: 'iii',
		text3: '{*%NE',
		text4: 'slot4',
		text5: 'slot5',
		text6: 'slot6',
		text7: 'slot7',
		text8: 'slot8',
		text9: 'slot9',
		text10: 'slot10'
	}
];
Scoreboard_2_DefaultButtons = [
	{
		button: "~INPUT_FRONTEND_ACCEPT~",
		text: GetLabelText('IB_OK')
	},
	{
		button: "~INPUT_FRONTEND_CANCEL~",
		text: GetLabelText('IB_BACK')
	}
];
async function Scoreboard_2(Header = '', Titles = Scoreboard_2_DefaultTitles, Slots = Scoreboard_2_DefaultSlots, WaitBeforeAllowingConfirm = 0, Buttons = Scoreboard_2_DefaultButtons, EnableMouse = true) {
	var Button = RequestScaleformMovie("INSTRUCTIONAL_BUTTONS");
	var Scaleform = RequestScaleformMovie('SC_LEADERBOARD');
	while (!HasScaleformMovieLoaded(Button) || !HasScaleformMovieLoaded(Scaleform)) {
		await Wait();
	}

	(function SetupButton () {
		BeginScaleformMovieMethod(Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
 
		var ButtonIndex = -1;
		Buttons.forEach(async button => {
			ButtonIndex += 1;
			BeginScaleformMovieMethod(Button, "SET_DATA_SLOT");
			ScaleformMovieMethodAddParamInt(ButtonIndex); // Position
			ScaleformMovieMethodAddParamPlayerNameString(button.button);
			ScaleformMovieMethodAddParamPlayerNameString(button.text);
			EndScaleformMovieMethod();

			await Wait(0);
		});
 
		BeginScaleformMovieMethod(Button, "DRAW_INSTRUCTIONAL_BUTTONS");
		EndScaleformMovieMethod();
	})();
 
	BeginScaleformMovieMethod(Scaleform, "SET_DISPLAY_TYPE");
	EndScaleformMovieMethod();	
 
	BeginScaleformMovieMethod(Scaleform, "SET_MULTIPLAYER_TITLE");
	ScaleformMovieMethodAddParamPlayerNameString(Header);
	EndScaleformMovieMethod();
 
	BeginScaleformMovieMethod(Scaleform, "SET_TITLE");
	Titles.forEach(async title => {
		ScaleformMovieMethodAddParamPlayerNameString(title);
		await Wait(0);
	});
	EndScaleformMovieMethod();
 
	var Index = -1;
	Slots.forEach(async slot => {
		Index += 1;
		
		BeginScaleformMovieMethod(Scaleform, "SET_SLOT");
		ScaleformMovieMethodAddParamInt(Index);
		ScaleformMovieMethodAddParamInt(slot.type || 0);
		ScaleformMovieMethodAddParamPlayerNameString(slot.text1 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text2 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text3 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text4 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text5 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text6 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text7 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text8 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text9 || "");
		ScaleformMovieMethodAddParamPlayerNameString(slot.text10 || "");
		EndScaleformMovieMethod();

		await Wait(0);
	});
 
	var KeepDisplaying = true;
	var StartedDrawing = Date.now()
	while (KeepDisplaying) {
		var CurrentTime = Date.now();

		DrawScaleformMovieFullscreen(Button, 255, 255, 255, 255, 0);
		DrawScaleformMovieFullscreen(Scaleform, 255, 255, 255, 255, 0);
 
		DisableControlAction(2, 200);
 
		if (EnableMouse) ScaleformMouse();
 
		if (IsControlJustReleased(2, 201) || IsControlJustReleased(2, 202) || IsControlJustReleased(0, 238) || IsControlJustReleased(0, 237)) {
			if (CurrentTime - StartedDrawing >= WaitBeforeAllowingConfirm) {
				KeepDisplaying = false;
				BeginScaleformMovieMethod(Button, "CLEAR_ALL");
				EndScaleformMovieMethod();
				SetScaleformMovieAsNoLongerNeeded(Button);
				SetScaleformMovieAsNoLongerNeeded(Scaleform);
				PlaySoundFrontend(-1, 'BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
			} else {
				PlaySoundFrontend(-1, 'ERROR', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
			}
		}
 
		await Wait();
	}
}

async function WarningMessage(HeaderTextLabel, BodyTextLabel = 'NightclubsServerTakingTooLongWarningMessageBody', MsLock = 0, Background) {
	DebugLog(`HeaderTextLabel=${HeaderTextLabel}`);
	DebugLog(`BodyTextLabel=${BodyTextLabel}`);
	DebugLog(`MsLock=${MsLock}`);
	DebugLog(`Background=${Background}`);

	var KeepLoop = true;
	var StartedAt = Date.now();
	while (KeepLoop) {
		if (Background) SetWarningMessageWithHeader(HeaderTextLabel, BodyTextLabel, 2) 
		else SetWarningMessageWithHeader(HeaderTextLabel, BodyTextLabel, 2, '', true, true, 0, true);

		if ((IsControlJustReleased(2, 201) || IsControlJustReleased(2, 238)) && (Date.now() - StartedAt >= MsLock)) {
			KeepLoop = false;
		}

		await Wait();
	}
}

function BasicThefeedPost(text, bgColor) {
	if (bgColor) ThefeedNextPostBackgroundColor(bgColor);
	BeginTextCommandThefeedPost(`STRING`);
	AddTextComponentsFromArray(text);
	EndTextCommandThefeedPostTicker(true, true);
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
		txd = GetClubTxd(ClubInfo.id);
		txn = "club_ext"
	}

	RequestStreamedTextureDict(txd);
	var ticks = 0;
	while (!HasStreamedTextureDictLoaded(txd) && ticks < 300) {
		ticks += 1;
		await Wait(0);
	}

	BeginTextCommandThefeedPost('NightclubsInviteReceived');
	AddTextComponentSubstringPlayerName(String(InviteId));
	EndTextCommandThefeedPostMessagetext(txd, txn, true, 2, PlayerInfo.name, ClubInfo.name);
	if (txn === 'club_ext') SetStreamedTextureDictAsNoLongerNeeded(txd);
}

onNet('Nightclubs:Bigfeed', Bigfeed);
onNet("Nightclubs:Scoreboard", Scoreboard);
onNet("Nightclubs:Scoreboard_2", Scoreboard_2);
onNet("Nightclubs:WarningMessage", WarningMessage);
onNet("Nightclubs:InviteNotification", InviteNotification);
onNet('Nightclubs:BasicThefeedPost', BasicThefeedPost);
onNet('Nightclubs:PopupMessage', PopupMessage);
onNet('Nightclubs:ToggleLights', toggle => {
	SetArtificialLightsState(toggle);
	ArtificialLightsState = toggle;
	DebugLog(`Nightclubs:ToggleLights: SetArtificialLightsState(${toggle})`);
	DebugLog(`Nightclubs:ToggleLights:ArtificialLightsState = ${toggle}`);
});

RegisterCommand('nightclubs::bigfeeddebug', () => Bigfeed());
RegisterCommand('nightclubs::scoreboard_2debug', () => Scoreboard_2())
RegisterCommand('nightclubs::scoreboarddebug', () => Scoreboard());
RegisterCommand('nightclubs::warningmessagedebug', () => WarningMessage());
RegisterCommand('nightclubs::popupmessagedebug', () => PopupMessage());
