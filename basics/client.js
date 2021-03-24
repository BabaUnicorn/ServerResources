AddTextEntry('MODEL_NOT_FOUND', '~r~Couldn\'t find model in game files.~n~~h~Usage:~s~ /v name');
AddTextEntry('NO_VEHICLE', '~r~You\'re not in a vehicle! Enter a vehicle and try again.');
AddTextEntry('VEHICLE_DELETED', 'Your vehicle has been deleted.');
AddTextEntry('VEHICLE_FIXED', 'Your vehicle has been fixed.');
AddTextEntry('TP_NO_ARGS', '~r~Server ID is invalid or not provided!~n~~h~Usage:~s~ /tp id');
AddTextEntry('KICK_NO_ARGS', '~r~Server ID is invalid, or you did not specify a reason!~n~~h~Usage:~s~ /kick id reason');
AddTextEntry('TP_NOTIF', '~a~ has TP\'d to you!');
AddTextEntry('GET_NOTIF', '~a~ has TP\'d you to them!');
AddTextEntry('GET_NO_ARGS', '~r~Server ID is invalid or not provided!~n~~h~Usage:~s~ /get id');
AddTextEntry('TP_DIFF_RBUCKET', '~a~ is in a different virtual world. Switching...');
AddTextEntry('NO_RGB', '~r~RGB values are invalid.~n~~h~Usage:~s~ /vcolor 0-255 0-255 0-255');
AddTextEntry('DM_NO_ARGS', '~r~Server ID is invalid, or message is missing!~n~~h~Usage:~s~ /dm id message');
AddTextEntry("DM_RECEIVED", "~a~");
AddTextEntry("DM_SENT", "~a~");
AddTextEntry('JOIN_MSG', '~a~ ~g~joined.~s~');
AddTextEntry('LEAVE_MSG', '~a~ ~r~left.~s~');
AddTextEntry('RB_NO_ARGS', '~r~Arguments missing, switching to world 0...~n~~h~Usage:~s~ /vworld id world');
AddTextEntry('RB_SWITCHED', 'Your virtual world has been set to ~a~');
AddTextEntry('WARNING_TITLE', 'WARNING!');
AddTextEntry('GM_ON', 'Godmode ~g~on.');
AddTextEntry('GM_OFF', 'Godmode ~r~off.');
AddTextEntry('VGM_ON', 'Vehicle godmode ~g~on.');
AddTextEntry('VGM_OFF', 'Vehicle godmode ~r~off.');
AddTextEntry('WARNING_SUBTITLE', '~r~Please do not ignore the following message.');
AddTextEntry('WARNING_NO_ARGS', '~r~Server ID is invalid, or message is missing!~n~~h~Usage:~s~ /warn id message')
AddTextEntry('WARNING_SUCCESS', 'You have warned ~a~.');

