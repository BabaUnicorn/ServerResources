//AddTextEntry("HuntingAnimalKilled", "You have killed a <C>~a~</C>");
//AddTextEntry("HuntingDeadAnimalBlipName", "Killed animal");
//AddTextEntry("HuntingMatchOnStartTip", "Press ~INPUT_MULTIPLAYER_INFO~ to view hunt information.\nType ~b~/hunting stop ~w~in chat to end the hunting game.");
//AddTextEntry("HuntingOnStartupHelpText", "Hunting zones are now available. Go to spots marked with ~BLIP_141~ on your minimap and press ~INPUT_CONTEXT~ to start hunting.");
//AddTextEntry("HuntingEnabledHelpText", "You have enabled the hunting minigame. To start hunting, go to zones marked with ~g~~BLIP_141~ ~w~on your minimap and press ~INPUT_CONTEXT~ while the notification is onscreen.");
//AddTextEntry("HuntingTimeout2FeedPost", "NO ZONES RECEIVED IN TIME. RETRYING SOON");
//AddTextEntry("HuntingTimeoutWarningMessageHeader", "~r~alert");
AddTextEntry("Hunting", "Hunting");
AddTextEntry("HuntingError", "Error");
AddTextEntry("HuntingBlipName_1", "Hunting zone");
AddTextEntry("HuntingBlipName_2", "Sea hunting zone");
AddTextEntry("HuntingBlipName_3", "Animal");
AddTextEntry("HuntingNearbyZone", "~b~Press ... to start hunting in this zone.");
AddTextEntry("HuntingInsideZone", "You are inside the hunting zone <C>~a~</C>.");
AddTextEntry("HuntingJoiningSpinner", "Joining");
AddTextEntry("HuntingJoiningSpinner_2", "Waiting for network");
AddTextEntry("HuntingRequestingZonesSpinner", "Downloading");
AddTextEntry("HuntingJoiningTimeout", "No response received from the server in time. Try again later?");
AddTextEntry("HuntingJoiningRejected", "Could not join the hunting minigame - Joining rejected by server.");
AddTextEntry("HuntingJoiningAcceptedHeader", "~g~Hunt started");
AddTextEntry("HuntingJoiningAcceptedMsgText", "You are hunting in ~g~~a~~w~.");
AddTextEntry("HuntingJoiningAcceptedHelptext", "Press ~INPUT_MULTIPLAYER_INFO~ to view hunt progress. "+
"Type ~b~/hunting stop ~w~in chat to stop hunting.");
AddTextEntry("HuntingOngoingHuntStopped", "You have stopped hunting. ~a~");
AddTextEntry("HuntingEndedHeader", "<font face='$Font2_cond'>Hunt ended</font>");
AddTextEntry("HuntingEndedHeader_FAIL", "<font face='$Font2_cond'>Hunt failed</font>");
AddTextEntry("HuntingEndedBodyNoKills", "You killed no animals in ~a~.");
AddTextEntry("HuntingEndedBodyPlayerDied", "You died while hunting. You earned $0");
AddTextEntry("HuntingEndedBodyWithKills", "You killed ~b~~a~ ~w~animals in ~a~.~n~You earned: ~g~$~a~."+
"~n~~w~<i>Type ~b~/hunting last ~w~to view your last hunt's information.</i>");
AddTextEntry("HuntingCommandError", "~r~<C>Command error</C>: ~w~~a~");
AddTextEntry("HuntingEnabledFeedPost", "Hunting zones are now ~g~enabled~w~.");
AddTextEntry("HuntingDisabledFeedPost", "Hunting zones are now ~r~disabled~w~.");
AddTextEntry("HuntingKillFeedPost", `<C>~a~</C> killed a <C>~a~</C>. ~a~`);
AddTextEntry("HuntingDebugFeedPost", "~a~");
AddTextEntry("HuntingTimeoutWarningMessageBody", "Didn't receive a response from server in time. Try again?");
AddTextEntry("HuntingMeleeKillBonusFeedPost", "You have received a bonus of $~a~ for hunting with a melee weapon!");
AddTextEntry("HuntingStealthKillBonusFeedPost", "You have received a bonus of $~a~ for killing with stealth!");
AddTextEntry("HuntingRandomBonusFeedPost", "You have received a random bonus of $~a~!");
AddTextEntry("HuntingInfoPopupBody", `The goal of this minigame is to kill animals inside predefined hunting zones.\n\n`+
`You can view hunting zones by typing ~b~/hunting zones~w~ in chat.\n\n`+
`By default, hunting zones are disabled, but you can enable them by typing ~b~/hunting toggle~w~ in chat. `+
`Once you're inside the desired zone's radius, you will be prompted by a notification on the top left corner of your screen telling you to press ~h~[E]~h~ to start hunting.\n\n`+
`You can view your hunt's progress by pressing ~h~[Z]~h~.\nIf you believe you got enough kills, type ~b~/hunting stop~w~ to stop hunting and get paid.\n\n`+
`~h~AVAILABLE COMMANDS~h~\n`+
`~g~/hunting zones ~w~- View zones you can hunt in.\n~g~/hunting players ~w~- Shows all the players that are hunting in this zone.\n`+
`~g~/hunting stop ~w~- Stop hunting inside your current zone.\n`+
`~g~/hunting toggle ~w~- Toggle the minigame.\n`+
`~g~/hunting info ~w~- Shows this message.\n`+
`~g~/hunting last ~w~- Shows last hunt info.\n\n`+
`Enjoy!`);

