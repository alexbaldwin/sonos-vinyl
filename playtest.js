const { Sonos } = require('sonos')
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.7.131')

sonos.flush().then(result => {
  sonos.queue('https://archive.org/download/testmp3testfile/mpthreetest.mp3').then(result => {
    sonos.selectQueue()
    sonos.play()
  });
});
