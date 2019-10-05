/* eslint-env node */

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const chokidar = require('chokidar');
const binFiles = require('./bin-files');

console.log('Initializing local Amiibo file list...');
binFiles.scan();
console.log('\tDONE');

chokidar.watch(binFiles.dir, {ignoreInitial: true}).on('all', (ev) => {
	if (['add', 'change', 'unlink'].includes(ev)) {
		console.log('Change detected, rescanning local Amiibo file list', ev);
		binFiles.scan();
		console.log('\tDONE');
	}
});

console.log('Starting server...');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)
const port = 80;

app.use('/', express.static(path.join(__dirname, 'dist')));

io.on('connection', function(socket){
	console.log('a user connected', socket.id);
});

server.listen(port, () => console.log(`PimiiboInteractive server listening on port ${port}!`))
