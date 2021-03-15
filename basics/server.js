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
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    let srcBucket = GetPlayerRoutingBucket(source)
    console.log(srcBucket)
    let resBucket = GetPlayerRoutingBucket(idResult)
    console.log(resBucket)
    if(!idResult || idResult == null){
        emitNet('louBasics:tpNoArgs', source);
    } else if(srcBucket != resBucket){
        let destCoords = GetEntityCoords(GetPlayerPed(idResult));
        SetPlayerRoutingBucket(source, resBucket)
        SetEntityCoords(source, destCoords[0], destCoords[1], destCoords[2], false, false, false, false);
        emitNet('louBasics:tpDiffRBucket', source, GetPlayerName(idResult));
        emitNet('louBasics:tpNotif', idResult, GetPlayerName(source));
    } else {
        let destCoords = GetEntityCoords(GetPlayerPed(idResult));
        SetEntityCoords(source, destCoords[0], destCoords[1], destCoords[2], false, false, false, false);
        emitNet('louBasics:tpNotif', idResult, GetPlayerName(source));
    }
})

RegisterCommand('get', (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    if(!idResult || idResult == null){
        emitNet('louBasics:getNoArgs', source);
    } else {
        let destCoords = GetEntityCoords(GetPlayerPed(source));
        let idPed = GetPlayerPed(idResult);
        SetEntityCoords(idPed, destCoords[0], destCoords[1], destCoords[2], false, false, false, false);
        emitNet('louBasics:getNotif', idResult, GetPlayerName(source));
    }
}, true)

RegisterCommand('kick', (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    let kicker = GetPlayerName(source)
    let reasonArgs = args.slice(1).join(" ")
    let kickReason = `Kicked by ${kicker}: ` + reasonArgs;
    if(!idResult || idResult == null || !reasonArgs || reasonArgs == null || reasonArgs == ''){
        emitNet('louBasics:kickNoArgs', source);
    } else {
        DropPlayer(idResult, kickReason);
    }
}, true)

RegisterCommand('dm', (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    let msgContent = args.slice(1).join(" ");
    if(!idResult || idResult == null || !msgContent || msgContent == null || msgContent == ''){
        emitNet('louBasics:dmNoArgs', source);
    } else {
        emitNet('louBasics:dmNotifRec', idResult, GetPlayerName(source), msgContent);
        emitNet('louBasics:dmNotifSent', source, GetPlayerName(idResult), msgContent);
    }
})

    
// DEBUG COMMAND AAAAAAAAAAAAAA TO DELETE

RegisterCommand('rbdebug1', (source) => {
    SetPlayerRoutingBucket(source, 69)
    console.log('routing bucket debug 1 !! switched to rb 69')
})

RegisterCommand('rbdebug2', (source) => {
    SetPlayerRoutingBucket(source, 0)
    console.log('routing bucket debug 2 !! switched back to rb 0')
})
