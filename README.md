# ESP32 WebSocket Control Project

## Overview
This project allows real-time communication between an ESP32 microcontroller and a web-based interface using WebSockets. The ESP32 connects to a WebSocket server hosted on a cloud service, enabling bidirectional control and monitoring.

## Features
- **WebSocket Communication:** Enables real-time message exchange between ESP32 and the web interface.
- **Remote Control:** Web clients can send commands to the ESP32 to control connected devices.
- **ESP32 Device Registration:** The ESP32 registers itself with the WebSocket server upon connection.
- **Cross-Platform Support:** Works in a web browser and ESP32 using WiFi.

## File Structure
```
/
│── server.js          # WebSocket server
│── index.html        # Web client interface
│── esp32_client.ino  # ESP32 firmware
```

## Setup and Installation
### Server
1. Install Node.js if not already installed.
2. Install dependencies and start the server:
   ```sh
   npm install express ws
   node server.js
   ```
3. The server will run on `http://localhost:8080`.

### Web Client
1. Open `index.html` in a browser.
2. The page allows sending commands to connected ESP32 devices.

### ESP32 Client
1. Install the necessary libraries in Arduino IDE:
   - `WiFi.h`
   - `ArduinoWebsockets.h`
2. Modify `esp32_client.ino` with your WiFi credentials.
3. Upload the sketch to an ESP32 device.

## Usage
1. Start the server using `node server.js`.
2. Open `index.html` in a web browser.
3. Power on the ESP32; it will connect to WiFi and register with the server.
4. Use the web interface to send commands to the ESP32.

## Troubleshooting
- If the ESP32 fails to connect to WiFi, check credentials.
- Ensure the WebSocket server is running before connecting the ESP32.
- Open the browser console (`F12` -> Console) to check for errors.

## Future Improvements
- Secure WebSockets (`wss://`)
- MQTT integration for better reliability
- More advanced ESP32 control features

