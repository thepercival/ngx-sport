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

    isSportDone(sportId: number): boolean {
        return this.nrOfGamesDone[sportId] >= this.minNrOfGames[sportId];
    }

    addGame(sportId: number) {
        if ( this.nrOfGamesDone[sportId] === undefined ) {
            this.nrOfGamesDone[sportId] = 0;
        }
        this.nrOfGamesDone[sportId]++;
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
