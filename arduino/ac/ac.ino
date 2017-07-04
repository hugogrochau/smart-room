#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <IRsend.h>

const char *ssid =  "SSID";
const char *pass =  "PASS";
uint16_t acOn[98]  = {4500,650, 1650,650, 550,650, 1650,650, 1650,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 1650,650, 550,650, 1650,650, 550,600, 1650,650, 1650,650, 1650,650, 1650,650, 550,650, 1650,650, 1650,650, 1650,650, 550,650, 550,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 1650,650, 1650,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 550,650, 1650,650, 1650,650, 1650,650, 1650,650, 1650,650 };  // UNKNOWN 978B578E
uint16_t acOff[98] = {4500,650, 1650,650, 550,650, 1650,650, 1650,650, 550,650, 550,650, 1650,650, 500,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 1650,650, 550,650, 1650,650, 550,650, 550,650, 550,650, 1650,650, 1650,600, 1650,650, 1650,600, 1650,650, 1650,600, 1650,650, 1650,650, 550,600, 550,650, 550,650, 550,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 1650,650, 550,650, 550,650, 550,650, 1650,650, 550,650, 1650,650, 1650,650, 550,650, 1650,650, 1650,650, 1650,650 };  // UNKNOWN FF71B108
IRsend irsend(14);

#define BUFFER_SIZE 100

void callback(const MQTT::Publish& pub) {
  Serial.print("Received topic: ");
  Serial.println(pub.topic());
  Serial.print("Received message: ");
  Serial.println(pub.payload_string());
  if (pub.payload_string() == "on") {
    irsend.sendRaw(acOn, 98, 38);
    Serial.println("Turning AC on");
  } else if (pub.payload_string() == "off") {
    irsend.sendRaw(acOff, 98, 38);
    Serial.println("Turning AC off");
  }
}

WiFiClient wclient;
PubSubClient client(wclient, "test.mosca.io");

void setup() {
  irsend.begin();
  Serial.begin(115200);
  delay(10);
  Serial.println();
  Serial.println();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Connecting to ");
    Serial.print(ssid);
    Serial.println("...");
    WiFi.begin(ssid, pass);

    if (WiFi.waitForConnectResult() != WL_CONNECTED)
      return;
    Serial.println("WiFi connected");
  }

  if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      if (client.connect("ac client")) {
        Serial.println("MQTT connected");
        client.set_callback(callback);
        client.subscribe("hugogrochau/smart-room/ac");
      }
    }

    if (client.connected())
      client.loop();
  }
}
