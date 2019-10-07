#!/usr/bin/env node

const obj = require('sonos')
const sonos = new obj.Sonos( '192.168.7.131')

const STREAM_URL = 'http://192.168.7.136:8000/rapi.mp3'
const radioUri = 'x-rincon-mp3radio://' + STREAM_URL
const defaultUri = 'x-sonos-htastream:RINCON_949F3ED5FC3E01400:spdif'

const Ffmpeg = require('fluent-ffmpeg')
const VOLUME_THRESHOLD = -50; // volume threshold

getMeanVolume(STREAM_URL, function(meanVolume){
  console.log(meanVolume);

  if(meanVolume <= VOLUME_THRESHOLD){
    console.log('❌ Nothing is playing.')

    getNowPlaying().then(nowPlaying => {
      if(nowPlaying == radioUri){
        console.log('❌ Stopping Sonos Radio')

        sonos.setAVTransportURI(defaultUri)
      }
    })

  }else{
    console.log('✅ Vinyl is spinning')

    getNowPlaying().then(nowPlaying => {
      if(nowPlaying != radioUri){
        console.log('✅ Starting Sonos Radio')

        sonos.flush().then(result => {
          sonos.queue(radioUri).then(result => {
            sonos.selectQueue()
            sonos.setVolume(36)
            sonos.play()
          });
        });
      }
    })

  }
});

function getNowPlaying(){
  let track = sonos.currentTrack({}).then(track => {
    return track.uri
  })

  return track
}

function getMeanVolume(streamUrl, callback){
  new Ffmpeg({ source: streamUrl })
    .withAudioFilter('volumedetect')
    .addOption('-f', 'null')
    .addOption('-t', '10') // duration
    .noVideo()
    .on('start', function(ffmpegCommand){
      console.log('Output the ffmpeg command:', ffmpegCommand);
    })
    .on('end', function(stdout, stderr){

      console.log(stderr);
      // find the mean_volume in the output
      let meanVolumeRegex = stderr.match(/mean_volume:\s(-\d+(\.\d+))/);

      // Show the regex results
      //console.log(meanVolumeRegex);

      // return the mean volume
      if(meanVolumeRegex){
        let meanVolume = parseFloat(meanVolumeRegex[1]);
        return callback(meanVolume);
      }

      // if the stream is not available
      if(stderr.match(/Server returned 404 Not Found/)){
        return callback(false);
      }
    })
    .saveToFile('/dev/null');
}