emit('chat:addSuggestion', '/fix', 'Fix your vehicle.', []);
emit('chat:addSuggestion', '/dv', 'Delete your vehicle.', []);
emit('chat:addSuggestion', '/godmode', 'Enable or disable godmode.', []);
emit('chat:addSuggestion', '/v', 'Spawn a vehicle.', [{name: 'model', help: 'Vehicle to spawn'}]);
emit('chat:addSuggestion', '/tp', 'Teleport to another player', [{name: 'Server ID', help: 'Player\'s server ID'}])
emit('chat:addSuggestion', '/vcolor', 'Set vehicle primary and secondary color, defaults to white if no values are provided.', [{name: 'R', help: 'Red value'},{name: 'G', help: 'Green value'},{name: 'B', help: 'Blue value'}])
emit('chat:addSuggestion', '/get', 'Teleport another player to you', [{name: 'Server ID', help: 'Player\'s server ID'}])
emit('chat:addSuggestion', '/kick', 'Kick a player', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Reason', help: 'Note: the player will see the reason!'}])
emit('chat:addSuggestion', '/dm', 'Send a private message to a player', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Message', help: 'Express yourself!'}])
emit('chat:addSuggestion', '/vworld', 'Change player virtual world', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Virtual world', help: 'Number of the virtual world'}]);
emit('chat:addSuggestion', '/warn', 'Warn a player', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Reason', help: 'Note: the player will see the reason!'}])
emit('chat:addSuggestion', '/basics', 'List of commands', []);

let WAIT = (ms) => new Promise(res => setTimeout(res, ms));
let ped = PlayerPedId();
let godmode = !GetPlayerInvincible(PlayerId());
let help_title = 'Basics';
let text_a = '~h~List of available commands:';
let text_b = '~y~/fix~s~ - Fix your current vehicle\n~y~/dv~s~ - Delete your current vehicle\n~y~/godmode~s~ - Enable or disable invincibility\n~y~/v~s~ - Spawn a vehicle by its name\n~y~/tp~s~ - Teleport to another player\n~y~/vcolor~s~ - Paint your current vehicle using RGB values\n~y~/dm~s~ - Send a private message to another player\n~c~* ~s~~y~/get~s~ - Teleport another player to you\n~c~* ~s~~y~/kick~s~ - Kick a player from the server\n~c~* ~s~~y~/vworld~s~ - Change players\' virtual world\n~c~* ~s~~y~/warn~s~ - Warn a player with an alert message on their screen\n~c~Commands prefixed by * are restricted and require specific permissions to be executed~s~'

async function warningsMsg(msg){
    let loop = true
    AddTextEntry('WARNING_MSG', msg);
    PlaySoundFrontend(-1, 'OTHER_TEXT', 'HUD_AWARDS');
    while(loop){
        //SetWarningMessage('WARNING_SUBTITLE', 2, 'WARNING_MSG', 0, -1, true, 0, 0, 0)
        DrawFrontendAlert('WARNING_TITLE', 'WARNING_SUBTITLE', 2, 0, 'WARNING_MSG', 0, -1, 0, 0, 0, -1, 0);
        if(IsControlJustReleased(2, 201)){
            loop = false
        }
        await WAIT(0);
    }
}

async function helpPopup(header, text1, text2, btntext, enbmouse, textentry, headercomps, text1comps, text2comps) {
    if (!header) header = 'header';
    if (!text1) text1 = 'text1';
    if (!text2) text2 = 'text2';
    if (!btntext) btntext = 'OK';
    if (!enbmouse && enbmouse !== false) enbmouse = false;
    if (!textentry && textentry !== false) textentry = false;

    let loop = true
    let popupbody = RequestScaleformMovie('POPUP_WARNING'), popupbtn = RequestScaleformMovie('INSTRUCTIONAL_BUTTONS')
    while (!HasScaleformMovieLoaded(popupbody) || !HasScaleformMovieLoaded(popupbtn)) {
        await WAIT(100)
    }
    

    function body() {
        BeginScaleformMovieMethod(popupbody, 'SHOW_POPUP_WARNING');
        ScaleformMovieMethodAddParamFloat(500.0);
        if(textentry){
            BeginTextCommandScaleformString(header);
            AddTextComponentsFromArray(headercomps)
            EndTextCommandScaleformString();
            BeginTextCommandScaleformString(text1);
            AddTextComponentsFromArray(text1comps)
            EndTextCommandScaleformString();
            BeginTextCommandScaleformString(text2);
            AddTextComponentsFromArray(text2comps)
            EndTextCommandScaleformString();
        } else {
            ScaleformMovieMethodAddParamPlayerNameString(header);
            ScaleformMovieMethodAddParamPlayerNameString(text1);
            ScaleformMovieMethodAddParamPlayerNameString(text2);
        }
        EndScaleformMovieMethod();
    }

    body();

    function buttons() {
        BeginScaleformMovieMethod(popupbtn, 'CLEAR_ALL');
        EndScaleformMovieMethod();

        if(enbmouse) {
            BeginScaleformMovieMethod(popupbtn, 'TOGGLE_MOUSE_BUTTONS');
            ScaleformMovieMethodAddParamBool(true);
            EndScaleformMovieMethod();
        }

        BeginScaleformMovieMethod(popupbtn, 'SET_DATA_SLOT');
        ScaleformMovieMethodAddParamInt(0);
        ScaleformMovieMethodAddParamPlayerNameString('~INPUT_FRONTEND_ACCEPT~');
        ScaleformMovieMethodAddParamPlayerNameString(btntext);
        if (enbmouse) {
            ScaleformMovieMethodAddParamBool(true);
            ScaleformMovieMethodAddParamInt(201)
        }
        EndScaleformMovieMethod();

        BeginScaleformMovieMethod(popupbtn, 'DRAW_INSTRUCTIONAL_BUTTONS')
        EndScaleformMovieMethod();
    }

    buttons();

    function stop(){
        loop = false;
        SetScaleformMovieAsNoLongerNeeded(popupbody);
        BeginScaleformMovieMethod(popupbtn, 'CLEAR_ALL');
        EndScaleformMovieMethod()
        SetScaleformMovieAsNoLongerNeeded(popupbtn)
        PlaySoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_MP_SOUNDSET');
    }

    function disablecontrols() {
        DisableControlAction(0, 24, true);
        DisableControlAction(0, 25, true);
        DisableControlAction(0, 1, true);
        DisableControlAction(0, 2, true);
        DisableControlAction(0, 16, true);
        DisableControlAction(0, 17, true);
        DisableControlAction(0, 257, true);
    }

    while (loop) {
        DrawScaleformMovieFullscreen(popupbody, 255, 255, 255, 255, 0);
        DrawScaleformMovieFullscreen(popupbtn, 255, 255, 255, 255, 0);

        HideHudAndRadarThisFrame();

        if (enbmouse) {
            SetMouseCursorActiveThisFrame();
        }

        DisableControlAction(2, 200);
        disablecontrols();

        if (IsControlJustReleased(0, 201) || IsControlJustReleased(0, 202) || IsControlJustReleased(0, 238)) {
            stop();
        }
        await WAIT(0);
    }
}

onNet('louBasics:helpScaleform', () => {
    helpPopup(help_title, text_a, text_b, 'OK', true, false, null, null, null);
})

onNet('louBasics:warningMsg', (msg) => {
    warningsMsg(msg);
})

function invincibilityOn(){
    SetPlayerInvincible(PlayerId(), true)
    BeginTextCommandThefeedPost('GM_ON');
    AddTextComponentSubstringPlayerName('GM_ON');
    EndTextCommandThefeedPostTicker(true, false);
}

function invincibilityOff(){
    SetPlayerInvincible(PlayerId(), false)
    BeginTextCommandThefeedPost('GM_OFF');
    AddTextComponentSubstringPlayerName('GM_OFF');
    EndTextCommandThefeedPostTicker(true, false);
}

function warnNoArgs(){
    BeginTextCommandThefeedPost('WARNING_NO_ARGS');
    AddTextComponentSubstringPlayerName('WARNING_NO_ARGS');
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:warningNoArgs', () => {
    warnNoArgs();
})

function rbNoArgs(){
    BeginTextCommandThefeedPost('RB_NO_ARGS');
    AddTextComponentSubstringPlayerName('RB_NO_ARGS');
    EndTextCommandThefeedPostTicker(true, false);
}

function rbSwitched(world){
    BeginTextCommandThefeedPost('RB_SWITCHED');
    AddTextComponentSubstringPlayerName(world);
    EndTextCommandThefeedPostTicker(true, false);
}

function warningSuccess(name){
    BeginTextCommandThefeedPost('WARNING_SUCCESS');
    AddTextComponentSubstringPlayerName(name);
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:warningNotif', (name) => {
    warningSuccess(name);
})

onNet('louBasics:vworldNoArgs', () => {
    rbNoArgs()
})

onNet('louBasics:vworldNotif', (world) => {
    rbSwitched(world)
})

function joinMsg(name){
    BeginTextCommandThefeedPost('JOIN_MSG');
    AddTextComponentSubstringPlayerName(name);
    EndTextCommandThefeedPostTicker(true, false);
    console.log(`[JOIN] New player has joined. Logging ${name}...`);
}

onNet('louBasics:joinMsg', (name) => {
    joinMsg(name)
})

function leaveMsg(name){
    BeginTextCommandThefeedPost('LEAVE_MSG');
    AddTextComponentSubstringPlayerName(name)
    EndTextCommandThefeedPostTicker(true, false);
    console.log(`[LEAVE] A player has left. Logging ${name}...`);
}

onNet('louBasics:leaveMsg', (name) => {
    leaveMsg(name)
})

async function dmNotifRec(player, message){
    let txdDict = 'shared'
    let txtName = 'info_icon_32'
    RequestStreamedTextureDict(txdDict)
    while(!HasStreamedTextureDictLoaded){
        await WAIT(0)
    }
    BeginTextCommandThefeedPost('DM_RECEIVED');
    AddTextComponentSubstringPlayerName(message)
    ThefeedNextPostBackgroundColor(200)
    let title = player
    let subtitle = 'DM Received'
    let iconType = 1
    let flash = false
    EndTextCommandThefeedPostMessagetext(txdDict, txtName, flash, iconType, title, subtitle)
    console.log(`[DM] Received from ${player} with content "${message}"`);
}

async function dmNotifSent(player, message){
    let txdDict = 'shared'
    let txtName = 'info_icon_32'
    RequestStreamedTextureDict(txdDict)
    while(!HasStreamedTextureDictLoaded){
        await WAIT(0)
    }
    BeginTextCommandThefeedPost('DM_SENT');
    AddTextComponentSubstringPlayerName(message)
    ThefeedNextPostBackgroundColor(200)
    let title = player
    let subtitle = 'DM Sent'
    let iconType = 1
    let flash = false
    EndTextCommandThefeedPostMessagetext(txdDict, txtName, flash, iconType, title, subtitle)
    console.log(`[DM] Sent to ${player} with content "${message}"`);
}

onNet('louBasics:dmNotifRec', (player, message) => {
    dmNotifRec(player, message);
})

onNet('louBasics:dmNotifSent', (player, message) => {
    dmNotifSent(player, message);
})

function tpNoArgs(){
    BeginTextCommandThefeedPost('TP_NO_ARGS');
    AddTextComponentSubstringPlayerName('TP_NO_ARGS')
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:tpNoArgs', () => {
    tpNoArgs();
})

function dmNoArgs(){
    BeginTextCommandThefeedPost('DM_NO_ARGS');
    AddTextComponentSubstringPlayerName('DM_NO_ARGS')
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:dmNoArgs', () => {
    dmNoArgs();
})

