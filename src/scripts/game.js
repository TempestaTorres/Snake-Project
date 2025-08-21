import {Snake} from "./snake.js";
import {KeyboardManager} from "./keyboard.js";
import {StateManager} from "./states.js";
import {Hud} from "./hud.js";
import {AudioPlayer} from "./audio.js";
import {Timer} from "./timer.js";
import defines from "./defines.js";

export class Game {
    constructor(canvas, cellSize) {
        console.log('Happy developing ✨');

        this._timer = new Timer(defines.FPS);

        this._stateReady = false;
        this._stateGameOver = false;
        this._statePause = false;

        this._canvas = document.querySelector(canvas);
        this._ctx = this._canvas.getContext('2d');

        this._cellSize = cellSize;
        this.#fieldInit();

        this._snake = new Snake(this._field, this._cellSize, 30);

        this._keyboardManager = new KeyboardManager();

        this._stateManager = new StateManager();
        this._stateManager.registerState(defines.STATE_READY, this.#ready.bind(this));
        this._stateManager.registerState(defines.STATE_PLAY, this.#play.bind(this));
        this._stateManager.registerState(defines.STATE_PAUSE, this.#pause.bind(this));
        this._stateManager.registerState(defines.STATE_RESTART, this.#restart.bind(this));
        this._stateManager.registerState(defines.STATE_GAMEOVER, this.#gameOver.bind(this));

        this._stateManager.setNextState(defines.STATE_READY);

        this._hud = new Hud();

        document.querySelector("#btn-play").addEventListener("click", this.buttonPlayClick.bind(this));
        document.querySelector("#btn-pause").addEventListener("click", this.buttonPauseClick.bind(this));
        document.querySelector("#btn-restart").addEventListener("click", this.buttonRestartClick.bind(this));

        this._player = new AudioPlayer(".audio");
        this._gameOver = new AudioPlayer(".audio-game-over");
    }
    #fieldInit() {
        this._field = [];

        let cols = this._canvas.width / this._cellSize;
        let rows = this._canvas.height / this._cellSize;

        console.log("Rows: " + rows + " cols: " + cols);

        for (let row = 0; row < rows; row++) {

            let fieldRow = [];

            for (let col = 0; col < cols; col++) {

                let cell = {
                    id: 0,
                    x: col * this._cellSize,
                    y: row * this._cellSize,
                };

                fieldRow.push(cell);
            }

            this._field.push(fieldRow);
        }

    }
    loop() {

        requestAnimationFrame(this.#gameLoop.bind(this));
    }
    // Main Game Loop
    #gameLoop(timestamp) {

        if (this._timer.update(timestamp)) {

            this._stateManager.stateUpdate(timestamp);

            this.#controller();
        }
        requestAnimationFrame(this.#gameLoop.bind(this));
    }

    #ready(timestamp) {

        if (!this._stateReady) {
            this._snake.init();
            this._stateReady = true;
            this.#render();
        }
    }

    #restart(timestamp) {
        this._stateReady = false;
        this._stateGameOver = false;
        this._timer.init();
        this._stateManager.setNextState(defines.STATE_READY);
    }

    #play(timestamp) {

        //Input
        this.#input();
        //Update
        this.#update(timestamp);
        // Render
        this.#render();
    }

    #pause(timestamp) {
        if (!this._statePause) {
            this._statePause = true;

            console.log("Paused");

            this.#render();

            this._ctx.font = "48px serif";
            this._ctx.fillStyle = "#fff7eb";
            this._ctx.fillText("Paused", 240, 240);
        }
    }

    #gameOver(timestamp) {

        if (!this._stateGameOver) {
            this._stateGameOver = true;

            console.log("Game Over");

            this.#render();

            this._ctx.font = "48px serif";
            this._ctx.fillStyle = "#e30d0d";
            this._ctx.fillText("Game Over", 200, 240);
        }
    }

    #input() {

        if (this._keyboardManager.isKeyPressed(defines.KEY_W)) {
            console.log("Key W Pressed");
            this._snake.move(0);
        }
        else if (this._keyboardManager.isKeyPressed(defines.KEY_D)) {
            console.log("Key D Pressed");
            this._snake.move(1);
        }
        else if (this._keyboardManager.isKeyPressed(defines.KEY_S)) {
            console.log("Key S Pressed");
            this._snake.move(2);
        }
        else if (this._keyboardManager.isKeyPressed(defines.KEY_A)) {
            console.log("Key A Pressed");
            this._snake.move(3);
        }
    }

    #update(timestamp) {

        this._snake.update(timestamp);

        this._keyboardManager.reset();
    }

    #render() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._snake.render(this._ctx);
    }
    #controller() {

        this._hud.update(this._stateManager.getCurrentState(), this._snake.score);

        if (this._snake.isDead() && this._stateManager.getCurrentState() === defines.STATE_PLAY) {
            this._stateManager.setNextState(defines.STATE_GAMEOVER);
            this._player.stop();
            this._gameOver.play();
        }
    }
    buttonPlayClick(e) {
        e.preventDefault();

        if (this._stateManager.getCurrentState() === defines.STATE_READY) {
            this._stateManager.setNextState(defines.STATE_PLAY);
            this._player.play();
        }
    }
    buttonPauseClick(e) {
        e.preventDefault();

        if (this._stateManager.getCurrentState() === defines.STATE_PLAY) {
            this._stateManager.setNextState(defines.STATE_PAUSE);
            this._player.pause();
        }
        else if (this._stateManager.getCurrentState() === defines.STATE_PAUSE) {
            this._stateManager.setNextState(defines.STATE_PLAY);
            this._statePause = false;
            this._player.play();
        }
    }
    buttonRestartClick(e) {
        e.preventDefault();

        if (this._stateManager.getCurrentState() === defines.STATE_GAMEOVER) {
            this._stateManager.setNextState(defines.STATE_RESTART);
            this._player.stop();
        }
    }
}