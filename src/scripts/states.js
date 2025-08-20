export class StateManager {
    constructor() {
        this._states = [];
        this._currentState = 0;
        this._nextState = 0;
    }
    registerState(state, callback) {
        let newState = {
            state: state,
            callback: callback
        };
        this._states.push(newState);
    }
    setCurrentState(state) {
        this._currentState = state;
    }
    setNextState(nextState) {
        this._nextState = nextState;
    }
    stateUpdate(timestamp) {

        if (this._nextState > 0) {
            this._currentState = this._nextState;
            this._nextState = 0;
        }
        if (this._currentState > 0) {
            let state = this._states[this._currentState - 1];
            state.callback(timestamp);
        }
    }
    getCurrentState() {
        return this._currentState;
    }
    isNextState() {
        return this._nextState !== 0;
    }
}