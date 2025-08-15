export class Hud {
    constructor() {
        this._score = document.querySelector(".hud-score");
        this._status = document.querySelector(".hud-status");
    }
    update(status, score) {
        this._score.textContent = "Score: " + score;
        let state = "State: ";
        this._status.dataset.nodeType = "";

        switch (status) {
            case 1:
                this._status.textContent = state + "Ready...";
                break;
            case 2:
                this._status.textContent = state + "Playing";
                break;
            case 3:
                this._status.textContent = state + "Paused";
                break;
            case 5:
                this._status.textContent = state + "Game Over";
                this._status.dataset.nodeType = "game over";
                break;
        }
    }
}