var DrawTickRate = 2;
var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : DrawTickRate));
var DebugLogsEnabled = false;
var HudColorAutoUpdateEnabled = true;
var SpinnerRotation = 0;
var MouseSprite = 0;
var CurrentShard = null;

function DebugLog (text, usenotifs) {
	if (!text || !DebugLogsEnabled) return false;
	var date = new Date();
	var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
	console.log(`^4(${time}) Hunting debug: ^0${text}`);
	if (usenotifs) {
		BeginTextCommandThefeedPost("HuntingDebugFeedPost");
		AddTextComponentSubstringPlayerName(`~b~<font face='$Font2_cond' size='20'>(${time}) Hunting debug:</font> ~h~~w~${text}`);
		EndTextCommandThefeedPostTicker(true, true);
	}
	return true;
}

function NumberIsFloat(n){
	return Number(n) === n && n % 1 !== 0;
}

function NumberIsInt(n){
    return Number(n) === n && n % 1 === 0;
}

async function AddTextComponentsFromArray (Arr) {
	if (typeof(Arr) === 'string') {
		AddTextComponentSubstringPlayerName(Arr);
	} else if (typeof(Arr) === 'object' && Arr.length) {
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

async function PopupMessage (Header, BodyText1, BodyText2, WaitBeforeAllowingConfirm, ButtonText, EnableMouse, UseTextEntries, HeaderTextComponents, BodyTextComponents, BodyText2Components) {
	if (!Header) Header = "header";
	if (!BodyText1) BodyText1 = "body" ;
	if (!BodyText2) BodyText2 = "body2";
	if (!WaitBeforeAllowingConfirm) WaitBeforeAllowingConfirm = 0;
	if (!ButtonText) ButtonText = "OK";
	if (!EnableMouse && EnableMouse !== false) EnableMouse = false;
	if (!UseTextEntries && UseTextEntries !== false) UseTextEntries = false;
 
	var KeepDisplaying = true;
 
	var Popup_Body = RequestScaleformMovie("POPUP_WARNING"),
	Popup_Button = RequestScaleformMovie("INSTRUCTIONAL_BUTTONS");
	while (!HasScaleformMovieLoaded(Popup_Body) || !HasScaleformMovieLoaded(Popup_Button)) { 
		await Wait(100); 
	}
 
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
 
		if (EnableMouse) {
			BeginScaleformMovieMethod(Popup_Button, "TOGGLE_MOUSE_BUTTONS");
			ScaleformMovieMethodAddParamBool(true);
			EndScaleformMovieMethod();
		}
 
		BeginScaleformMovieMethod(Popup_Button, "SET_DATA_SLOT");
		ScaleformMovieMethodAddParamInt(0); // Position
		ScaleformMovieMethodAddParamPlayerNameString("~INPUT_FRONTEND_ACCEPT~");
		ScaleformMovieMethodAddParamPlayerNameString(ButtonText);
		if (EnableMouse) {
			ScaleformMovieMethodAddParamBool(true);
			ScaleformMovieMethodAddParamInt(201); // what control will be pressed when you click the button
		}
		EndScaleformMovieMethod();
 
		BeginScaleformMovieMethod(Popup_Button, "DRAW_INSTRUCTIONAL_BUTTONS");
		EndScaleformMovieMethod();
	})();
 
 
	function StopDisplaying () {
		KeepDisplaying = false;
		SetScaleformMovieAsNoLongerNeeded(Popup_Body);
		BeginScaleformMovieMethod(Popup_Button, "CLEAR_ALL");
		EndScaleformMovieMethod();
		SetScaleformMovieAsNoLongerNeeded(Popup_Button);
		PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_MP_SOUNDSET");
	}
 

	var DisplayingSince = GetGameTimer();
	while (KeepDisplaying) {
		var CurrentTime = GetGameTimer();

		DrawScaleformMovieFullscreen(Popup_Body, 255, 255, 255, 255, 0)
		DrawScaleformMovieFullscreen(Popup_Button, 255, 255, 255, 255, 0)
 
		HideHudAndRadarThisFrame()
 
		if (EnableMouse) {
			ScaleformMouse();
		}
 
		DisableControlAction(2, 200);

		if (IsControlJustReleased(0, 201) /*[[INPUT_FRONTEND_ACCEPT]]*/ || IsControlJustReleased(0, 202) /*[[INPUT_FRONTEND_CANCEL]]*/ 
		|| IsControlJustReleased(0, 238) /*[[Rightclick]]*/) {
			if (CurrentTime - DisplayingSince >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else  {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET");
			}
		}

		await Wait();
	}
	DebugLog(`PopupMessage`);
}

async function BigFeed (Title, Subtitle, Body, txd, txn, WaitBeforeAllowingConfirm, ButtonText, MouseEnabled, UseTextLabels, TitleTextComponents, SubtitleTextComponents, BodyTextComponents) {
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
		ScaleformMovieMethodAddParamPlayerNameString(txn);
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
			if (CurrentTime - StartedDrawing >= WaitBeforeAllowingConfirm) {
				StopDisplaying()
			} else {
				PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET")
			}
		}

		await Wait();
	}
}

