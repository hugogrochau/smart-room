local BASE_TOPIC = 'hugogrochau/smart-room'
local MQTT_SERVER = 'test.mosca.io'
local wificonf = require('wificonf')

local registered = false
math.randomseed(tmr.now())
local key = ''..math.random(2000000000)
local m = mqtt.Client('smart-room-sensor', 120)
local position = 0

function publish(c, method, message)
  c:publish(BASE_TOPIC..'/'..method, message, 0, 0,
    function() print('[Sent] Method: '..method..' | Message: '..message) end
  )
end

function messageHandler(c, topic, message)
  print('[Received] Topic: '..topic..' | Message: '..message)
  if topic == BASE_TOPIC..'/acceptRegistration' then
    if not registered and key == message then
      registered = true
    end
  end
end

function publishTemperature(c)
  if registered then
    local temperature = adc.read(0)*(3.3/10.24)
    publish(c, 'update', createUpdate(temperature))
  end
end

function connectedToMqtt(c)
  print('Connected to mqtt server: '..MQTT_SERVER)
  c:subscribe(BASE_TOPIC..'/acceptRegistration', 0)

  c:on('message', messageHandler)

  publish(c, 'requestRegistration', '{"key":"'..key..'"}')

  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, function() publishTemperature(c) end)
  timer:start()
end 

function connectedToWifi()
  print('Connected to wifi. IP: '..wifi.sta.getip())
  m:connect(MQTT_SERVER, 1883, 0, 
            connectedtoMqtt,
            function(client, reason) print('failed reason: '..reason) end)
end

function createUpdate(temperature)
  return '{ "key":"'..key..'", "temperature":"'..temperature..'", "position":"'..position..'"}'
end


print('Connecting to wifi...')
wifi.sta.config(wificonf)
wifi.setmode(wifi.STATION)
tmr.create():alarm(10000, tmr.ALARM_SINGLE, connectedToWifi)