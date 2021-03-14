var CurrentRadiusBlipID = 0;
var Blips = [];
var AnimalBlips = [];

function SetHuntingBlips () {
	Zones.forEach(async z => {
		var Blip = AddBlipForCoord(z.coords[0], z.coords[1], z.coords[2]);
		SetBlipScale(Blip, 1.5);
		SetBlipAsShortRange(Blip, true);
		SetBlipSprite(Blip, z.blipSprite ? z.blipSprite : 141);
		SetBlipColour(Blip, z.blipColor ? z.blipColor : 2);
		BeginTextCommandSetBlipName(z.blipNameLabel ? z.blipNameLabel : "HuntingBlipName_1");
		EndTextCommandSetBlipName(Blip);

		Blips.push(Blip);
		DebugLog(`Blip: ${Blip}`);

		await Wait();
	});
	//DebugLog(`SetHuntingBlips`);
}

function RemoveHuntingBlips () {
	Blips.forEach(async b => {
		RemoveBlip(b);
		await Wait();
	});
	Blips.length = 0;
	//DebugLog(`RemoveHuntingBlips`);
}

function SetAnimalBlip (PedHandle) {
	if (DoesEntityExist(PedHandle) === 1) {
		var AnimalBlip = AddBlipForEntity(PedHandle);
		SetBlipAsShortRange(AnimalBlip, true);
		SetBlipSprite(AnimalBlip, 141);
		SetBlipScale(AnimalBlip, 1.3)
		BeginTextCommandSetBlipName("HuntingBlipName_3");
		EndTextCommandSetBlipName(AnimalBlip);

		AnimalBlips.push({
			BlipId: AnimalBlip,
			PedHandle: PedHandle
		});
	} else return false;

	return true;
}

function GetBlipForAnimal (PedHandle) {
	if (DoesEntityExist(PedHandle) === 1) {
		var found = AnimalBlips.find(b => b.PedHandle === PedHandle);
		if (found) {
			return found.BlipId;
		} else return null;
	} else return false;
}

function RemoveAnimalBlip (PedHandle) {
	var Blip = GetBlipForAnimal(PedHandle);
	if (Blip) {
		AnimalBlips = AnimalBlips.filter(b => b.BlipId !== Blip);
	//	console.log('removing blip ' + Blip)
		return RemoveBlip(Blip);
	}
	return false;
}

function RemoveAllAnimalBlips () {
	AnimalBlips.forEach(async b => {
		RemoveAnimalBlip(b.PedHandle);
		await Wait(10);
	});
}

function DoesAnimalHaveBlip (PedHandle) {
	return (typeof(GetBlipForAnimal(PedHandle)) === 'number' ? true : false);
}

function GetAnimalBlips () {
	return AnimalBlips;
}

function AddMinimapRadiusForHuntingZone (ZoneID, UseRadarZoomoutAni) {
	if (!UseRadarZoomoutAni && UseRadarZoomoutAni !== false) UseRadarZoomoutAni = false;

	if (CurrentRadiusBlipID !== 0) RemoveBlip(CurrentRadiusBlipID);

	var _Zone = GetHuntingZoneByID(ZoneID);
	if (!_Zone) return null;
	
	var Blip2 = AddBlipForRadius(_Zone.coords[0], _Zone.coords[1], _Zone.coords[2], _Zone.zone);
	//SetBlipSprite(Blip2, 9);
	SetBlipColour(Blip2, _Zone.blipColor ? _Zone.blipColor : 2);
	//SetBlipAsShortRange(Blip2, true);
	SetBlipAlpha(Blip2, 50);
	if (UseRadarZoomoutAni) {
		SetBlipFlashes(Blip2, true);
		SetRadarZoomPrecise(99)
		setTimeout(() => {
			SetBlipFlashes(Blip2, false);
			SetRadarZoom(null);
		}, 4000);
	}
	
	CurrentRadiusBlipID = Blip2;

	//DebugLog(`AddMinimapRadiusForHuntingZone`);
	DebugLog(CurrentRadiusBlipID);

	return Blip2;
}

function RemoveMinimapRadiusForHuntingZone () {
	//DebugLog(`RemoveMinimapRadiusForHuntingZone`);
	RemoveBlip(CurrentRadiusBlipID);
}