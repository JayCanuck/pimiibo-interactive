/* eslint-env node */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dir = path.join(__dirname, '..', 'amiibo');
const binFiles = new Map();

function scan() {
	binFiles.clear();
	try {
		const found = glob.sync('**/*.bin', {
			cwd: dir,
			ignore: 'key_retail.bin',
			absolute: true,
			nodir: true
		});
		found.forEach(f => {
			try {
				const fd = fs.openSync(f, 'r', 0o666);
				const buf = Buffer.alloc(8)
				fs.readSync(fd, buf, 0, 8, 84);
				fs.closeSync(fd);
				binFiles.set(buf.toString('hex'), f);
			} catch(e) {
				// fs error, do nothing
			}
		});
	} catch(e) {
		// glob error, do nothing
	}
}

function lookup(key) {
	return binFiles.get(key);
}

scan();

module.exports = {
	dir,
	scan,
	lookup
};
