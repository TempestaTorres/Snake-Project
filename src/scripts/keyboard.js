export class KeyboardManager {
    constructor() {
        this._keys = [];
        for (let i = 0; i < 255; ++i) {
            this._keys.push(false);
        }

        addEventListener("keydown", this.#onkeydown.bind(this));
        addEventListener("keyup", this.#onkeyup.bind(this));
    }
    reset() {
        for (let key in this._keys) {
            key = false;
        }
    }
    isKeyPressed(keyCode) {
        return this._keys[keyCode];
    }
    #onkeydown(e) { this._keys[e.keyCode] = true;}
    #onkeyup(e) { this._keys[e.keyCode] = false; }
}