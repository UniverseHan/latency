import { Track } from './track.js';
import TimeLine from './timeline.js';
import StopWatch from './stopwatch';

let audioStream;
let audioChunks = [];
let stopWatch = new StopWatch();
stopWatch.setUpdateHandler(onStopwatchUpdated);

navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => {
  console.log(stream);
  audioStream = stream;
});

var audioRecorder;
const tracks = [new Track('Channel 1')];
let selectedTrack = 0;
const STOPPED = 0;
const PLAYING = 1;
const RECORDING = 2;
let status = STOPPED;

function startRecord() {
  if (status === RECORDING) {
    console.warn('can not record.');
    return;
  }

  console.log('recording started');
  if (!audioStream) {
    console.error('audio stream is not initilized');
    return;
  }
  audioChunks = [];
  const audioSnippet = {
    startAt: stopWatch.getPosition()
  };
  audioRecorder = new MediaRecorder(audioStream);
  audioRecorder.start();
  audioRecorder.addEventListener('dataavailable', e => {
    audioChunks.push(event.data);
  });

  audioRecorder.addEventListener("stop", e => {
    console.info('Recording is stoping...');
    audioSnippet.endAt = stopWatch.getPosition();
    console.info(`snippet has been recorded at ${audioSnippet.startAt} - ${audioSnippet.endAt}.`);
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
  
    // update track with new recording
    const currentRecordingTrack = tracks[selectedTrack];
    currentRecordingTrack.recordedAt = Date.now();
    audioSnippet.recordedAt = Date.now();
    currentRecordingTrack.audio = audio;
    audioSnippet.audio = audio;
    currentRecordingTrack.addAudioSnippet(audioSnippet);

    stopWatch.stop();
    console.info('Recording stoped');
  });

  stopWatch.start();
  status = RECORDING;
}

function stopRecording() {
  console.info('Stop on channel clicked.');
  if (status === RECORDING) {
    console.info('Stop recording');
    status = STOPPED;
    tracks.forEach(track => track.pause());
    audioRecorder.stop();
  } else if (status === PLAYING) {
    tracks.forEach(track => track.pause());
    status = STOPPED;
    stopWatch.stop();
    stopWatch.reset();
  }
}

function pause() {
  tracks.forEach(track => track.pause());
  status = STOPPED;
  stopWatch.stop();
}

function refreshTrackList() {
  const trackListElement = document.getElementById('trackList');
  trackListElement.innerHTML = '';
  tracks.forEach((track, idx) => {
    console.log(track, idx);
    const trackElement = document.createElement('div');
    trackElement.addEventListener('click', () => onTrackClicked(idx));
    const label = document.createElement('span');
    label.innerText = track.name;
    trackElement.appendChild(label);

    const playButton = document.createElement('button');
    playButton.innerText = 'play';
    playButton.addEventListener('click', () => onPlayTrackClicked(idx));

    const recordButton = document.createElement('button');
    recordButton.innerText = 'record';
    recordButton.addEventListener('click', () => onRecordTrackClicked(idx));

    const stopButton = document.createElement('button');
    stopButton.innerText = 'stop';
    stopButton.addEventListener('click', () => onStopTrackClicked(idx));

    const muteButton = document.createElement('button');
    muteButton.innerText = 'mute';
    muteButton.addEventListener('click', () => onMuteTrackClicked(idx));
    
    trackElement.appendChild(playButton);
    trackElement.appendChild(stopButton);
    trackElement.appendChild(recordButton);
    trackListElement.appendChild(trackElement);
  });
}

function onTrackClicked(trackNumber) {
  console.log((trackNumber+1) + ' Track click!!!');
  selectedTrack = trackNumber;

  const selectedTrackElement = document.getElementById('selectedTrack');
  selectedTrackElement.innerText = 'Track '+ (trackNumber+1) + ' is selected.';
}

function onPlayTrackClicked(trackNumber) {
  const currentTrack = tracks[trackNumber];
  currentTrack.play();
}

function onStopTrackClicked(trackNumber) {
  stopRecording();
}

function onRecordTrackClicked() {
  startRecord();
}
let globalTimer;

function onStopwatchUpdated() {
  const timeView = document.getElementsByClassName("current-time-view")[0];
  timeView.innerText = timeStringFromMilliSeconds(stopWatch.getPosition());
  timeline.setPosition(stopWatch.getPosition()/1000);
  timeline.draw();

  if (status === PLAYING) {
    tracks.forEach(track => track.update(stopWatch.getPosition()));
  }
}

function playAllTracks() {
  console.info('Play all tracks clicked.');
  status = PLAYING;
  tracks.forEach(track => track.play(stopWatch.getPosition()));
  stopWatch.start();
}

function timeStringFromMilliSeconds(milliSeconds) {
  const seconds = Math.floor(milliSeconds / 1000) % 60;
  const minutes = Math.floor(milliSeconds / 60000) % 60;
  const hour = Math.floor(milliSeconds / (1000 * 3600));
  const time = [minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
  return [hour, time].join(':') + "." + (Math.floor(milliSeconds /100) % 10);
}

// TODO 녹음된 음원이 없는 트랙은 재생할 수 없다.
// TODO 녹음 중에는 선택된 트랙을 변경할 수 없다.
// TODO 녹음 중에는 새로운 녹음을 시작할 수 없다.

function newTrack() {
  tracks.push(new Track('Channel ' + (tracks.length + 1)));
  refreshTrackList();
}

window.newTrack = newTrack;
window.playAllTracks = playAllTracks;
window.stopRecording = stopRecording;
window.pause = pause;
let timeline; 

refreshTrackList();
function initTimeline() {
  const canvasForTimeline = document.getElementsByClassName('timeline')[0];
  timeline = new TimeLine(canvasForTimeline);
  timeline.draw();
}

initTimeline();