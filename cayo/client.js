let wait = (ms) => new Promise(res => setTimeout(res, ms));

let islandCoords = [4840.571, -5174.425, 2.0]

async function loadCayo(){
    while(true){
        let playerCoords = GetEntityCoords(PlayerPedId())
        let distance = playerCoords - islandCoords
        if(distance < 2000){
            Citizen.InvokeNative("0x9A9D1BA639675CF1", "HeistIsland", true)  // load the map and removes the city
			Citizen.InvokeNative("0x5E1460624D194A38", true) // load the minimap/pause map and removes the city minimap/pause map
        } else {
            Citizen.InvokeNative("0x9A9D1BA639675CF1", "HeistIsland", false)  // load the map and removes the city
			Citizen.InvokeNative("0x5E1460624D194A38", false) // load the minimap/pause map and removes the city minimap/pause map
        }
        await wait(5000)
    }
}

loadCayo()
