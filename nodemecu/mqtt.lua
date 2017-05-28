local BASE_TOPIC = 'hugogrochau/smart-room'
local MQTT_SERVER = 'test.mosca.io'
local wificonf = require('wificonf')
local newButton = require('button')
local newLed = require('led')
local DEBOUNCE_TIME = 250
local LED_SPEED = 500


local client = nil
math.randomseed(tmr.now())
local id = ''..math.random(2000000000)
local m = mqtt.Client(id, 120)

local position = 0
local temperature = 0
local registered = false

local led1 = newLed(3, LED_SPEED)
local led2 = newLed(6, LED_SPEED)

-- utils 
function publish(method, message)
  client:publish(BASE_TOPIC..'/'..method, message, 0, 0,
    function() print('[Sent] Method: '..method..' | Message: '..message) end
  )
end

function createUpdate()
  return '{ "id":"'..id..'", "temperature":"'..temperature..'", "position":"'..position..'"}'
end

function publishTemperature()
  if registered then
    temperature = adc.read(0)*(3.3/10.24)
    publish('update', createUpdate())
  end
end
-- end utils

-- callbacks
function connectedToWifi()
  print('Connected to wifi. IP: '..wifi.sta.getip())
  m:connect(MQTT_SERVER, 1883, 0, 
            connectedToMqtt,
            function(c, reason) print('failed reason: '..reason) end)
end

function connectedToMqtt(c)
  client = c
  print('Connected to MQTT server. host: '..MQTT_SERVER)
  client:subscribe(BASE_TOPIC..'/acceptRegistration', 0)
  client:subscribe(BASE_TOPIC..'/changeLedStatus', 0)
  client:on('message', messageHandler)
  publish('requestRegistration', '{"id":"'..id..'"}')

  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, publishTemperature)
  timer:start()

  newButton(1, DEBOUNCE_TIME, changePosition(1))
  newButton(2, DEBOUNCE_TIME, changePosition(-1))
end 

function messageHandler(c, topic, message)
  print('[Received] Topic: '..topic..' | Message: '..message)
  if topic == BASE_TOPIC..'/acceptRegistration' then
    if not registered and id == message then
      registered = true
    end
  end
  if topic == BASE_TOPIC..'/changeLedStatus' then
    local receivedId = message:match('([0-9]*) [0-9]*')
    local receivedLed = message:match('[0-9]* ([0-9]*)')
    if receivedLed == '1' then
      led1.toggle()
    end
    if receivedLed == '2' then
      led2.toggle()
    end
  end
end

function changePosition(delta)
  return function()
    if position + delta >= 0 and position + delta <= 15 then
      position = position + delta
      publish('update', createUpdate())
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
