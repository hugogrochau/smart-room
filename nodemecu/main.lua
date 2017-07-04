local TOPIC = 'hugogrochau/smart-room/update'
local MQTT_SERVER = 'test.mosca.io'
local m = mqtt.Client('pir', 120)
local wificonf = require('wificonf')

local PIR1 = 5
local PIR2 = 6
local DHT = 1
local PIR1Active = 0
local PIR2Active = 0
local persons = 0
local temperature = 0
local humidity = 0

-- utils
function publishUpdate()
  local updateString = '{ "temperature":'..temperature..', "persons":'..persons..', "humidity":'..humidity..'}'
  client:publish(TOPIC, updateString, 0, 0,
    function() print('Update: '..updateString) end
  )
end

function readDHT()
  -- status, temperature, humidity = dht.read(DHT)
  -- if status == dht.OK then
  --   print("DHT Read. Temperature: "..temperature..". Humidity: "..humidity..".")
  --   publishUpdate()
  -- end
end
-- end utils

-- callbacks
function connectedToWifi()
  print('Connected to wifi. IP: '..wifi.sta.getip())
  m:connect(MQTT_SERVER, 1883, 0,
            connectedToMqtt,
            function(c, reason) print('Failed connecting to mqtt server. Reason: '..reason) end)
end

function connectedToMqtt(c)
  client = c
  print('Connected to MQTT server. Host: '..MQTT_SERVER)

  -- local timer = tmr.create()
  -- timer:register(2000, tmr.ALARM_AUTO, readDHT)
  -- timer:start()

  gpio.mode(PIR1, gpio.INT)
  gpio.mode(PIR2, gpio.INT)
  gpio.trig(PIR1, "both", onPIR1Change)
  gpio.trig(PIR2, "both", onPIR2Change)
end

function onPIR1Change()
  PIR1Active = gpio.read(PIR1)
  print("PIR 1 changed to: " .. PIR1Active)
  if PIR1Active == 1 and PIR1Active == PIR2Active then
    print("Person entered")
    persons = persons + 1
    PIR1Active = 0
    PIR2Active = 0
    publishUpdate()
  end
end

function onPIR2Change()
  PIR2Active = gpio.read(PIR2)
  print("PIR 2 changed to: " .. PIR2Active)
  if PIR2Active == 1 and PIR2Active == PIR1Active then
    print("Person left")
    persons = math.max(persons - 1, 0)
    PIR1Active = 0
    PIR2Active = 0
    publishUpdate()
  end
end
-- end callbacks

-- init
print('Connecting to wifi...')
wifi.sta.config(wificonf)
wifi.setmode(wifi.STATION)
tmr.create():alarm(8000, tmr.ALARM_SINGLE, connectedToWifi)
-- end init
