local m = mqtt.Client("hugo", 120)

function publishTemp(c)
  local temperature = adc.read(0)*(3.3/10.24)
  c:publish("hugogrochau/smart-home/temperature", temperature,0,0, 
            function(client) print("sent temperature") end)
end

function controlSubscription (c)
  local msgsrec = 0
  function newMessage (c, t, m)
    print ("message ".. msgsrec .. ", topic: ".. t .. ", data: " .. m)
    msgsrec = msgsrec + 1
  end
  c:on("message", newMessage)
end

function connected (c)
  publishTemp(c)
  c:subscribe("hugogrochau/smart-home/control", 0, controlSubscription)
end 

m:connect("test.mosca.io", 1883, 0, 
             connected,
             function(client, reason) print("failed reason: "..reason) end)