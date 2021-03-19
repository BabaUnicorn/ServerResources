SetDiscordAppId('801953437095952384');
SetDiscordRichPresenceAsset('cat');
SetDiscordRichPresenceAssetText('lou made this owo');
SetDiscordRichPresenceAssetSmall('logo');
SetDiscordRichPresenceAssetSmallText('yes fivem logo go woah');
SetDiscordRichPresenceAction(0, 'join whore club', 'fivem://connect/w8embb')

function discordPresence(){
    const playerName = GetPlayerName(PlayerId());
    const ped = PlayerPedId();
    const vehname = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(GetVehiclePedIsUsing(ped))));
    const inWater = IsEntityInWater(ped);
    const inVehicle = IsPedInAnyVehicle(ped);
    let playerX = GetEntityCoords(ped)[0]
    let playerY = GetEntityCoords(ped)[1]
    let playerZ = GetEntityCoords(ped)[2]
    let stHash = GetStreetNameAtCoord(playerX, playerY, playerZ)
    let stName = GetStreetNameFromHashKey(stHash[0])
    if(inVehicle && GetVehiclePedIsUsing(ped) && !IsPedOnFoot(ped)){
        SetRichPresence(`In a ${vehname} on ${stName}`)
    } else if(!inVehicle && IsPedWalking(ped) && !inWater){
        SetRichPresence(`Walking on ${stName}`)
    } else if(!inVehicle && IsPedRunning(ped) && !inWater){
        SetRichPresence(`Running on ${stName}`)
    } else if(!inVehicle && IsPedStill(ped) && !inWater){
        SetRichPresence(`Standing on ${stName}`)
    } else if(IsEntityInWater(ped)){
        SetRichPresence(`Swimming!`)
    }
}

setInterval(() => {
    discordPresence();
}, 20000);
