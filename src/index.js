import { Track } from './track.js';

let audioStream;
let audioChunks = [];
navigator.mediaDevices.getUserMedia({audio: true})
.then(stream => {
  console.log(stream);
  audioStream = stream;
});

var audioRecorder;
const tracks = [new Track('Track 1')];
let selectedTrack = 0;

function startRecord() {
  if (!audioStream) {
    console.error('audio stream is not initilized');
    return;
  }

  audioChunks = [];

  console.log('start recording');
  audioRecorder = new MediaRecorder(audioStream);
  audioRecorder.start();
  audioRecorder.addEventListener('dataavailable', e => {
    audioChunks.push(event.data);
  });

  audioRecorder.addEventListener("stop", e => {
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
  
    // update track with new recording
    const currentRecordingTrack = tracks[selectedTrack];
    currentRecordingTrack.recordedAt = new Date();
    currentRecordingTrack.audio = audio;

    audio.play();
  })
}

function stopRecording() {
  audioRecorder.stop();
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
  if (!currentTrack.audio) {
    console.log('Track ' + (trackNumber+ 1) + ' 녹음된 음원 없음');
  }

  currentTrack.audio.play();
}

function onStopTrackClicked(trackNumber) {
  stopRecording();
}

function onRecordTrackClicked() {
  startRecord();
}

function playAllTracks() {
  tracks.filter(track => track.audio).forEach(track => track.audio.play());
}

// TODO 녹음된 음원이 없는 트랙은 재생할 수 없다.
// TODO 녹음 중에는 선택된 트랙을 변경할 수 없다.
// TODO 녹음 중에는 새로운 녹음을 시작할 수 없다.

function newTrack() {
  tracks.push(new Track('Track ' + (tracks.length + 1)));
  refreshTrackList();
}

window.newTrack = newTrack;
window.playAllTracks = playAllTracks;
window.stopRecording = stopRecording;

refreshTrackList();