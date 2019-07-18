import { Sport } from '../sport';
import { SportPlanningConfig } from './planningconfig';

export class SportCounter {
    private done = false;
    private minNrOfGamesMap: SportIdToNumberMap = {}
    private nrOfGamesDoneMap: SportIdToNumberMap = {};

    constructor(
        minNrOfGamesMap: SportIdToNumberMap,
        sportPlanningConfigs: SportPlanningConfig[]
    ) {
        sportPlanningConfigs.forEach(sportPlanningConfig => {
            const sportId = sportPlanningConfig.getSport().getId();
            this.minNrOfGamesMap[sportId] = minNrOfGamesMap[sportId];
            this.nrOfGamesDoneMap[sportId] = 0;
        });
    }

    isDone(): boolean {
        return this.done;
    }

    isSportDone(sport: Sport): boolean {
        return this.nrOfGamesDoneMap[sport.getId()] >= this.minNrOfGamesMap[sport.getId()];
    }

    addGame(sport: Sport) {
        if (this.nrOfGamesDoneMap[sport.getId()] === undefined) {
            this.nrOfGamesDoneMap[sport.getId()] = 0;
        }
        this.nrOfGamesDoneMap[sport.getId()]++;
    }

    removeGame(sport: Sport) {
        this.nrOfGamesDoneMap[sport.getId()]--;
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
