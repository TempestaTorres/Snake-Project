import {Timer} from "./timer.js";

export class Fruit {
    constructor(field, step) {
        this._field = field;
        this._type = 0;
        this._row = 0;
        this._col = 0;
        this._step = step;
        this._spawned = false;
        this._readyToSpawn = false;
        this._delay = 10;
        this._prevDelay = this._delay;
        this._timer = new Timer(1);
    }
    spawn() {
        this._timer.init();
        this._readyToSpawn = true;
    }
    render(ctx) {

        if (this._spawned) {

            if (--this._prevDelay > 0) {

                let cell = this.#getCell(this._row, this._col);
                ctx.fillStyle = this._fillColor;
                ctx.beginPath();
                ctx.arc(cell.x + this._step / 2, cell.y + this._step / 2, this._step / 2 - 2, 0, Math.PI * 2, true);
                ctx.fill();

            }
            else {
                this._prevDelay = this._delay;
            }
        }
    }
    update(timestamp) {

        if (this._readyToSpawn && this._timer.update(timestamp)) {

            let result = false;

            this._type = Math.floor(Math.random() * 3) + 1;
            this.value = this._type * 10;

            let rows = this._field.length;
            let cols = this._field[0].length;

            while (!result) {

                let row = Math.floor(Math.random() * rows);
                let col = Math.floor(Math.random() * cols);

                let cell = this.#getCell(row, col);

                if (cell.id === 0) {

                    cell.id = this.value;
                    this._row = row;
                    this._col = col;

                    result = true;
                }
            }

            switch (this._type) {
                case 1:
                    this._fillColor = "green";
                    break;
                case 2:
                    this._fillColor = "blue";
                    break;
                case 3:
                    this._fillColor = "red";
                    break;
            }
            this._spawned = true;
            this._readyToSpawn = false;
        }
    }
    reset() {
        this._spawned = false;
        this._type = 0;
        this._row = 0;
        this._col = 0;
    }
    #getCell(row, col) {

        let cellRow = this._field[row];
        return cellRow[col];
    }
}