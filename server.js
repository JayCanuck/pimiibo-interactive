/* eslint-env node */

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server)
const port = 80;

app.use('/', express.static(path.join(__dirname, 'dist')));

io.on('connection', function(socket){
	console.log('a user connected', socket.id);
});

server.listen(port, () => console.log(`PimiiboInteractive server listening on port ${port}!`))
