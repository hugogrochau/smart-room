local newLed = function (port, speed)
  -- declarations --
  local timer = tmr.create()

  local switchLed = function()
    if gpio.read(port) == gpio.HIGH then
      gpio.write(port, gpio.LOW)
    else
      gpio.write(port, gpio.HIGH)
    end
  end

  local start = function()
    timer:start()
  end

  local stop = function()
    timer:stop()
  end

  local toggle = function()
    local on = timer:state()
    if on then
      timer:stop()
    else
      timer:start()
    end
  end


  -- init --
  gpio.mode(port, gpio.OUTPUT)
  gpio.write(port, gpio.LOW)
  timer:register(speed, tmr.ALARM_AUTO, switchLed)

  -- exports --
  return {
    start = start,
    stop = stop,
    toggle = toggle
  }
end

return newLed