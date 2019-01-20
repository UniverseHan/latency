export class Track
{
  constructor(name) {
    this.name = name;
    this.isMuted = false;
    this.audioSnippets = [];
  }

  mute() {
    this.isMuted = true;
  }

  unMute() {
    this.isMuted = false;
  }

  addAudioSnippet(audioSnippet) {
    this.audioSnippets.push(audioSnippet);
  }

  play(startTime) {
    if (!this.audio) {
      console.log(`${this.name} 녹음된 음원 없음`);
      return;
    }

    let currentTime = startTime;
    if (!currentTime) {
      currentTime = 0;
    }

    let nearestSnippet = this.getNearestToPlay(currentTime);
    if (nearestSnippet) {
      console.log('started snippet',nearestSnippet);
      
      console.log('started', startTime, 'starts', nearestSnippet.startAt);
      console.log(startTime - nearestSnippet.startAt);

      nearestSnippet.audio.play();
      nearestSnippet.audio.currentTime = (startTime - nearestSnippet.startAt)/1000;

      this.playingSnippet = nearestSnippet;
    }
  }

  stop() {
    if (!this.playingSnippet) {
      return;
    }

    this.playingSnippet.audio.pause();
    this.playingSnippet.audio.currentTime = 0;
    delete this.playingSnippet;
  }

  pause() {
    if (!this.playingSnippet) {
      return;
    }

    this.playingSnippet.audio.pause();
    this.playingSnippet.audio.currentTime = 0;
    delete this.playingSnippet;
  }

  update(currentTime) {
    const snipetToPlay = this.getNearestToPlay(currentTime);
    if (snipetToPlay && snipetToPlay !== this.playingSnippet) {
      if (this.playingSnippet) { 
        this.playingSnippet.audio.pause();
      }

      snipetToPlay.audio.play();
      snipetToPlay.audio.currentTime = (currentTime - snipetToPlay.startAt)/1000;
      this.playingSnippet = snipetToPlay;
    }
  }

  getNearestToPlay(currentTime) {
    let nearestSnippet;
    this.audioSnippets.forEach(audioSnippet => {
      if (currentTime > audioSnippet.endAt) {
        return;
      }

      if (currentTime  < audioSnippet.startAt) {
        return;
      }

      if (!nearestSnippet) {
        nearestSnippet = audioSnippet;
        return;
      }

      if (audioSnippet.recordedAt >  nearestSnippet.recordedAt) {
        nearestSnippet = audioSnippet;
      }
    });

    return nearestSnippet;
  }
}