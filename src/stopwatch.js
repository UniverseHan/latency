export default class StopWatch
{
  constructor() {    
    this.positionInMilliSeconds = 0;
    this.interval = 30;
  }

  start() {
    if (this.started()) {
      console.info('already started.');
      return;
    }

    this.timer = setInterval(() => {
      this.positionInMilliSeconds += this.interval;
      this.dispatchUpdated();
    }, this.interval);
    console.info('watch started');
    this.dispatchUpdated();
  }

  stop() {
    if (!this.started()) {
      console.info('Watch did not start.');
      return;
    }

    clearInterval(this.timer);
    delete this.timer;

    console.log('watch stopped.');
    this.dispatchUpdated();
  }

  getPosition() {
    return this.positionInMilliSeconds;
  }

  reset() {
    this.positionInMilliSeconds = 0;
    this.dispatchUpdated();
  }

  started() {
    return !!this.timer;
  }

  setUpdateHandler(handler) {
    if (!handler) {
      return;
    }
    this.updateHandler = handler;
  }

  dispatchUpdated() {
    this.updateHandler && this.updateHandler();
  }
}