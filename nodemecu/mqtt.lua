local BASE_TOPIC = 'hugogrochau/smart-room'
local MQTT_SERVER = 'test.mosca.io'
local wificonf = require('wificonf')

local registered = false
math.randomseed(tmr.now())
local id = ''..math.random(2000000000)
local m = mqtt.Client(id, 120)
local position = 0

-- utils 
function publish(c, method, message)
  c:publish(BASE_TOPIC..'/'..method, message, 0, 0,
    function() print('[Sent] Method: '..method..' | Message: '..message) end
  )
end

function createUpdate(temperature)
  return '{ "id":"'..id..'", "temperature":"'..temperature..'", "position":"'..position..'"}'
end

function publishTemperature(c)
  if registered then
    local temperature = adc.read(0)*(3.3/10.24)
    publish(c, 'update', createUpdate(temperature))
  end
end
-- end utils

-- callbacks
function connectedToWifi()
  print('Connected to wifi. IP: '..wifi.sta.getip())
  m:connect(MQTT_SERVER, 1883, 0, 
            connectedToMqtt,
            function(client, reason) print('failed reason: '..reason) end)
end

function connectedToMqtt(c)
  print('Connected to MQTT server. host: '..MQTT_SERVER)
  c:subscribe(BASE_TOPIC..'/acceptRegistration', 0)
  c:on('message', messageHandler)
  publish(c, 'requestRegistration', '{"id":"'..id..'"}')

  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, function() publishTemperature(c) end)
  timer:start()
end 

function messageHandler(c, topic, message)
  print('[Received] Topic: '..topic..' | Message: '..message)
  if topic == BASE_TOPIC..'/acceptRegistration' then
    if not registered and id == message then
      registered = true
    end
  end
end
-- end callbacks

-- init
print('Connecting to wifi...')
wifi.sta.config(wificonf)
wifi.setmode(wifi.STATION)
tmr.create():alarm(8000, tmr.ALARM_SINGLE, connectedToWifi)
-- end init