async function ShowMidsizedNotification (bigText, msgText, time, colID, useTextLabels, bigTextTextComponents, msgTextTextComponents) {
	while (CurrentShard) { // to prevent scaleform bugging
		await Wait(500);
	}

	var MIDSIZED_MESSAGE = RequestScaleformMovie(`MIDSIZED_MESSAGE`);
	CurrentShard = MIDSIZED_MESSAGE;
	while (!HasScaleformMovieLoaded(MIDSIZED_MESSAGE)) {
		await Wait(100);
	}

	if (!bigText) bigText = "bigText";
	if (!msgText) msgText = "msgText";
	if (!time) time = 5000;

	BeginScaleformMovieMethod(MIDSIZED_MESSAGE, `SHOW_SHARD_MIDSIZED_MESSAGE`);
	if (useTextLabels) {
		BeginTextCommandScaleformString(bigText);
		if (bigTextTextComponents) {
			if (typeof(bigTextTextComponents) === 'string') {
				AddTextComponentSubstringPlayerName(bigText);
			} else if (typeof(bigTextTextComponents) === 'object' && bigTextTextComponents.length) {
				bigTextTextComponents.forEach(async component => {
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
					await Wait(50);
				});
			}
		}
		EndTextCommandScaleformString();
		BeginTextCommandScaleformString(msgText);
		if (msgTextTextComponents) {
			if (typeof(msgTextTextComponents) === 'string') {
				AddTextComponentSubstringPlayerName(msgText);
			} else if (typeof(msgTextTextComponents) === 'object' && msgTextTextComponents.length) {
				msgTextTextComponents.forEach(async component => {
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
					await Wait(50);
				});
			}
		}
		EndTextCommandScaleformString();		
	} else {
		ScaleformMovieMethodAddParamPlayerNameString(bigText);
		ScaleformMovieMethodAddParamPlayerNameString(msgText);
	}
	if (colID) ScaleformMovieMethodAddParamInt(colID);
	EndScaleformMovieMethod();

	(async function () {
		var StartedDrawing = GetGameTimer();
		var KeepLoop = true;
		var AnimRunning = false;
		time += 2000;
		while (KeepLoop) {
			var Timer = GetGameTimer();
			if ((time - (Timer - StartedDrawing) <= 2000) && !AnimRunning) {
			//	console.log('it is time')
				AnimRunning = true;

				BeginScaleformMovieMethod(MIDSIZED_MESSAGE, "SHARD_ANIM_OUT");
				ScaleformMovieMethodAddParamInt(0);
				EndScaleformMovieMethod();

				setTimeout(() => {
					SetScaleformMovieAsNoLongerNeeded(MIDSIZED_MESSAGE);
					KeepLoop = false;
					CurrentShard = null;
					//console.log('broke')
					//break;
				}, 2000);
			}

			DrawScaleformMovieFullscreen(MIDSIZED_MESSAGE, 255, 255, 255, 255, 0);

			await Wait(0);
		}
	})();

	return true;
}

