# smart-room
A platform for monitoring and controlling a set of ESP8266 chips deployed in a room

# Description
The purpose of this project is to monitor and control a room's temperature and number of occupants

## Chips:
* One chip will be deployed next to the door, to sense and report when someone enters or leaves the room
* Another will be deployed with an IR LED to control the AC unit
* Another will be deployed in the middle of the room
* All sensors will report their temperatures

## Interface:
The web interface will show:
* Where each sensor is located in the room and their respective temperatures
* The average temperature of the room
* How many people are in the room
* When a person enters or leaves the room

It will allow for:
* Manually turning on and off the AC
* Manually turning off the beeper
* Configuring the temperature threshold to turn on and off the AC
* Configuring the maximum occupancy threshold

# Hardware
* 3 x ESP8266
* 2 x Motion detectors
* 1 x IR blaster
* 1 x IR receiver
* 1 x Beeper

# Notes:
PIR:
* PIR 5v power and 3.3v data
* Use trigger to detect

IR
* Use resistor + transistor to convert from 3.3v to 5.0
* resistor connects from gpio to the middle pin of the transistor
* left pin (colector) of the transistor connects to ground
* right pin (emissor) of the transistor connects to 5v 

# Resources:
## IR:
* https://www.hackster.io/BuddyC/wifi-ir-blaster-af6bca
* https://github.com/markszabo/IRremoteESP8266
* https://github.com/mdhiggins/ESP8266-HTTP-IR-Blaster
* http://osoyoo.com/2016/12/08/nodemcu-mqtt-ir-remoter/
* http://www.instructables.com/id/Easiest-ESP8266-Learning-IR-Remote-Control-Via-WIF/

## Motion detector (PIR):
* http://www.instructables.com/id/IOT-Motion-Detector-With-Email-Notification-W-Node/
* http://www.instructables.com/id/IoT-Motion-Detector-With-NodeMCU-and-BLYNK/
* https://nodemcu.readthedocs.io/en/master/en/modules/gpio/#gpiotrig
* http://www.filipeflop.com/pd-6b901-sensor-de-movimento-presenca-pir.html

## Temperature sensor:
* https://nodemcu.readthedocs.io/en/master/en/modules/dht/
* http://www.filipeflop.com/pd-6b8f7-sensor-de-umidade-e-temperatura-dht11.html

## Arduino on esp8266
* http://blog.filipeflop.com/wireless/esp8266-arduino-tutorial.html
* https://github.com/esp8266/Arduino
