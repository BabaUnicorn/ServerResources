local islandVector = vector3(4840.571, -5174.425, 2.0)

Citizen.CreateThread(function()
    while true do
        local playerCoords = GetEntityCoords(PlayerPedId())
        local distance = #(playerCoords - islandVector)
        if distance < 2000 then
            Citizen.InvokeNative('0x9A9D1BA639675CF1', 'HeistIsland', true)
            Citizen.InvokeNative('0x5E1460624D194A38', true)
        else
            Citizen.InvokeNative('0x9A9D1BA639675CF1', 'HeistIsland', false)
            Citizen.InvokeNative('0x5E1460624D194A38', true)
        end
        Citizen.Wait(5000)
    end
end)