async function OnKillNotification (player, animal, PedID, killCount) {
	var Handle = null;
	if (PedID && DoesEntityExist(PedID)) {
		Handle = RegisterPedheadshot(PedID);
		var Time = 0;
		while (!IsPedheadshotReady(Handle)) {
			Time += 1;
			if (Time >= 300) {
				console.log(`^1Ped headshot didn't load in time.`);
				break;
			}
			await Wait(0);
		}
	}

	var txd = GetPedheadshotTxdString(Handle);
	if (HuntingInInfo && HuntingInInfo.hudColor) ThefeedNextPostBackgroundColor(224);
	BeginTextCommandThefeedPost("HuntingKillFeedPost");
	AddTextComponentSubstringPlayerName(player ? player : "You");
	AddTextComponentSubstringPlayerName(animal);
	AddTextComponentSubstringPlayerName(player ? `Kills: ${killCount}` : ``);
	if (txd) {
		EndTextCommandThefeedPostMessagetext(txd, txd, true, 0, "~g~Hunting", player ? player : "Animal killed");
	} else {
		DebugLog(`No txd?`);
		EndTextCommandThefeedPostTicker(true, true);
	}
	setTimeout(() => UnregisterPedheadshot(Handle), 1000);
}

function IsContextActive(ctx) {
	//DebugLog(`IsContextActive`);
	BeginTextCommandIsThisHelpMessageBeingDisplayed(ctx);  
	return EndTextCommandIsThisHelpMessageBeingDisplayed(0);  
}  

function Draw2DText (x, y, text, textFont, scale, r, g, b, a, center) {
	if (textFont) SetTextFont(textFont);
	SetTextScale(scale, scale);
	if (r && g && b && a) SetTextColour(r, g, b, 255);
	SetTextDropShadow(0, 0, 0, 0,255);
	SetTextDropShadow();
	//SetTextEdge(4, 0, 0, 0, 255)
	SetTextCentre(center)
	SetTextOutline();
	BeginTextCommandDisplayText("STRING");
	AddTextComponentSubstringPlayerName(text);
	EndTextCommandDisplayText(x, y);
	//DebugLog(`Draw2DText`);
}

onNet("Hunting:PopupMessage", (Header, BodyText1, BodyText2, WaitBeforeAllowingConfirm, ButtonText, EnableMouse, UseTextEntries, HeaderTextComponents, BodyTextComponents, BodyText2Components) => {
	PopupMessage(Header, BodyText1, BodyText2, WaitBeforeAllowingConfirm, ButtonText, EnableMouse, UseTextEntries, HeaderTextComponents, BodyTextComponents, BodyText2Components);
});

onNet('Hunting:BigFeed', (Title, Subtitle, Body, txd, txn, WaitBeforeAllowingConfirm, ButtonText, MouseEnabled, UseTextLabels, TitleTextComponents, SubtitleTextComponents, BodyTextComponents) => {
	BigFeed(Title, Subtitle, Body, txd, txn, WaitBeforeAllowingConfirm, ButtonText, MouseEnabled, UseTextLabels, TitleTextComponents, SubtitleTextComponents, BodyTextComponents);
});

onNet("Hunting:Scoreboard", (Title, Slots, WaitBeforeAllowingConfirm, ButtonText, EnableMouse) => {
	Scoreboard(Title, Slots, WaitBeforeAllowingConfirm, ButtonText, EnableMouse);
});

onNet('Hunting:MidsizedNotification', (bigText, msgText, time, colID, useTextLabels, bigTextTextComponents, msgTextTextComponents) => {
	ShowMidsizedNotification(bigText, msgText, time, colID, useTextLabels, bigTextTextComponents, msgTextTextComponents);
});

