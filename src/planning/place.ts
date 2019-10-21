import { SportCounter } from '../sport/counter';

export class PlanningPlace {
    private nrInARow = 0;

    constructor(
        private sportCounter: SportCounter
    ) {
    }

    getSportCounter(): SportCounter {
        return this.sportCounter;
    }

    getNrOfGamesInARow(): number {
        return this.nrInARow;
    }

    toggleGamesInARow(toggle: boolean) {
        this.nrInARow = this.nrInARow + (toggle ? 1 : -1);
        if (this.nrInARow < 0) {
            this.nrInARow = 0;
        }
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
