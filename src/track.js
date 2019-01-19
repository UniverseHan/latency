export class Track
{
  constructor(name) {
    this.name = name;
    this.isMuted = false;
  }

  mute() {
    this.isMuted = true;
  }

  unMute() {
    this.isMuted = false;
  }
}