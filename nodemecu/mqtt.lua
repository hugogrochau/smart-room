local m = mqtt.Client("hugo", 120)

function publishTemperature(c)
  local temperature = adc.read(0)*(3.3/10.24)
  c:publish("hugogrochau/smart-room/temperature", temperature, 0, 0, 
            function(client) print("sent temperature") end)
end

function controlSubscription(c)
  local msgsrec = 0
  function newMessage (c, t, m)
    print ("message ".. msgsrec .. ", topic: ".. t .. ", data: " .. m)
    msgsrec = msgsrec + 1
  end
  c:on("message", newMessage)
end

function connected(c)
  c:subscribe("hugogrochau/smart-room/control", 0, controlSubscription)
  local timer = tmr.create()
  timer:register(1000, tmr.ALARM_AUTO, function() publishTemperature(c) end)
  timer:start()
end 

m:connect("test.mosca.io", 1883, 0, 
             connected,
             function(client, reason) print("failed reason: "..reason) end)