function getNoArgs(){
    BeginTextCommandThefeedPost('GET_NO_ARGS');
    AddTextComponentSubstringPlayerName('GET_NO_ARGS')
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:getNoArgs', () => {
    getNoArgs();
})


function kickNoArgs(){
    BeginTextCommandThefeedPost('KICK_NO_ARGS');
    AddTextComponentSubstringPlayerName('KICK_NO_ARGS')
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:kickNoArgs', () => {
    kickNoArgs();
})

function tpNotif(player){
    BeginTextCommandThefeedPost('TP_NOTIF');
    AddTextComponentSubstringPlayerName(player)
    EndTextCommandThefeedPostTicker(true, false);
    PlaySoundFrontend(-1, 'COLLECTED','HUD_AWARDS')
}

onNet('louBasics:tpNotif', (player) => {
    tpNotif(player);
})


function getNotif(player){
    BeginTextCommandThefeedPost('GET_NOTIF');
    AddTextComponentSubstringPlayerName(player)
    EndTextCommandThefeedPostTicker(true, false);
    PlaySoundFrontend(-1, 'COLLECTED','HUD_AWARDS')
}

onNet('louBasics:getNotif', (player) => {
    getNotif(player);
})

function tpDiffRBucket(player){
    BeginTextCommandThefeedPost('TP_DIFF_RBUCKET');
    AddTextComponentSubstringPlayerName(player)
    EndTextCommandThefeedPostTicker(true, false);
    PlaySoundFrontend(-1, 'COLLECTED','HUD_AWARDS')
}

