let wait = (ms) => new Promise(res => setTimeout(res, ms));

let godmode = false
let vgodmode = false

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
    let resBucket = GetPlayerRoutingBucket(idResult)
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

RegisterCommand('vworld', (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    let targetWorld = parseInt(args[1])
    if(!idResult || idResult == null || !targetWorld || targetWorld == null){
        SetPlayerRoutingBucket(source, 0);
        emitNet('louBasics:vworldNoArgs', source);
    } else {
        SetPlayerRoutingBucket(idResult, targetWorld);
        emitNet('louBasics:vworldNotif', idResult, targetWorld);
    }
})

RegisterCommand('warn', async (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    let warningMsg = args.slice(1).join(' ');
    if(!idResult || idResult == null || !warningMsg || warningMsg == ''){
        emitNet('louBasics:warningNoArgs', source)
    } else {
        emitNet('louBasics:warningMsg', idResult, warningMsg)
    }
}, true)

RegisterCommand('godmode', (source) => {
    if(!godmode){
        godmode = true
        emitNet('louBasics:invincibilityOn', source);
    } else if(godmode){
        godmode = false
        emitNet('louBasics:invincibilityOff', source);
    }
})

RegisterCommand('vgodmode', (source) => {
    if(!vgodmode){
        vgodmode = true
        emitNet('louBasics:vehInvincibilityOn', source);
    } else if(vgodmode){
        vgodmode = false
        emitNet('louBasics:vehInvincibilityOff', source);
    }
})

RegisterCommand('basics', (source, args) => {
    let helpCmd = args[0]

    if(!args || args == null){
        emitNet('louBasics:helpCmds', source);
        console.log('debug command... no args...');
    }

    if(helpCmd){
        emitNet('louBasics:helpScaleform', source);
        console.log('debug command... help...')
    }
})
