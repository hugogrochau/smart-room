wificonf = {
  -- verificar ssid e senha
  ssid = "Grochau 2.4GHz",
  pwd = "32253983",
  save = false
}


wifi.sta.config(wificonf)
print("modo: ".. wifi.setmode(wifi.STATION))
print(wifi.sta.getip())