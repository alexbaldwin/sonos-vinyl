#!/usr/bin/env node

const { Sonos } = require('sonos')

const device = new Sonos('192.168.7.131');

device.play()
  .then(() => console.log('now playing'))

device.getVolume()
  .then((volume) => console.log(`current volume = ${volume}`))
