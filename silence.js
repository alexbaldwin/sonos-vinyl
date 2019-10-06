#!/usr/bin/env node

const Sonos = require('sonos').Sonos
const sonos = new Sonos(process.env.SONOS_HOST || '192.168.7.131')

const STREAM_URL = 'http://192.168.7.136:8000/rapi.mp3'
const radioUri = 'x-rincon-mp3radio://' + STREAM_URL

const Ffmpeg = require('fluent-ffmpeg')
const VOLUME_THRESHOLD = -50; // volume threshold

// TODO: Figure out how to compare current playing track and STREAM_URL. Be more intelligent about telling the Sonos to play / stop in the right cases
// async function getCurrentTrack() {
//   let track = await sonos.currentTrack({}).then(track => {
//     // console.log('Now playing: %j', track.uri)
//     return track.uri
//   }).then(result){
//   }
//   return track
// }

getMeanVolume(STREAM_URL, function(meanVolume){
  console.log(meanVolume);

  if(meanVolume <= VOLUME_THRESHOLD){
    console.log('❌ Nothing is playing.')
  }else{
    console.log('✅ Vinyl is spinning')
  // Play radio station
  sonos.play(radioUri).then(success => {
    console.log('Playing...')
  }).catch(err => { console.log('Error occurred %j', err) })
    }
});

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
