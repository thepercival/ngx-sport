import { Injectable, ViewChildren } from '@angular/core';

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

    getMinNrOfGamesMap(roundNumber: RoundNumber): SportIdToNumberMap {
        return this.convertToMap(this.getSportsNrOfGames(roundNumber));
    }

    protected convertToMap(sportsNrOfGames: SportNrOfGames[]): SportIdToNumberMap {
        const minNrOfGamesMap = {};
        sportsNrOfGames.forEach(sportNrOfGames => {
            minNrOfGamesMap[sportNrOfGames.sport.getId()] = sportNrOfGames.nrOfGames;
        });
        return minNrOfGamesMap;
    }

    getSportsNrOfGames(roundNumber: RoundNumber, divisor?: number): SportNrOfGames[] {
        const sportsNrOfGames = [];
        roundNumber.getSportPlanningConfigs().forEach(sportPlanningConfig => {
            let nrOfGames = sportPlanningConfig.getMinNrOfGames();
            if (divisor) {
                nrOfGames /= divisor;
            }
            sportsNrOfGames.push({
                sport: sportPlanningConfig.getSport(),
                nrOfGames: nrOfGames
            });
        });
        return sportsNrOfGames;
    }

    // de map is niet door de gebruiker gekozen, maar is afhankelijk van het aantal velden
    // hoe meer velden er zijn voor een sport, hoe vaker de deelnemer de sport moet doen
    // wanneer er van elke sport een veelvoud aan sporten is, dan is het headtohead bepalend
    // bij een veelvoud kan de mapping kan alleen naar beneden worden aangepast als daardoor
    // aan de headtohead wordt voldaan
    getPlanningMinNrOfGamesMap(poule: Poule): SportIdToNumberMap {

        // const map = this.getDefaultMinNrOfGamesMap(roundNumber);
        // poule.getRound().getNumber().getValidPlanningConfig().getNrOfHeadtohead()

        const roundNumber = poule.getRound().getNumber();
        const nrOfFieldsPerSport = roundNumber.getSportPlanningConfigs().map(sportPlanningConfig => {
            return sportPlanningConfig.getMinNrOfGames();
        });
        const fieldDivisors = this.getFieldsCommonDivisors(nrOfFieldsPerSport);

        const nrOfPouleGames = this.getNrOfPouleGames(poule);
        let bestSportsNrOfGames = this.getSportsNrOfGames(roundNumber);
        fieldDivisors.every(fieldDivisor => {
            const sportsNrOfGamesTmp = this.getSportsNrOfGames(roundNumber, fieldDivisor);
            const nrOfPouleGamesBySports = this.getNrOfPouleGamesBySports(poule, sportsNrOfGamesTmp);
            if (nrOfPouleGames < nrOfPouleGamesBySports) {
                return false;
            }
            bestSportsNrOfGames = sportsNrOfGamesTmp;
        });

        let divisor = 0.5;
        let newSportsNrOfGames = this.getSportsNrOfGames(roundNumber, divisor);
        while (nrOfPouleGames >= this.getNrOfPouleGamesBySports(poule, newSportsNrOfGames)) {
            bestSportsNrOfGames = newSportsNrOfGames;
            divisor *= 0.5;
            newSportsNrOfGames = this.getSportsNrOfGames(roundNumber, divisor);
        }

        return this.convertToMap(bestSportsNrOfGames);

        // bv 2 sporten met 4 en 8 velden
        // kan worden teruggebracht naar 1, 2 of 2, 4
    }

    getFieldsCommonDivisors(numbers: number[]): number[] {
        if (numbers.length === 1) {
            return [];
        }
        let commonDivisors = [];
        for (let i = 0; i < numbers.length - 1; i++) {

            const commonDivisorsIt = this.getCommonDivisors(numbers[i], numbers[i + 1]);
            if (commonDivisors.length === 0) {
                commonDivisors = commonDivisorsIt;
            } else {
                commonDivisors = commonDivisors.filter(commonDivisor => {
                    return commonDivisorsIt.find(commonDivisorIt => commonDivisorIt === commonDivisor) !== undefined;
                });
            }
        }
        return commonDivisors;
    }

    protected getCommonDivisors(a: number, b: number): number[] {
        const gcd = (x: number, y: number): number => {
            if (!y) {
                return x;
            }
            return gcd(y, x % y);
        };
        return this.getDivisors(gcd(a, b)).reverse();
    }

    protected getDivisors(number: number): number[] {
        const divisors = [];
        for (let currentDivisor = 1; currentDivisor <= number; currentDivisor++) {
            if (number % currentDivisor === 0) {
                divisors.push(currentDivisor);
            }
        }
        return divisors;
    }

    getNrOfPouleGames(poule: Poule, nrOfHeadtohead?: number): number {
        const config = poule.getRound().getNumber().getValidPlanningConfig();
        if (nrOfHeadtohead === undefined) {
            nrOfHeadtohead = config.getNrOfHeadtohead();
        }
        return this.getNrOfCombinations(poule.getPlaces().length, config.getTeamup()) * nrOfHeadtohead;
    }

    // getNrOfGamesPerPlace(poule: Poule, nrOfHeadtohead?: number): number {
    //     const nrOfPlaces = poule.getPlaces().length;
    //     let nrOfGames = nrOfPlaces - 1;
    //     const config = poule.getRound().getNumber().getValidPlanningConfig();
    //     if (config.getTeamup() === true) {
    //         nrOfGames = this.getNrOfCombinations(nrOfPlaces, true) - this.getNrOfCombinations(nrOfPlaces - 1, true);
    //     }
    //     return nrOfHeadtohead ? nrOfGames * nrOfHeadtohead : nrOfGames;
    // }

    /**
     *
     * @param poule
     * @param sportPlanningConfigs
     */
    getNrOfPouleGamesBySports(poule: Poule, sportsNrOfGames: SportNrOfGames[]): number {

        const roundNumber = poule.getRound().getNumber();
        const config = roundNumber.getValidPlanningConfig();
        // multiple sports
        let nrOfPouleGames = 0;
        sportsNrOfGames.forEach((sportNrOfGames) => {
            const minNrOfGames = sportNrOfGames.nrOfGames;
            const nrOfGamePlaces = this.getNrOfGamePlaces(roundNumber, sportNrOfGames.sport, config.getTeamup());
            nrOfPouleGames += Math.ceil((poule.getPlaces().length / nrOfGamePlaces) * minNrOfGames);
        });
        return nrOfPouleGames;
    }

    getNrOfGamePlaces(roundNumber: RoundNumber, sport: Sport, teamup: boolean): number {
        const nrOfGamePlaces = roundNumber.getSportConfig(sport).getNrOfGamePlaces();
        return teamup ? nrOfGamePlaces * 2 : nrOfGamePlaces;
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

export class SportNrOfGames {
    sport: Sport;
    nrOfGames: number;
}
