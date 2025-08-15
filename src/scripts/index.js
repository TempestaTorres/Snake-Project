import {Game} from "./game.js";

document.addEventListener('DOMContentLoaded', () => {
    "use strict";
    const game = new Game(".game-canvas", 16);

    game.loop();
});
