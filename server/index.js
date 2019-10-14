/* eslint-env node */

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const chokidar = require('chokidar');
const dumps = require('./dumps');
const cache = require('./cache');

chokidar.watch(dumps.dir, {ignoreInitial: true}).on('all', (ev) => {
	if (['add', 'change', 'unlink'].includes(ev)) {
		console.log('Change detected, rescanning local Amiibo file list', ev);
		dumps.scan();
		console.log('\tDONE');
	}
});

console.log('Starting server...');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)
const port = 80;

const staticServer = express.static(path.join(__dirname, '..', 'dist'))
const cacheServer = express.static(cache.dir)
app.use('/', function(req, res, next) {
	if (req.query.cache) {
		const resolved = cache.resolve(req.query.cache);
		if (resolved.startsWith('http')) {
			res.redirect(302, resolved);
		} else {
			req.url = resolved;
			cacheServer(req, res, next)
		}
	} else {
		staticServer(req, res, next);
	}
});

io.on('connection', function(socket){
	console.log('a user connected', socket.id);
});

server.listen(port, () => console.log(`PimiiboInteractive server listening on port ${port}!`))
