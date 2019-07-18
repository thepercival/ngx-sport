import { Sport } from '../sport';

export class SportCounter {
    private done = false;
    private nrOfGamesDone: SportIdToNumberMap;

    constructor(
        private minNrOfGames: SportIdToNumberMap
    ) {
    }

    isDone(): boolean {
        return this.done;
    }

    isSportDone(sport: Sport): boolean {
        return this.nrOfGamesDone[sport.getId()] >= this.minNrOfGames[sport.getId()];
    }

    addGame(sportId: number) {
        if (this.nrOfGamesDone[sportId] === undefined) {
            this.nrOfGamesDone[sportId] = 0;
        }
        this.nrOfGamesDone[sportId]++;
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
