const EventEmitter = require('events').EventEmitter
const {PimiiboEmitter} = require('bindings')('pimiibo_emitter');
const inherits = require('util').inherits

inherits(PimiiboEmitter, EventEmitter);

module.exports = PimiiboEmitter;

