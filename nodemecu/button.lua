local newButton = function (port, debounceTime, callback)
  -- declarations --
  local lastPressTime = 0

  local callbackWrapper = function()
    local currentTime = tmr.now()
    if currentTime > lastPressTime + debounceTime then
      callback(lastPressTime)
      lastPressTime = currentTime
    end
  end

  -- init --
  gpio.mode(port, gpio.INT, gpio.PULLUP)
  gpio.trig(port, "down", callbackWrapper)

end

return newButton