onNet('louBasics:tpDiffRBucket', (player) => {
    tpDiffRBucket(player);
})

function modelNotFoundPopup(){
    BeginTextCommandThefeedPost('MODEL_NOT_FOUND');
    AddTextComponentSubstringPlayerName('MODEL_NOT_FOUND')
    EndTextCommandThefeedPostTicker(true, false);
}

function noVehicle(){
    BeginTextCommandThefeedPost('NO_VEHICLE');
    AddTextComponentSubstringPlayerName('NO_VEHICLE')
    EndTextCommandThefeedPostTicker(true, false);
}

function noRgb(){
    BeginTextCommandThefeedPost('NO_RGB');
    AddTextComponentSubstringPlayerName('NO_RGB')
    EndTextCommandThefeedPostTicker(true, false);
}

function vehicleDeleted(){
    BeginTextCommandThefeedPost('VEHICLE_DELETED');
    AddTextComponentSubstringPlayerName('VEHICLE_DELETED')
    EndTextCommandThefeedPostTicker(true, false);
}

function vehicleToFixPopup(){
    BeginTextCommandThefeedPost('VEHICLE_FIXED');
    AddTextComponentSubstringPlayerName('VEHICLE_FIXED')
    EndTextCommandThefeedPostTicker(true, false);
}

