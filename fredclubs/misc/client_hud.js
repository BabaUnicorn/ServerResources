AddTextEntry("Nightclubs", "Nightclubs");
AddTextEntry("NightclubsBlipName_1", "Nightclub");
AddTextEntry("NightclubsNearbyClubHelpText", "...");
AddTextEntry("NightclubsNearbyClubExitHelpText", "...");
AddTextEntry("NightclubsServerTakingTooLongWarningMessageBody", "The server is taking too long to respond... would you like to try again?");
AddTextEntry("NightclubsWelcomeFeedPost", "Enjoy your stay!");

var Wait = (ms) => new Promise(res => setTimeout(res, ms ? ms : DrawTickRate));
var ClubBlips = [];
var DrawTickRate = 3;
var LoadingScreenActive = false;

function SetBlipForClub (clubInfo) {
    if (!clubInfo) return false;

    var Blip = AddBlipForCoord(clubInfo.coords[0], clubInfo.coords[1], clubInfo.coords[2]);
    SetBlipSprite(Blip, clubInfo.blipSprite ? clubInfo.blipSprite : 614);
    if (clubInfo.blipColor) SetBlipColour(Blip, clubInfo.blipColor);
    SetBlipScale(Blip, 1.1);
    SetBlipAsShortRange(Blip, true);
    BeginTextCommandSetBlipName(clubInfo.blipTextLabel);
    EndTextCommandSetBlipName(Blip);

    ClubBlips.push(Blip);

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
    Clubs.forEach(async club => {
        RemoveBlip(club);
        await Wait();
    });
    ClubBlips.length = 0;
}

async function StartupLoadingScreen () {
    SwitchOutPlayer(PlayerPedId(), 289263, 2);
    DisplayRadar(false);

    while (!IsPlayerSwitchInProgress()) {
        await Wait(0);
    }

    LoadingScreenActive = true;
}

function StopLoadingScreen () {
    StopPlayerSwitch();
    DisplayRadar(true);
    LoadingScreenActive = false;
}

function IsLoadingScreenActive () {
    return LoadingScreenActive;
}