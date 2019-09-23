import { Sport } from '../sport';
import { SportPlanningConfig } from './planningconfig';

export class SportCounter {
    private nrToGo = 0;
    private minNrOfGamesMap: SportIdToNumberMap = {};
    private nrOfGamesDoneMap: SportIdToNumberMap = {};

    constructor(
        private nrOfGamesToGo: number,
        minNrOfGamesMap: SportIdToNumberMap,
        sportPlanningConfigs: SportPlanningConfig[]
    ) {
        sportPlanningConfigs.forEach(sportPlanningConfig => {
            const sportId = sportPlanningConfig.getSport().getId();
            this.minNrOfGamesMap[sportId] = minNrOfGamesMap[sportId];
            this.nrOfGamesDoneMap[sportId] = 0;
            this.nrToGo += this.minNrOfGamesMap[sportId];
        });
    }

    isAssignable(sport: Sport): boolean {
        const isSportDone = this.nrOfGamesDoneMap[sport.getId()] >= this.minNrOfGamesMap[sport.getId()];
        return (this.nrToGo - (isSportDone ? 0 : 1)) <= (this.nrOfGamesToGo - 1);
    }

    addGame(sport: Sport) {
        if (this.nrOfGamesDoneMap[sport.getId()] === undefined) {
            this.nrOfGamesDoneMap[sport.getId()] = 0;
        }
        if (this.nrOfGamesDoneMap[sport.getId()] < this.minNrOfGamesMap[sport.getId()]) {
            this.nrToGo--;
        }
        this.nrOfGamesDoneMap[sport.getId()]++;
        this.nrOfGamesToGo--;
    }

    removeGame(sport: Sport) {
        this.nrOfGamesDoneMap[sport.getId()]--;
        if (this.nrOfGamesDoneMap[sport.getId()] < this.minNrOfGamesMap[sport.getId()]) {
            this.nrToGo++;
        }
        this.nrOfGamesToGo++;
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
