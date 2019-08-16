import { Sport } from '../sport';
import { SportPlanningConfig } from './planningconfig';

export class SportCounter {
    private nrOfSports: number;
    private nrOfSportsDone: number = 0;
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
        this.nrOfSports = sportPlanningConfigs.length;
    }

    isDone(): boolean {
        if (this.nrOfSportsDone > this.nrOfSports) {
            throw Error('nrsportsdone cannot be greater than nrofsports,' +
                'add PlanningResourceService.placesSportsCounter to Resources');
        }
        return this.nrOfSportsDone === this.nrOfSports;
    }

    isSportDone(sport: Sport): boolean {
        return this.nrOfGamesDoneMap[sport.getId()] >= this.minNrOfGamesMap[sport.getId()];
    }

    addGame(sport: Sport) {
        if (this.nrOfGamesDoneMap[sport.getId()] === undefined) {
            this.nrOfGamesDoneMap[sport.getId()] = 0;
        }
        this.nrOfGamesDoneMap[sport.getId()]++;
        if (this.nrOfGamesDoneMap[sport.getId()] === this.minNrOfGamesMap[sport.getId()]) {
            this.nrOfSportsDone++;
        }
    }

    removeGame(sport: Sport) {
        if (this.nrOfGamesDoneMap[sport.getId()] === this.minNrOfGamesMap[sport.getId()]) {
            this.nrOfSportsDone--;
        }
        this.nrOfGamesDoneMap[sport.getId()]--;
    }
}

export interface SportIdToNumberMap {
    [sportId: number]: number;
}
