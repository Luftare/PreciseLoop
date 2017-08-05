class PreciseLoop {
  constructor({dt = 1000 / 60, onTick = function(){}, requestTimeFactor = 0.6, skipMissed = false, autoStart = false}) {
    this.targetDt = dt;
    this.onTick = onTick;
    this.nextTick = 0;
    this.running = false;
    this.tickId = 0;
    this.lastDt = 0;
    this.then = 0;
    this.requestCount = 0;
    this.requestTimeFactor = requestTimeFactor;
    this.skipMissed = skipMissed;
    if(autoStart) this.start();
  }
  
  get dt() {
    return this.targetDt;
  }
  
  get FPS() {
    return 1000 / this.targetDt;
  }
  
  set dt(val) {
    this.targetDt = val;
  }
  
  set FPS(val) {
    this.targetDt = 1000/val;
  }
  
  requestTick() {
    const now = Date.now();
    const timeLeft = this.nextTick - now;
    this.requestCount += 1;
    if(timeLeft <= 0){
      this.lastDt = now - this.then;
      this.then = now;
      this.nextTick = this.nextTick + this.targetDt;
      
      if(this.skipMissed && this.nextTick - now <= 0){
        this.nextTick = now + this.targetDt;
      }
      
      this.onTick(this.lastDt, this.targetDt, this.requestCount);
      
      const newTimeLeft = this.nextTick - now;
      const delay = Math.max(newTimeLeft * this.requestTimeFactor, 0);
      this.tickId = setTimeout(this.requestTick.bind(this), delay);
      this.requestCount = 0;
    } else {
      const delay = Math.max(timeLeft * this.requestTimeFactor, 0);
      this.tickId = setTimeout(this.requestTick.bind(this), delay);
    }
  }
  
  addOffset(t) {
    this.nextTick += t;
  }
  
  start() {
    if(this.running) return;
    const now = Date.now();
    this.running = true;
    this.nextTick = now;
    this.then = now - this.targetDt;
    this.requestTick();
  }
  
  stop() {
    this.running = false;
    clearTimeout(this.tickId);
  }
}
