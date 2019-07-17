import { Injectable } from '@angular/core';

import { Poule } from '../../poule';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportIdToNumberMap } from '../counter';
import { SportPlanningConfig } from '../planningconfig';

@Injectable()
export class SportPlanningConfigService {

    constructor() {
    }

    createDefault(sport: Sport, roundNumber: RoundNumber) {
        const config = new SportPlanningConfig(sport, roundNumber);
        config.setMinNrOfGames(SportPlanningConfig.DEFAULTNROFGAMES);
        return config;
    }

    copy(sport: Sport, roundNumber: RoundNumber, sourceConfig: SportPlanningConfig) {
        const newConfig = new SportPlanningConfig(sport, roundNumber);
        newConfig.setMinNrOfGames(sourceConfig.getMinNrOfGames());
    }

    /*isDefault( config: SportPlanningConfig ): boolean {
        return config.getNrOfGames() === SportPlanningConfig.DEFAULTNROFGAMES;
    }*/

    /*areEqual( configA: SportPlanningConfig, configB: SportPlanningConfig ): boolean {
        return configA.getNrOfGames() === configB.getNrOfGames();
    }*/

    getUsed(roundNumber: RoundNumber) {
        const usedSports = roundNumber.getCompetition().getFields().map(field => field.getSport());
        return roundNumber.getSportPlanningConfigs().filter(config => {
            return usedSports.some(sport => config.getSport() === sport);
        });
    }

    getMinNrOfGames(sportPlanningConfigs: SportPlanningConfig[], poule: Poule): SportIdToNumberMap {
        const minNrOfGames = {};
        if (sportPlanningConfigs.length === 1) { // bereken voor 1 sport
            minNrOfGames[sportPlanningConfigs[0].getSport().getId()] = this.getNrOfGamesPerPlace(poule, true);
        }
        sportPlanningConfigs.forEach(sportPlanningConfig => {
            minNrOfGames[sportPlanningConfig.getSport().getId()] = sportPlanningConfig.getMinNrOfGames();
        });
        return minNrOfGames;
    }



    getNrOfGamesPerPlace(poule: Poule, headtohead: boolean): number {
        const config = poule.getRound().getNumber().getValidPlanningConfig();
        let nrOfCombinations = this.getNrOfCombinations(poule.getPlaces().length, config.getTeamup());
        if (config.getTeamup() === true) {
            nrOfCombinations /= Sport.TEMPDEFAULT;
        }
        if (headtohead === true) {
            return nrOfCombinations * config.getNrOfHeadtohead()
        }
        return nrOfCombinations;
    }

    getNrOfCombinations(nrOfPlaces: number, teamup: boolean): number {
        let nrOfCombinations = this.above(nrOfPlaces, Sport.TEMPDEFAULT);
        if (teamup === true) {
            nrOfCombinations *= this.above(nrOfPlaces - Sport.TEMPDEFAULT, Sport.TEMPDEFAULT);
        }
        return nrOfCombinations;
    }

    protected above(top: number, bottom: number): number {
        const y = this.faculty(top);
        const z = (this.faculty(top - bottom) * this.faculty(bottom));
        const x = y / z;
        return x;
    }

    protected faculty(x: number): number {
        if (x > 1) {
            return this.faculty(x - 1) * x;
        }
        return 1;
    }
}
