const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;
app.use(express.static(__dirname));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const clients = new Map();

wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");

    ws.on('message', (message) => {
        console.log("Received message from client:", message.toString());

        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error("Invalid JSON received:", message);
            return;
        }

        if (data.id) {
            clients.set(data.id, ws);
            console.log(`Registered ESP32 with ID: ${data.id}`);
            console.log(`Connected ESP32 Clients: ${[...clients.keys()].join(', ')}`);

            // Send a test message to the ESP32
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    console.log(`📨 Sending test message to ESP32 (${data.id})`);
                    ws.send(JSON.stringify({ command: "turn_on" }));
                }
            }, 3000);

            return;
        }

        // Forward browser commands to ESP32 clients
        console.log(`📤 Forwarding message to ${clients.size} ESP32 clients...`);
        clients.forEach((client, key) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log(`📨 Sending to ESP32 (${key}):`, message);
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.forEach((value, key) => {
            if (value === ws) {
                console.log(`❌ Client ${key} disconnected`);
                clients.delete(key);
            }
        });
        console.log(`🔎 Remaining ESP32 Clients: ${[...clients.keys()].join(', ') || 'None'}`);
    });
});
