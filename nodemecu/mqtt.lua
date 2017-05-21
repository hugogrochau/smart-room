local m = mqtt.Client('hugo', 120)
local BASE_TOPIC = 'hugogrochau/smart-room'

local id = nil
local key = ''..tmr.now()
local position = 0

function createUpdate(temperature)
  return '{ "id":"'..id..'", "temperature":"'..temperature..'", "position":"'..position..'"}'
end

function publishTemperature(c)
  if id then
    local temperature = adc.read(0)*(3.3/10.24)
    c:publish(BASE_TOPIC..'/update', createUpdate(temperature), 0, 0, 
              function() print('sent update') end)
  end
end

function messageHandler(c, topic, message)
  print('[Received] Topic: '..topic..' | Message: '..message)
  if topic == BASE_TOPIC..'/acceptRegistration' then
    local receivedKey = message:match('([0-9]*) [0-9]*')
    local receivedId = message:match('[0-9]* ([0-9]*)')
    if id == nil and key == receivedKey then
      id = receivedId
    end
  end
end

function connected(c)
  c:subscribe(BASE_TOPIC..'/acceptRegistration', 0)
  c:on('message', messageHandler)
  c:publish(BASE_TOPIC..'/requestRegistration', '{"key":"'..key..'"}', 0, 0,
            function() print('requested registration') end)

  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, function() publishTemperature(c) end)
  timer:start()
end 

m:connect('test.mosca.io', 1883, 0, 
          connected,
          function(client, reason) print('failed reason: '..reason) end)
