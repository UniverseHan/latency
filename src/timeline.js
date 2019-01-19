import { getRetinaRatioOf } from './hdpi';

export default class TimeLine
{
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.position = 0;
    this.max = 60;
    this.width = 1000;
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.draw();
    });
  }

  resize() {
    const devicePixelRatio = getRetinaRatioOf(this.canvas);
    this.canvas.width = this.canvas.offsetWidth * devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * devicePixelRatio;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
  }

  setPosition(seconds) {
    this.position = seconds;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = "green";

    const x = this.width * (this.position/this.max);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillRect(x, 0, 2, this.height);
  }

  drawBorder() {
    ctx.fillStyle = "Blue";
    ctx.strokeRect(0, 0, this.width, 20);
  }
}