#!/usr/bin/env node

const Sonos = require('sonos').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.7.131')
const radioUri = 'x-rincon-mp3radio://http://192.168.7.136:8000/rapi.mp3'


// Get your radio station URL
sonos.getFavoritesRadioStations({}).then(radioStations => {
  console.log('Got current radioStations %j', radioStations)
}).catch(err => { console.log('Error occurred %j', err) })

// Play radio station
sonos.play(radioUri).then(success => {
  console.log('Playing...')
}).catch(err => { console.log('Error occurred %j', err) })

