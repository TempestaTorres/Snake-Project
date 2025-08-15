Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0;
};

Audio.prototype.restart= function() {
    this.pause();
    this.currentTime = 0;
    this.play();
};
export class AudioPlayer {
    constructor(player) {
        this._player = document.querySelector(player);
        this._audioContext = new AudioContext();
        this._gainNode = this._audioContext.createGain();
        this._gainNode.gain.value = 0.5;

        this._track = this._audioContext.createMediaElementSource(this._player);
        this._track.connect(this._gainNode).connect(this._audioContext.destination);
    }
    play() {
        this._player.play();
    }
    pause() {
        this._player.pause();
    }
    stop() {
        this._player.stop();
    }
}