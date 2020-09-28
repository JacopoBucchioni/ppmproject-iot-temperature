#include <ArduinoJson.h>
const size_t capacity = JSON_OBJECT_SIZE(5) + 100;


#include "DHT.h"
#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);


#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define SERVER_IP "192.168.188.71"
//#define SERVER_HOST "http://iotemperature.pythonanywhere.com" // SERVER_HOST

const char* ssid = "skynet";
const char* password = "Bnqm2PE4";

IPAddress myIPAddress;


#include <NTPClient.h>
#include <WiFiUdp.h>
// Define NTP Client to get time
const long utcOffset = 7200;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "it.pool.ntp.org", utcOffset);



void setup() {

  Serial.begin(115200);

  Serial.println();
  Serial.println();
  Serial.println();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! IP address: ");
  myIPAddress = WiFi.localIP();
  Serial.println(myIPAddress);

  timeClient.begin();

  dht.begin();

}

void loop() {
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {

    timeClient.update();

    DynamicJsonDocument doc(capacity);

    WiFiClient client;
    HTTPClient http;

    Serial.print("[HTTP] begin...\n");
    // configure traged server and url
    http.begin(client, SERVER_IP, 8000, "/update/"); //HTTP
    // http.begin(client, SERVER_HOST"/update/");

    //http.setAuthorization(pythonanywhere_api_token);
    http.addHeader("Content-Type", "application/json");
    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body

    String httpRequestJSON;

    doc["IPAddress"] = myIPAddress.toString();
    doc["temperature"] = dht.readTemperature();
    doc["humidity"] = dht.readHumidity();
    doc["date"] = getFullFormattedTime(timeClient);
    doc["sensorType"] = DHTTYPE;

    serializeJson(doc, httpRequestJSON);

    Serial.println(httpRequestJSON);
    int httpCode = http.POST(httpRequestJSON);

    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("received payload:\n<<");
        Serial.println(payload);
        Serial.println(">>");
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }

  delay(10000);
}



String getFullFormattedTime(NTPClient timeClient) {
  time_t rawtime = timeClient.getEpochTime();
  struct tm * ti;
  ti = localtime (&rawtime);

  uint16_t year = ti->tm_year + 1900;
  String yearStr = String(year);

  uint8_t month = ti->tm_mon + 1;
  String monthStr = month < 10 ? "0" + String(month) : String(month);

  uint8_t day = ti->tm_mday;
  String dayStr = day < 10 ? "0" + String(day) : String(day);

  uint8_t hours = ti->tm_hour;
  String hoursStr = hours < 10 ? "0" + String(hours) : String(hours);

  uint8_t minutes = ti->tm_min;
  String minuteStr = minutes < 10 ? "0" + String(minutes) : String(minutes);

  uint8_t seconds = ti->tm_sec;
  String secondStr = seconds < 10 ? "0" + String(seconds) : String(seconds);

  return yearStr + "/" + monthStr + "/" + dayStr + "T" + hoursStr + ":" + minuteStr + ":" + secondStr;
}
