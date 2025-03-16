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
    
        // ✅ If ESP32 is sending an ID, register it properly
        if (data.id) {
            clients.set(data.id, ws);  // 🔥 Make sure ESP32 gets stored!
            console.log(`✅ Registered ESP32 with ID: ${data.id}`);
            console.log(`Currently connected ESP32 clients: ${[...clients.keys()].join(', ')}`);
            return;
        }
    
        // ✅ Debugging: Log all ESP32 clients before forwarding
        console.log(`📋 Connected ESP32 Clients: ${[...clients.keys()].join(', ')}`);
    
        if (clients.size === 0) {
            console.error("🚨 No ESP32 clients connected! Cannot forward message.");
            return;
        }
    
        // ✅ Forward message to ESP32
        clients.forEach((client, key) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log(`📨 Sending to ESP32 (${key}):`, data);
                client.send(JSON.stringify(data));
            } else {
                console.error(`⚠️ ESP32 (${key}) is not open! Removing from list.`);
                clients.delete(key);
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
