/* eslint-env node */

const fs = require('fs');
const os = require('os');
const path = require('path');
const glob = require('glob');
const request = require('request');

const dir = path.join(process.env.APPDATA || os.homedir(), '.pimiibo');
let cache = new Set();
let writing = new Set();

function scan() {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	cache.clear();
	try {
		const found = glob.sync('**/*', {
			cwd: dir,
			absolute: false,
			nodir: true
		});
		cache = new Set(found);
	} catch(e) {
		// glob error, do nothing
	}
}

function resolve(url) {
	const file = path.basename(url);
	if (cache.has(file)) {
		return file;
	} else {
		if (!writing.has(file)) {
			writing.add(file);
			request(url)
				.pipe(fs.createWriteStream(path.join(dir, file)))
				.on('finish', () => {
					writing.delete(file);
					cache.add(file);
				});
		}
		return url;
	}
}

scan();

module.exports = {
	dir,
	resolve,
	scan
};
