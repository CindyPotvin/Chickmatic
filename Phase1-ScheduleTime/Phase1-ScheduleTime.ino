/*
* Phase 1 : Arduino dimming the light according to an hardcoded schedule. 
* Requires the DS1709 module from Adafruit to keep the time and an 
* external dimming module.
*/

#include <RTClib.h>

#include <Wire.h>out

struct ScheduledTime_t {
  int hour;
  int minute;
};

RTC_DS1307 RTC;
ScheduledTime_t StartLight;
ScheduledTime_t StopLight;
DateTime StartLightDateTime;
DateTime StopLightDateTime;
bool Light = false;
// Analog output pin that the AC Dimmer Board is connected to (Digital Pin 9), Mode to 5v
const int DimmerPin = 9;
// Value output to the PWM (analog out): starts closed
int DimmerOutputValue = 0;      


void setup () {
  Serial.begin(9600);
  RTC.begin();

  // Starts opening at 4:30
  StartLight.hour = 4;
  StartLight.minute = 30;
  StartLightDateTime = DateTime(2016, 01, 01, StartLight.hour, StartLight.minute, 0);

  // Starts closing at 18:40
  StopLight.hour = 18;
  StopLight.minute = 40;
  StopLightDateTime = DateTime(2016, 01, 01, StopLight.hour, StopLight.minute, 0);
    
  // Initialize the dimmer as closed
  analogWrite(DimmerPin, DimmerOutputValue);

  // Initialize the real time clock module
  if (!RTC.isrunning()) {
     Serial.println("RTC is NOT running!");
     // The following line sets the RTC to the date & time this sketch was compiled, 
     // only required the first time
     //RTC.adjust(DateTime(__DATE__, __TIME__));
  }
  // Leave time for everything to get setup before starting the control loop
  delay(2000);
}
 
void loop () {
    // Sets the lights according to the schedule once every 3 seconds.
    toggleLightsAccordingToSchedule();   
    showDimmerValueMessage();
    delay(3000);
}

/* Shows a debug message containing the current value of the dimmer. */
void showDimmerValueMessage(){
    Serial.print("Dimmer set to: ");
    Serial.print(DimmerOutputValue);
    Serial.println("%");
}

/* Toggles the lights according to the hardcodded times. */
void toggleLightsAccordingToSchedule() {
  // Gets the current time and output to debug port. Since we only 
  // need the time to compare, always set the date to January 1st.
  DateTime now = RTC.now();        
  delay(200);
  DateTime nowCompare = DateTime(2016, 01, 01, now.hour(), now.minute(), 0);
  
  Serial.print(now.year(), DEC);
  Serial.print('/');
  Serial.print(now.month(), DEC);
  Serial.print('/');
  Serial.print(now.day(), DEC);
  Serial.print(' ');
  Serial.print(now.hour(), DEC);
  Serial.print(':');
  Serial.print(now.minute(), DEC);
  Serial.print(':');
  Serial.print(now.second(), DEC);
  Serial.println();
  
  // Convert all times to unixtime to make it easier to calculate. 
  // Sets a flag indicating is the light is open or closed according 
  // to the schedule. The light might still be open if it's still 
  // in the process of closing.
  if (!Light && 
      nowCompare.unixtime() >= StartLightDateTime.unixtime() && 
      nowCompare.unixtime() < StopLightDateTime.unixtime()) {
    Light = true;
    Serial.println("Start light");
  }
        
  if (Light && 
      nowCompare.unixtime() >= StopLightDateTime.unixtime()) {
    Light = false;
    Serial.println("Stop light");
    }


  // Opens or closes lights gradually with dimmer       
  if (Light) {
    uint32_t offSetSeconds = nowCompare.unixtime() - StartLightDateTime.unixtime();
    uint32_t offsetMinutes = (offSetSeconds / 60);
    if (offsetMinutes < 10)
      DimmerOutputValue = 20;
    else if (offsetMinutes >= 10 && offsetMinutes < 20)
      DimmerOutputValue = 40;
    else if (offsetMinutes >= 20 && offsetMinutes < 30)
      DimmerOutputValue = 60;
    else if (offsetMinutes >= 30 && offsetMinutes < 40)
      DimmerOutputValue = 80;
    else 
      DimmerOutputValue = 100;
           
    analogWrite(DimmerPin, DimmerOutputValue);
  }
        
  if (!Light) {
    uint32_t offSetSeconds = nowCompare.unixtime() - StopLightDateTime.unixtime();
    uint32_t offsetMinutes = (offSetSeconds / 60);
    if (offsetMinutes < 10)
      DimmerOutputValue = 80;
    else if (offsetMinutes >= 10 && offsetMinutes < 20)
      DimmerOutputValue = 60;
    else if (offsetMinutes >= 20 && offsetMinutes < 30)
      DimmerOutputValue = 40;
    else if (offsetMinutes >= 30 && offsetMinutes < 40)
      DimmerOutputValue = 20;
    else 
      DimmerOutputValue = 0;
      
    analogWrite(DimmerPin, DimmerOutputValue);
    }
 }
