let wait = (ms) => new Promise(res => setTimeout(res, ms));

RegisterCommand('tp', (source, args) => {
    const GetPlayers = () => {
        let t = []
        
        for (let i = 0; i < GetNumPlayerIndices(); i++) {
            t.push(GetPlayerFromIndex(i))
        }
    
        return t
    }
    
    let idResult = GetPlayers().find(element => element == parseInt(args[0]));
    if(!idResult || idResult == null){
        emitNet('louBasics:tpNoArgs', source);
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
        emitNet('louBasics:playerKicked', -1, GetPlayerName(idResult));
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
        let recHeadshot = GetPlayerPed(idResult)
        emitNet('louBasics:dmNotifRec', idResult, GetPlayerName(source), msgContent, recHeadshot);
        emitNet('louBasics:dmNotifSent', source, GetPlayerName(idResult), msgContent, recHeadshot);
    }
})
