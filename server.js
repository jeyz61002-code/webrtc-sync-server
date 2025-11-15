{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // server.js\
const WebSocket = require('ws');\
\
const PORT = process.env.PORT || 3000;\
const wss = new WebSocket.Server(\{ port: PORT \});\
\
wss.on('connection', function connection(ws) \{\
  ws.on('message', function incoming(message) \{\
    // Broadcast message to all clients except sender\
    wss.clients.forEach(function each(client) \{\
      if (client !== ws && client.readyState === WebSocket.OPEN) \{\
        client.send(message);\
      \}\
    \});\
  \});\
\
  ws.send(JSON.stringify(\{ message: 'Connected to signaling server' \}));\
\});\
\
console.log(`Signaling server running on port $\{PORT\}`);\
}