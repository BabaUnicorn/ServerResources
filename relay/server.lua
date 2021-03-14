local url = 'https://discord.com/api/webhooks/819860977104191539/VuOUG1sND8yoVjlCTVCLE5xAtGOR5tzgw6AolOq615XzjePhb2a-FbYksVbG-8dmFMjE'

function toDiscord(name, message, avatar)
    if message == nil or message == '' then
        return false
    end
    PerformHttpRequest(url, function(err, text, headers) end, 'POST', json.encode({username = name, content = message, avatar_url = avatar}), { ['Content-Type'] = 'application/json' })
end

AddEventHandler('chatMessage', function(source, name, message)
    local avatar = 'https://i.imgur.com/jzsnN8F.png'
    toDiscord(name, message, avatar)
end)

RegisterNetEvent('playerJoining')
AddEventHandler('playerJoining', function()
    local avatar = 'https://i.imgur.com/Vlg3MHm.png'
    toDiscord('JOIN', "`".. GetPlayerName(source) .. ' joined the server.`', avatar)
end)

AddEventHandler('playerDropped', function(reason)
    local avatar = 'https://i.imgur.com/yY93SMs.png'
    toDiscord('DROP', "`".. GetPlayerName(source) .. ' left the server.\nReason: ' .. reason .."`", avatar)
end)