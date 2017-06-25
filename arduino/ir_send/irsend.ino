/*
 * IRremoteESP8266: IRsendGCDemo
 * demonstrates sending Global Cache-formatted IR codes with IRsend
 *
 * An IR LED must be connected to ESP8266 pin 0.
 * Version 0.1 30 March, 2016
 * Based on Ken Shirriff's IrsendDemo
 * Version 0.1 July, 2009
 * Copyright 2009 Ken Shirriff
 * http://arcfn.com
 */

#include <IRsend.h>

// Codes are in Global Cache format less the emitter ID and request ID.
// These codes can be found in GC's Control Tower database.


uint16_t  acOn[98] = {4500,650, 1650,650, 550,650, 1650,650, 1650,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 1650,650, 550,650, 1650,650, 550,600, 1650,650, 1650,650, 1650,650, 1650,650, 550,650, 1650,650, 1650,650, 1650,650, 550,650, 550,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 1650,650, 1650,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 1650,650, 1650,650, 1650,650, 1650,650, 1650,650 };  // UNKNOWN 978B578E


IRsend irsend(14);  // an IR emitter led is connected to GPIO pin 4

void setup() {
  irsend.begin();
  Serial.begin(115200);
}

void loop() {
  Serial.println("Toggling power");
  irsend.sendGC(acOn, 98);
  delay(2000);
}
