{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // server.js\
const express = require('express');\
const http = require('http');\
const \{ Server \} = require('socket.io');\
const path = require('path');\
\
const app = express();\
const server = http.createServer(app);\
\
const io = new Server(server, \{\
  cors: \{ origin: '*' \}\
\});\
\
app.use(express.static(path.join(__dirname, 'public')));\
\
// lightweight rooms map (no persistence) - fine for demo / small usage\
io.on('connection', socket => \{\
  console.log('socket connected', socket.id);\
\
  socket.on('join-room', (\{ room, role \}) => \{\
    socket.join(room);\
    socket.data.room = room;\
    socket.data.role = role;\
    console.log(`$\{socket.id\} joined $\{room\} as $\{role\}`);\
    socket.to(room).emit('peer-joined', \{ id: socket.id, role \});\
  \});\
\
  socket.on('signal', (\{ room, type, payload \}) => \{\
    // relay to others in room\
    socket.to(room).emit('signal', \{ from: socket.id, type, payload \});\
  \});\
\
  socket.on('disconnecting', () => \{\
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);\
    rooms.forEach(r => socket.to(r).emit('peer-left', \{ id: socket.id \}));\
  \});\
\
  socket.on('log', msg => console.log('client log:', msg));\
\});\
\
const PORT = process.env.PORT || 3000;\
server.listen(PORT, () => console.log(`Signaling server listening on :$\{PORT\}`));\
}