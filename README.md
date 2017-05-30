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
* 1 x IR LED
* 1 x Beeper