onNet("Hunting:MeleeKillNotification", bonus => {
	ThefeedNextPostBackgroundColor(47);
	BeginTextCommandThefeedPost("HuntingMeleeKillBonusFeedPost");
	AddTextComponentSubstringPlayerName(bonus);
	EndTextCommandThefeedPostTicker(true, true);
	DebugLog(`Received from server event Hunting:MeleeKillNotification with param bonus ${bonus}`);
});

onNet("Hunting:StealthKillNotification", bonus => {
	ThefeedNextPostBackgroundColor(47);
	BeginTextCommandThefeedPost("HuntingStealthKillBonusFeedPost");
	AddTextComponentSubstringPlayerName(bonus);
	EndTextCommandThefeedPostTicker(true, true);
	DebugLog(`Received from server event Hunting:StealthKillNotification with param bonus ${bonus}`);
});

onNet("Hunting:RandomBonusNotification", bonus => {
	ThefeedNextPostBackgroundColor(47);
	BeginTextCommandThefeedPost("HuntingRandomBonusFeedPost");
	AddTextComponentSubstringPlayerName(bonus);
	EndTextCommandThefeedPostTicker(true, true);
	DebugLog(`Received from server event Hunting:RandomBonusNotification with param bonus ${bonus}`);	
});

onNet("Hunting:GameEndedNotification", reason => {
	BeginTextCommandThefeedPost("HuntingOngoingHuntStopped");
	if (reason) AddTextComponentSubstringPlayerName(`Reason: ${reason}`);
	EndTextCommandThefeedPostTicker(true, true);
	DebugLog(`Received from server event Hunting:GameEndedNotification with param reason ${reason}`);
})

onNet('Hunting:CommandError', (errText) => {
	//ThefeedNextPostBackgroundColor(6);
	BeginTextCommandThefeedPost("HuntingCommandError");
	AddTextComponentSubstringPlayerName(errText);
	EndTextCommandThefeedPostTicker(true, true);
	DebugLog(`Received from server event Hunting:CommandError with param errText ${errText}`);
});

onNet("Hunting:KillNotification", (player, animal, playerPedID, killCount) => {
	OnKillNotification(player, animal, playerPedID, killCount);
	DebugLog(`Received from server event Hunting:KillNotification with params player, animal, playerPedID, killCount | ${player} ${animal} ${playerPedID} ${killCount}`);
});

/*RegisterCommand('huntdebugpopup', (source, args) => {
	PopupMessage("Header", "BodyText", "BodyText2", 1000, null, true, false);
});
RegisterCommand('huntdebugscoreboard', async () => {
	Scoreboard();
});
RegisterCommand('huntdebugbigfeed', () => {
	var TextureURL = 'https://i.imgur.com/jw1KUFC.png';
	var Txd = CreateRuntimeTxd('SCRIPT_HUNTING');
	var DUI = CreateDui(TextureURL, 1, 1);
	var DUI2 = GetDuiHandle(DUI);
	var tx = CreateRuntimeTextureFromDuiHandle(Txd, 'IMAGE_1', DUI2);
	BigFeed("Title", "Subtitle", "Body", "SCRIPT_HUNTING", "IMAGE_1", 2000, null, true, false, null, null, null)
})*/
RegisterCommand('huntpausedebug', () => {
	console.log(`^1Debug logs now PAUSED`);
	DebugLogsEnabled = false;
});
RegisterCommand('huntdebugmidsizednotification', async () => {
	ShowMidsizedNotification();
});
RegisterCommand('huntresumedebug', () => {
	console.log(`^2Debug logs now RESUMED`);
	DebugLogsEnabled = true;
});
RegisterCommand('huntsethudcolor', (source, args) => {
	if (args.length < 4) return console.log(`huntsethudcolor r g b a`);
	ReplaceHudColourWithRgba(224, parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
	console.log(`R = ${args[0]} G = ${args[1]} B = ${args[2]} A = ${args[3]}`);
});
RegisterCommand('hunttogglehudcolorautoupdate', () => {
	if (HudColorAutoUpdateEnabled) {
		HudColorAutoUpdateEnabled = false;
	} else HudColorAutoUpdateEnabled = true;
	console.log(`HudColorAutoUpdateEnabled = ${HudColorAutoUpdateEnabled}`);
});
