local m = mqtt.Client('hugo', 120)
local BASE_TOPIC = 'hugogrochau/smart-room'

local id = nil
local key = ''..tmr.now()
local position = 0

local wificonf = {
  ssid = "SSID",
  pwd = "PWD",
  save = false
}

function publish(c, method, message)
  c:publish(BASE_TOPIC..'/'..method, message, 0, 0,
            function() print('[Sent] Method: '..method..' | Message: '..message) end
            )
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

function publishTemperature(c)
  if id then
    local temperature = adc.read(0)*(3.3/10.24)
    publish(c, 'update', createUpdate(temperature))
  end
end

function connectedToMqtt(c)
  c:subscribe(BASE_TOPIC..'/acceptRegistration', 0)

  c:on('message', messageHandler)

  publish(c, 'requestRegistration', '{"key":"'..key..'"}')

  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, function() publishTemperature(c) end)
  timer:start()
end 

function connectedToWifi()
  print('Connected to wifi. IP: '..wifi.sta.getip())
  m:connect('test.mosca.io', 1883, 0, 
            connectedtoMqtt,
            function(client, reason) print('failed reason: '..reason) end)
end

function createUpdate(temperature)
  return '{ "id":"'..id..'", "temperature":"'..temperature..'", "position":"'..position..'"}'
end


print('Connecting to wifi...')
wifi.sta.config(wificonf)
wifi.setmode(wifi.STATION)
while not wifi.sta.getip() do end 
connectedToWifi()