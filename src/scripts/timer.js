export class Timer {
    constructor(fps) {
        this._fps = fps;
        this._interval = Math.floor(1000 / this._fps);
        this.init();
    }
    init() {
        this._startTime = performance.now();
        this._endTime = this._startTime;
        this._currentTime = 0;
        this._deltaTime = 0;
    }
    update(timestamp) {

        this._currentTime = timestamp;
        this._deltaTime = this._currentTime - this._endTime;
        let result = false;

        if (this._deltaTime > this._interval) {

            this._endTime = this._currentTime - (this._deltaTime % this._interval);
            result = true;
        }
        return result;
    }
}