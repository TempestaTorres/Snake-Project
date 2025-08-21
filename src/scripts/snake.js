import {Fruit} from "./fruit.js";
import {AudioPlayer} from "./audio.js";
import {Timer} from "./timer.js";

export class Snake {
    constructor(field, step, speed) {

        this._step = step;
        this._field = field;
        this._fillColor = "#ffb02f";
        this._initialSpeed = speed;
        this._minSpd = 1;
        this._fruit = new Fruit(field, step);
        this._pickup = new AudioPlayer(".audio-pickups");

        this._timer = new Timer(0.1);
        this._tail = [];

    }
    init() {
        this._timer.init();
        this._speed = this._initialSpeed;
        this._spd = this._speed;
        this.score = 0;
        this._exist = true;
        this._spawned = false;
        this._fruit.reset();
        //clear field
        let rows = this._field.length;
        let cols = this._field[0].length;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                let cell = this.#getCell(row, col);
                cell.id = 0;
            }
        }
        //Head init
        let dir = Math.floor(Math.random() * 3);

        this._head = {
            row: this._field.length / 2 - 1,
            col: this._field[0].length / 2 - 1,
            prevRow: this._field.length / 2 - 1,
            prevCol: this._field[0].length / 2 - 1,
            direction: dir,
        };

        let headCell = this.#getCell(this._head.row, this._head.col);
        headCell.id = 1;

        //Tail init

        let length = this._tail.length;

        if (length > 0) {
            for (let i = 0; i < length; i++) {
                this._tail.pop();
            }
        }

        for (let i = 1; i < 2; i++) {

            let tailCell = {
                row: this._head.row,
                col: this._head.col - i,
                prevRow: this._head.row,
                prevCol: this._head.col - i,
            }
            let cell = this.#getCell(tailCell.row, tailCell.col);
            cell.id = 1;

            this._tail.push(tailCell);
        }
    }
    move(direction) {

        if (direction >= 0 && direction <= 3) {
            this._head.direction = direction;
        }
    }
    render(ctx) {
        //Draw Head
        let headCell = this.#getCell(this._head.row, this._head.col);
        ctx.fillStyle = this._fillColor;
        //ctx.fillRect(headCell.x, headCell.y, this._step, this._step);
        ctx.beginPath();
        ctx.arc(headCell.x + this._step / 2, headCell.y + this._step / 2, this._step / 2, 0, Math.PI * 2, true);
        ctx.fill();

        //Draw tail

        for (let i = 0; i < this._tail.length; i++) {
            let tailCell = this.#getCell(this._tail[i].row, this._tail[i].col);
            ctx.fillStyle = this._fillColor;
            ctx.beginPath();
            ctx.arc(tailCell.x + this._step / 2, tailCell.y + this._step / 2, this._step / 2 - 2, 0, Math.PI * 2, true);
            ctx.fill();
        }
        // Draw Fruit
        this._fruit.render(ctx);
    }
    update(timestamp) {

        this.#speedUpdate(timestamp);

        if (--this._spd <= 0) {
            //Update Snake
            this._spd = this._speed;
            this.#headUpdate();

            //Spawn Fruit
            if (!this._spawned && this._exist) {
                this.#spawnFruit();
            }
            //Update Fruit
            this._fruit.update(timestamp);
        }
    }
    #headUpdate() {

        switch (this._head.direction) {
            case 0:
                //Moving Up
                if (this.#isEntity(this._head.row - 1, this._head.col)) {

                    this._head.row -= 1;
                    this.#eatFruit(this._head.row, this._head.col);
                    this.#tailGrow();
                }
                else if (this.#isCellEmpty(this._head.row - 1, this._head.col)) {

                    this._head.row -= 1;
                    this.#setId(this._head.row, this._head.col);
                    this.#tailUpdate();
                }
                else {
                    this.#setDie(this._head.row, this._head.col);
                }
                break;
            case 1:
                //Moving right
                if (this.#isEntity(this._head.row, this._head.col + 1)) {

                    this._head.col += 1;
                    this.#eatFruit(this._head.row, this._head.col);
                    this.#tailGrow();
                }
                else if (this.#isCellEmpty(this._head.row, this._head.col + 1)) {

                    this._head.col += 1;
                    this.#setId(this._head.row, this._head.col);
                    this.#tailUpdate();
                }
                else {
                    this.#setDie(this._head.row, this._head.col);
                }
                break;
            case 2:
                //Moving down
                if (this.#isEntity(this._head.row + 1, this._head.col)) {

                    this._head.row += 1;
                    this.#eatFruit(this._head.row, this._head.col);
                    this.#tailGrow();
                }
                else if (this.#isCellEmpty(this._head.row + 1, this._head.col)) {

                    this._head.row += 1;
                    this.#setId(this._head.row, this._head.col);
                    this.#tailUpdate();
                }
                else {
                    //Game Over
                    this.#setDie(this._head.row, this._head.col);
                }
                break;
            case 3:
                //Moving left
                if (this.#isEntity(this._head.row, this._head.col - 1)) {

                    this._head.col -= 1;
                    this.#eatFruit(this._head.row, this._head.col);
                    this.#tailGrow();
                }
                else if (this.#isCellEmpty(this._head.row, this._head.col - 1)) {

                    this._head.col -= 1;
                    this.#setId(this._head.row, this._head.col);
                    this.#tailUpdate();
                }
                else {
                    this.#setDie(this._head.row, this._head.col);
                }
                break;
        }
    }
    #tailUpdate() {

        this._tail[0].row = this._head.prevRow;
        this._tail[0].col = this._head.prevCol;

        this._head.prevRow = this._head.row;
        this._head.prevCol = this._head.col;

        let last = this._tail.length - 1;

        for (let i = 0; i < last; i++) {

            this._tail[i+1].row = this._tail[i].prevRow;
            this._tail[i+1].col = this._tail[i].prevCol;

            this._tail[i].prevRow = this._tail[i].row;
            this._tail[i].prevCol = this._tail[i].col;
        }
        let cell = this.#getCell(this._tail[last].prevRow, this._tail[last].prevCol);
        cell.id = 0;

        this._tail[last].prevRow = this._tail[last].row;
        this._tail[last].prevCol = this._tail[last].col;
    }
    #tailGrow() {

        this._tail[0].row = this._head.prevRow;
        this._tail[0].col = this._head.prevCol;

        this._head.prevRow = this._head.row;
        this._head.prevCol = this._head.col;

        let last = this._tail.length - 1;

        for (let i = 0; i < last; i++) {

            this._tail[i+1].row = this._tail[i].prevRow;
            this._tail[i+1].col = this._tail[i].prevCol;

            this._tail[i].prevRow = this._tail[i].row;
            this._tail[i].prevCol = this._tail[i].col;
        }

        let tailCell = {
            row: this._tail[last].prevRow,
            col: this._tail[last].prevCol,
            prevRow: this._tail[last].prevRow,
            prevCol: this._tail[last].prevCol,
        }

        this._tail[last].prevRow = this._tail[last].row;
        this._tail[last].prevCol = this._tail[last].col;

        this._tail.push(tailCell);

    }
    #speedUpdate(timestamp) {

        if (this._timer.update(timestamp)) {

            if (--this._speed <= this._minSpd) {
                this._speed = this._initialSpeed;
            }
            this._spd = this._speed;
        }
    }
    #getCell(row, col) {

        let headRow = this._field[row];
        return headRow[col];
    }
    #isCellEmpty(row, col) {

        if (row < 0 || row >= this._field.length ) {
            return false;
        }
        let headRow = this._field[row];

        if (col < 0 || col >= headRow.length ) {
            return false;
        }
        return headRow[col].id === 0;
    }
    #isEntity(row, col) {

        if (row < 0 || row >= this._field.length ) {
            return false;
        }
        let cellRow = this._field[row];

        if (col < 0 || col >= cellRow.length ) {
            return false;
        }
        return cellRow[col].id > 1;
    }
    #spawnFruit() {
        //Spawn fruit
        if (this._exist) {
            this._fruit.spawn();
            this._spawned = true;
        }
    }

    isDead() {
        return !this._exist;
    }
    #setId(row, col) {
        let cell = this.#getCell(row, col);
        cell.id = 1;
    }
    #eatFruit(row, col) {
        let cell = this.#getCell(row, col);
        cell.id = 1;

        this.score += this._fruit.value;
        this._fruit.reset();
        this._spawned = false;
        this._pickup.play();
    }
    #setDie(row, col) {
        let cell = this.#getCell(row, col);
        cell.id = -1;
        this._exist = false;

        if (this._spawned) {
            this._spawned = false;
            this._fruit.reset();
        }
    }
}