/* eslint-env node */

const path = require('path');
const express = require('express');
const app = express();
const port = 80;

app.use('/', express.static(path.join(__dirname, 'dist')))

app.listen(port, () => console.log(`PimiiboInteractive server listening on port ${port}!`))
