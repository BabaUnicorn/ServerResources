AddTextEntry('MODEL_NOT_FOUND', '~r~Couldn\'t find model in game files.~n~~h~Usage:~s~ /v name');
AddTextEntry('NO_VEHICLE', '~r~You\'re not in a vehicle! Enter a vehicle and try again.');
AddTextEntry('VEHICLE_DELETED', '~h~Your vehicle has been deleted.');
AddTextEntry('VEHICLE_FIXED', '~h~Your vehicle has been fixed.');
AddTextEntry('VEHICLE_LOCKED', '~h~Your vehicle has been locked.');
AddTextEntry('TP_NO_ARGS', '~r~Server ID is invalid or not provided!~n~~h~Usage:~s~ /tp id');
AddTextEntry('KICK_NO_ARGS', '~r~Server ID is either invalid, not provided or you did not specify a reason!~n~~h~Usage:~s~ /kick id reason');
AddTextEntry('TP_NOTIF', '~h~~a~ has TP\'d to you!');
AddTextEntry('GET_NOTIF', '~h~~a~ has TP\'d you to them!');
AddTextEntry('GET_NO_ARGS', '~r~Server ID is invalid or not provided!~n~~h~Usage:~s~ /get id');
AddTextEntry('PLAYER_KICKED', '~h~~a~ has been kicked.');
AddTextEntry('TP_DIFF_RBUCKET', '~h~~a~ is in a different virtual world. Switching...');
AddTextEntry('NO_RGB', '~r~RGB values are invalid.~n~~h~Usage:~s~ /vcolor 0-255 0-255 0-255');
AddTextEntry('DM_NO_ARGS', '~r~Server ID is either invalid, not provided or message is missing!~n~~h~Usage:~s~ /dm id message');
AddTextEntry("DM_RECEIVED", "~a~");
AddTextEntry("DM_SENT", "~a~");

emit('chat:addSuggestion', '/fix', 'Fix your vehicle.', []);
emit('chat:addSuggestion', '/dv', 'Delete your vehicle.', []);
emit('chat:addSuggestion', '/v', 'Spawn a vehicle.', [{name: 'model', help: 'Vehicle to spawn'}]);
emit('chat:addSuggestion', '/tp', 'Teleport to another player', [{name: 'Server ID', help: 'Player\'s server ID'}])
emit('chat:addSuggestion', '/vcolor', 'Set vehicle primary and secondary color, defaults to white if no values are provided.', [{name: 'R', help: 'Red value'},{name: 'G', help: 'Green value'},{name: 'B', help: 'Blue value'}])
emit('chat:addSuggestion', '/get', 'Teleport another player to you', [{name: 'Server ID', help: 'Player\'s server ID'}])
emit('chat:addSuggestion', '/kick', 'Kick a player', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Reason', help: 'Note: the player will see the reason!'}])
emit('chat:addSuggestion', '/dm', 'Send a private message to a player', [{name: 'Server ID', help: 'Player\'s server ID'}, {name: 'Message', help: 'Express yourself!'}])

let WAIT = (ms) => new Promise(res => setTimeout(res, ms));
let ped = PlayerPedId();

async function dmNotifRec(player, message, headshot){
    let handle = RegisterPedheadshotTransparent(PlayerPedId())
    while(!IsPedheadshotReady(handle) || !IsPedHeadshotValid(handle)){
        await WAIT(0)
    }
    let txd = GetPedheadshotTxdString(handle)
    BeginTextCommandThefeedPost('DM_RECEIVED');
    AddTextComponentSubstringPlayerName(message)
    //ThefeedNextPostBackgroundColor(110)
    let title = player
    let subtitle = 'DM Received'
    let iconType = 0
    let flash = false
    EndTextCommandThefeedPostMessagetext(txd, txd, flash, iconType, title, subtitle)
    UnregisterPedheadshot(handle)
}

async function dmNotifSent(player, message, headshot){
    let handle = RegisterPedheadshotTransparent(PlayerPedId())
    while(!IsPedheadshotReady(handle) || !IsPedHeadshotValid(handle)){
        await WAIT(0)
    }
    let txd = GetPedheadshotTxdString(handle)
    BeginTextCommandThefeedPost('DM_SENT');
    AddTextComponentSubstringPlayerName(message)
    //ThefeedNextPostBackgroundColor(110)
    let title = player
    let subtitle = 'DM Sent'
    let iconType = 0
    let flash = false
    EndTextCommandThefeedPostMessagetext(txd, txd, flash, iconType, title, subtitle)
    UnregisterPedheadshot(handle)
}

onNet('louBasics:dmNotifRec', (player, message, headshot) => {
    dmNotifRec(player, message, headshot);
})

onNet('louBasics:dmNotifSent', (player, message, headshot) => {
    dmNotifSent(player, message, headshot);
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

function playerKicked(player){
    BeginTextCommandThefeedPost('PLAYER_KICKED');
    AddTextComponentSubstringPlayerName(player)
    EndTextCommandThefeedPostTicker(true, false);
}

onNet('louBasics:playerKicked', (player) => {
    playerKicked(player);
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

function setVehicleLocked(){
    BeginTextCommandThefeedPost('VEHICLE_LOCKED');
    AddTextComponentSubstringPlayerName('VEHICLE_LOCKED')
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
    emitNet('louBasics:spawnFailed');
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
  emitNet('louBasics:spawnSucceeded');
})

RegisterCommand('dv', () => {
    const ped = PlayerPedId()
    let vehicleToDelete = GetVehiclePedIsIn(ped, true)
    if(!IsPedInAnyVehicle(ped, true)){
        noVehicle();
        emitNet('louBasics:dvFailed');
    } else {
        DeleteEntity(vehicleToDelete);
        vehicleDeleted();
        emitNet('louBasics:dvSucceeded');
    }
})

RegisterCommand('fix', () => {
    const ped = PlayerPedId()
    let vehicleToFix = GetVehiclePedIsIn(ped, false);
    if(!IsPedInAnyVehicle(ped, true)){
        noVehicle();
        emitNet('louBasics:fixFailed');
    } else {
        SetVehicleFixed(vehicleToFix);
        SetVehicleEngineHealth(vehicleToFix, 1000);
        SetVehicleEngineOn(vehicleToFix, true, true)
        vehicleToFixPopup();
        emitNet('louBasics:fixSucceeded');
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
        emitNet('louBasics:vcolorSucceeded')
    }
})
