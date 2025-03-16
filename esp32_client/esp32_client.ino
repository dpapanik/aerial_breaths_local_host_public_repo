#include <WiFi.h>
#include <ArduinoWebsockets.h>

// ESP32 WROOM DA

// WiFi credentials
const char* ssid = "your ssid";
const char* password = "your password";

// const char* websocketServer = "wss://aerial-breaths.fly.dev"; 
const char* websocketServer = "wss://aerial-breaths-quiet-thunder-2831.fly.dev"; 

// Delay time for fan operation in milliseconds
const int fan_delay = 500;

using namespace websockets;
WebsocketsClient webSocket;  // ESP32 WebSocket client

// Pin assignments
const int RELAY_PIN = 13;  // Relay control pin
const int LED_PIN = 2;  // LED control pin
const char* DEVICE_ID = "ESP32-1";  // Unique ID for this ESP32

void setup() {
    Serial.begin(115200); // Initialize serial communication
    
    WiFi.begin(ssid, password); // Connect to WiFi network
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");

    // Set WebSocket event handlers
    webSocket.onMessage(onWebSocketMessage);
    webSocket.onEvent(onWebSocketEvent);
    webSocket.connect(websocketServer);  // Connect to WebSocket server

    // Configure relay and LED pins as output
    pinMode(RELAY_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
    
    // Ensure relay and LED are turned off initially
    digitalWrite(RELAY_PIN, LOW);
    digitalWrite(LED_PIN, LOW);

    // Send registration message to the WebSocket server
    webSocket.send(String("{\"id\": \"") + DEVICE_ID + "\"}");
    

void loop() {
    webSocket.poll();  // Maintain WebSocket connection
}

// Function to handle incoming WebSocket messages
void onWebSocketMessage(WebsocketsMessage message) {
    Serial.println("Received: " + message.data()); // Print received message

    // Check if the received command is "turn_on"
    if (message.data() == "{\"command\":\"turn_on\"}") {
        digitalWrite(RELAY_PIN, HIGH); // Turn on relay
        digitalWrite(LED_PIN, HIGH);   // Turn on LED
        delay(fan_delay);  // Keep fan on for specified delay
        digitalWrite(RELAY_PIN, LOW);  // Turn off relay
        digitalWrite(LED_PIN, LOW);    // Turn off LED
        Serial.println("Fan turned ON for 500 milliseconds");
    }
}

// Function to handle WebSocket connection events
void onWebSocketEvent(WebsocketsEvent event, String data) {
    if (event == WebsocketsEvent::ConnectionOpened) {
        Serial.println("WebSocket Connected!");
    } else if (event == WebsocketsEvent::ConnectionClosed) {
        Serial.println("WebSocket Disconnected!");
    }
}

