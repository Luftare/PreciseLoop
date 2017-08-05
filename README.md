# PreciseLoop
PreciseLoop provides an alternative to the `setInterval` based loops with added functionality and control. PreciseLoop aims to fix some of the challenges of native JS loops, ie. the `setInterval`:
* Drifting of loops - `setInterval(() => {}, 100);` likely hasn't looped exactly 600 times after 1 minute
* Loop time is inaccurate and mostly delayed
* Looping time cannot be changed on the fly
* `setInterval(() => {}, 100);` cannot be paused and restarted
* Actual time between the cycles is not natively provided

PreciseLoop checks wether it's time to execute the next cycle call multiple times during the timeout of the loop to increase accuracy. It also dynamically schedules upcoming cycles to catch up any occured positive or negative drift. Actual delta times do alter with the same accuracy as with regular `setInterval` but long period drift is prevented.
## How to install
```html
<script src="PreciseLoop.js"></script>
```
## Examples
Set up a loop. Provide an options object where the `onTick` is the function to be called on each cycle.
```javascript
let loop = new PreciseLoop({
  dt: 20,
  onTick(dt) {
    console.log(dt);//time of previous cycle in ms
  }
});
```
### Starting and stopping
```javascript
loop.start();
setTimeout(loop.stop, 1000);//stop loop after 1s
setTimeout(loop.start, 2000);//start loop again after 2s
```
### Options
```javascript
let options = {
  FPS: 60,//alternative to the dt property - provide frames per second (FPS)
  dt: 16,//alternative to the FPS - provide target time between two cycles
  skipMissed: true,//prevents catching up of dramatically delayed calls hence allowing drift to occur
  autoStart: true,//starts the loop automatically
};

let loop = new PreciseLoop(options);
```
### Getters and setters
Get and set either the FPS or dealt time (dt) format while both change the frequency of the loop.
```javascript
loop.FPS = 1;//loops once per second --> dt is 1000ms
console.log(loop.FPS, loop.dt);//--> 1, 1000
loop.dt = 16;//sets the looping delta time to 16ms
console.log(loop.FPS, loop.dt);//--> 60, 16
console.log(loop.lastDt);//Actual time of the last cycle in ms. Since timeouts are inaccurate in JS in general, loop.lastDt is often 0...5ms away from the targeted time. Most of the time delayed.
```
Use the `running` property to check if the loop is running.
```javascript
console.log(loop.running);//false
loop.start();
console.log(loop.running);//true
```
### Offset
Since PreciseLoop doesn't drift, the concept of offset becomes relevant. Starting two loops simultaneously on two machines geographically far away from each other might introduce need for synchronizing two loops so that they are actually running both in same frequency and in same phase. `addOffset` provides a way to change the phase of the loop to for example synchronize two loops.
```javascript
loop.addOffset(50);//delays the loop for 50ms yet maintaining the overall frequency
```
