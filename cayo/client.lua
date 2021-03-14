function ToggleIsland(enabled)
  Citizen.InvokeNative(0x9A9D1BA639675CF1, "HeistIsland", enabled) -- Toggle island gta5 level
  Citizen.InvokeNative(0x5E1460624D194A38, enabled) -- Toggle island minimap
end

function ToggleIslandPathNodes(enabled)
  Citizen.InvokeNative(0xF74B1FFA4A15FBEA, enabled) -- Toggle island path nodes
end

local IslandIsEnabled = false

RegisterCommand('cayo', function()
        if IslandIsEnabled then
            IslandIsEnabled = true
            ToggleIsland(IslandIsEnabled)
            ToggleIslandPathNodes(IslandIsEnabled)
        else
            IslandIsEnabled = false
            ToggleIsland(IslandIsEnabled)
            ToggleIslandPathNodes(IslandIsEnabled)            
        end
end)

print('bababitch')
