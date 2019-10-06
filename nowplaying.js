#!/usr/bin/env node

const Sonos = require('sonos').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.7.131')

// Get your radio station URL
sonos.currentTrack({}).then(track => {
  console.log('track %j', track.uri)
}).catch(err => { console.log('Error occurred %j', err) })

