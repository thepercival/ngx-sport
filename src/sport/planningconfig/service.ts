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

    copy(sport: Sport, roundNumber: RoundNumber, sourceConfig: SportPlanningConfig): SportPlanningConfig {
        const newConfig = new SportPlanningConfig(sport, roundNumber);
        newConfig.setMinNrOfGames(sourceConfig.getMinNrOfGames());
        return newConfig;
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

    getMinNrOfGamesMap(poule: Poule, sportPlanningConfigs: SportPlanningConfig[]): SportIdToNumberMap {
        const minNrOfGames = {};
        if (sportPlanningConfigs.length === 1) { // bereken voor 1 sport
            const config = poule.getRound().getNumber().getValidPlanningConfig();
            minNrOfGames[sportPlanningConfigs[0].getSport().getId()] = this.getNrOfGamesPerPlace(poule, config.getNrOfHeadtohead());
        } else {
            let nrOfGames = this.getNrOfGamesPerPoule(poule);
            nrOfGames *= poule.getRound().getNumber().getValidPlanningConfig().getNrOfHeadtohead();
            const nrOfGamesByConfigs = this.getMinNrOfPouleGames(poule, sportPlanningConfigs);
            const factor = nrOfGames > nrOfGamesByConfigs ? Math.floor(nrOfGames / nrOfGamesByConfigs) : 1;
            // console.log('nrOfGames : ' + nrOfGames);
            // console.log('nrOfGamesByConfigs : ' + nrOfGamesByConfigs);
            // console.log('factor : ' + factor);
            sportPlanningConfigs.forEach(sportPlanningConfig => {
                minNrOfGames[sportPlanningConfig.getSport().getId()] = sportPlanningConfig.getMinNrOfGames() * factor;
            });
        }
        return minNrOfGames;
    }

    protected getNrOfGamesPerPoule(poule: Poule): number {
        const config = poule.getRound().getNumber().getValidPlanningConfig();
        return this.getNrOfCombinations(poule.getPlaces().length, config.getTeamup());
    }

    getNrOfGamesPerPlace(poule: Poule, nrOfHeadtohead?: number): number {
        const nrOfPlaces = poule.getPlaces().length;
        let nrOfGames = nrOfPlaces - 1;
        const config = poule.getRound().getNumber().getValidPlanningConfig();
        if (config.getTeamup() === true) {
            nrOfGames = this.getNrOfCombinations(nrOfPlaces, true) - this.getNrOfCombinations(nrOfPlaces - 1, true);
        }
        return nrOfHeadtohead ? nrOfGames * nrOfHeadtohead : nrOfGames;
    }

    getNrOfHeadtohead(poule: Poule, sportPlanningConfigs: SportPlanningConfig[]): number {
        const minNrOfPouleGames = this.getMinNrOfPouleGames(poule, sportPlanningConfigs);
        const nrOfPouleGames = this.getNrOfGamesPerPoule(poule);
        const nrOfHeadtoheadNeeded = Math.ceil(minNrOfPouleGames / nrOfPouleGames);
        return nrOfHeadtoheadNeeded;
    }

    /**
     * de sporten moeten allemaal dezelfde aantal deelnemers per wedstrijd hebben
     * 
     * @param poule 
     * @param sportPlanningConfigs 
     */
    protected getMinNrOfPouleGames(poule: Poule, sportPlanningConfigs: SportPlanningConfig[]): number {

        const roundNumber = poule.getRound().getNumber();
        const config = roundNumber.getValidPlanningConfig();
        // multiple sports
        let nrOfPouleGames = 0;
        sportPlanningConfigs.forEach((sportPlanningConfig) => {
            const minNrOfGames = sportPlanningConfig.getMinNrOfGames();
            const nrOfGamePlaces = sportPlanningConfig.getNrOfGamePlaces(config.getTeamup());
            nrOfPouleGames += (poule.getPlaces().length / nrOfGamePlaces * minNrOfGames);
        });
        return nrOfPouleGames;
    }

    getNrOfCombinations(nrOfPlaces: number, teamup: boolean): number {
        if (teamup === false) {
            return this.above(nrOfPlaces, Sport.TEMPDEFAULT);
        }
        // const nrOfPlacesPerGame = Sport.TEMPDEFAULT * 2;

        // 4 = 3 of 6
        // 5 = 4 of 10
        // 6 = 15 of 5
        if (nrOfPlaces < 4) {
            return 0;
        }
        if (nrOfPlaces === 4) {
            return 3; // aantal ronden = 3 perm = 1
        }
        if (nrOfPlaces === 5) {
            return 15; // perm = 5 ronden = 3
        }
        return 45; // perm = 45 ronden = 1
    }

    protected above(top: number, bottom: number): number {
        // if (bottom > top) {
        //     return 0;
        // }
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
