let wait = (ms) => new Promise(res => setTimeout(res, ms));

RegisterNetEvent('playerJoining')
on('playerJoining', (source) => {
    let name = GetPlayerName(global.source)
    emitNet('louBasics:joinMsg', -1, name)
})

on('playerDropped', (reason) => {
    let name = GetPlayerName(global.source)
    emitNet('louBasics:leaveMsg', -1, name)
})

RegisterCommand('tp', (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    if(!idResult || idResult == null || iId != idResult){
        emitNet('louBasics:tpNoArgs', source);
    } else {
        let destCoords = GetEntityCoords(GetPlayerPed(idResult));
        SetEntityCoords(source, destCoords[0], destCoords[1], destCoords[2], false, false, false, false);
        emitNet('louBasics:tpNotif', idResult, GetPlayerName(source));
    }
})

RegisterCommand('get', (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    if(!idResult || idResult == null || iId != idResult){
        emitNet('louBasics:getNoArgs', source);
    } else {
        let destCoords = GetEntityCoords(GetPlayerPed(source));
        let idPed = GetPlayerPed(idResult);
        SetEntityCoords(idPed, destCoords[0], destCoords[1], destCoords[2], false, false, false, false);
        emitNet('louBasics:getNotif', idResult, GetPlayerName(source));
    }
}, true)

RegisterCommand('kick', (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    let kicker = GetPlayerName(source)
    let reasonArgs = args.slice(1).join(" ")
    let kickReason = `Kicked by ${kicker}: ` + reasonArgs;
    if(!idResult || idResult == null || iId != idResult || !reasonArgs || reasonArgs == null || reasonArgs == ''){
        emitNet('louBasics:kickNoArgs', source);
    } else {
        DropPlayer(idResult, kickReason);
    }
}, true)

RegisterCommand('dm', (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    let msgContent = args.slice(1).join(" ");
    if(!idResult || idResult == null || iId != idResult || !msgContent || msgContent == null || msgContent == ''){
        emitNet('louBasics:dmNoArgs', source);
    } else {
        emitNet('louBasics:dmNotifRec', idResult, GetPlayerName(source), msgContent);
        emitNet('louBasics:dmNotifSent', source, GetPlayerName(idResult), msgContent);
    }
})

RegisterCommand('vworld', (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    let targetWorld = parseInt(args[1])
    if(!idResult || idResult == null || iId != idResult || !targetWorld || targetWorld == null){
        SetPlayerRoutingBucket(source, 0);
        emitNet('louBasics:vworldNoArgs', source);
    } else {
        SetPlayerRoutingBucket(idResult, targetWorld);
        emitNet('louBasics:vworldNotif', idResult, targetWorld);
    }
}, true)

RegisterCommand('warn', async (source, args) => {
    let iId = parseInt(args[0]);
    let idResult = getPlayers().find(element => element == iId);
    let warningMsg = args.slice(1).join(' ');
    if(!idResult || idResult == null || iId != idResult || !warningMsg || warningMsg == ''){
        emitNet('louBasics:warningNoArgs', source)
    } else {
        emitNet('louBasics:warningMsg', idResult, warningMsg)
        emitNet('louBasics:warningNotif', source, GetPlayerName(idResult));
    }
}, true)

RegisterCommand('basics', (source) => {
    emitNet('louBasics:helpScaleform', source);
});