RegisterCommand('v', async (source, args, raw) => {
  const ped = PlayerPedId();
  const coords = GetEntityCoords(ped);
  let model = args;
  if(args.length > 0){
      model = args[0].toString();
  }
  const hash = GetHashKey(model);
  if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)){
    modelNotFoundPopup();
  }
  RequestModel(hash);
  while (!HasModelLoaded(hash)){
    await WAIT(500);
  }
  if(IsPedInAnyVehicle(ped, true)){
      let vehToDelete = GetVehiclePedIsIn(ped, true);
      DeleteEntity(vehToDelete);
  }
  const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);
  SetPedIntoVehicle(ped, vehicle, -1);
  SetEntityAsNoLongerNeeded(vehicle);
  SetModelAsNoLongerNeeded(model);
  BeginTextCommandThefeedPost("STRING");
  AddTextComponentSubstringPlayerName(`~h~Vehicle ~g~${model}~s~ has been spawned.`);
  EndTextCommandThefeedPostTicker(true, false);
})

RegisterCommand('dv', () => {
    const ped = PlayerPedId()
    let vehicleToDelete = GetVehiclePedIsIn(ped, true)
    if(!IsPedInAnyVehicle(ped, true)){
        noVehicle();
    } else {
        DeleteEntity(vehicleToDelete);
        vehicleDeleted();
    }
})

RegisterCommand('fix', () => {
    const ped = PlayerPedId()
    let vehicleToFix = GetVehiclePedIsIn(ped, false);
    if(!IsPedInAnyVehicle(ped, true)){
        noVehicle();
    } else {
        SetVehicleFixed(vehicleToFix);
        SetVehicleEngineHealth(vehicleToFix, 1000);
        SetVehicleEngineOn(vehicleToFix, true, true)
        vehicleToFixPopup();
    }
});

RegisterCommand('vcolor', (source, args, r, g, b) => {
    let veh = GetVehiclePedIsIn(PlayerPedId())
    r = parseInt(args[0])
    g = parseInt(args[1])
    b = parseInt(args[2])
    if(!veh || veh == null){
        noVehicle()
    } else if(r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0){
        noRgb()
    } else {
        SetVehicleCustomPrimaryColour(veh, r, g, b)
        SetVehicleCustomSecondaryColour(veh, r, g, b)
    }
})

RegisterCommand('godmode', (source) => {
    if(!godmode){
        godmode = true
        SetPlayerInvincible(PlayerId(), false);
        invincibilityOff();
    } else if (godmode){
        godmode = false
        SetPlayerInvincible(PlayerId(), true);
        invincibilityOn();
    }
})
