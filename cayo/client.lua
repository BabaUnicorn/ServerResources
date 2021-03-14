-- misc natives
Citizen.InvokeNative(0xF74B1FFA4A15FBEA, true)
Citizen.InvokeNative(0x53797676AD34A9AA, false)    
SetScenarioGroupEnabled('Heist_Island_Peds', true)

-- audio stuff
SetAudioFlag('PlayerOnDLCHeist4Island', true)
SetAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', true, true)
SetAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, true)

function ToggleCayo (toggle)
  Citizen.InvokeNative(0x9A9D1BA639675CF1, 'HeistIsland', toggle) -- or use false to disable it
  -- instead of using island hopper you can *also* just load the IPLs mentioned in islandhopper.meta yourself somewhat

  -- switch radar interior
  Citizen.InvokeNative(0x5E1460624D194A38, toggle)
end

local IslandisEnabled = false
RegisterCommand('cayo', function ()
    if IslandIsEnabled then
      IslandIsEnabled = false
      ToggleCayo(IslandIsEnabled)
      print('disabled prostituta')
    else
      IslandIsEnabled = true
      ToggleCayo(IslandIsEnabled)
      print('enabled prostituta')
    end
      
end)
