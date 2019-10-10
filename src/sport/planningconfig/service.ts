import { Injectable, ViewChildren } from '@angular/core';

import { Poule } from '../../poule';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { SportIdToNumberMap } from '../../planning/place';
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

    convertToMap(sportsNrOfGames: SportNrOfGames[]): SportIdToNumberMap {
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

    // de map is niet door de gebruiker gekozen, maar is afhankelijk van het aantal velden:
    // *    hoe meer velden er zijn voor een sport, hoe vaker de deelnemer de sport moet doen
    // *    wanneer er van elke sport een veelvoud aan velden is, dan wordt alleen verkleind
    //      als het-aantal-poulewedstrijden nog gehaald wordt
    // *    zolang het aantal-keer-sporten-per-deelnemer minder blijft dan het aantal poulewedstrijden
    //      wordt het aantal-keer-sporten-per-deelnemer vergroot met 2x
    //
    //  Dus eerst wordt de veelvouden(sp1 -> 4v, sp2 -> 4v) van het aantal-keer-sporten-per-deelnemer naar beneden gebracht en
    //  vervolgens wordt er gekeken als het aantal-keer-sporten-per-deelnemer nog verhoogd kan worden, er moet dan wel onder
    //  het aantal poulewedstrijden worden gebleven
    //
    getPlanningMinNrOfGames(poule: Poule): SportNrOfGames[] {

        // const map = this.getDefaultMinNrOfGamesMap(roundNumber);
        // poule.getRound().getNumber().getValidPlanningConfig().getNrOfHeadtohead()

        // haal veelvouden eruit
        const roundNumber = poule.getRound().getNumber();
        const nrOfFieldsPerSport = roundNumber.getSportPlanningConfigs().map(sportPlanningConfig => {
            return sportPlanningConfig.getMinNrOfGames();
        });
        const fieldDivisors = this.getFieldsCommonDivisors(nrOfFieldsPerSport);

        // kijk als veelvouden van het aantal-keer-sporten-per-deelnemer verkleind gebruikt kunnen worden
        // door te kijken als er nog aan het aantal poulewedstrijden wordt gekomen
        const nrOfPouleGames = this.getNrOfPouleGames(poule);
        let bestSportsNrOfGames = this.getSportsNrOfGames(roundNumber);
        fieldDivisors.every(fieldDivisor => {
            const sportsNrOfGamesTmp = this.getSportsNrOfGames(roundNumber, fieldDivisor);
            const nrOfPouleGamesBySports = this.getNrOfPouleGamesBySports(poule, sportsNrOfGamesTmp);
            if (nrOfPouleGamesBySports < nrOfPouleGames) {
                return false;
            }
            bestSportsNrOfGames = sportsNrOfGamesTmp;
        });

        // zolang het aantal-keer-sporten-per-deelnemer minder blijft dan het aantal poulewedstrijden
        // wordt het aantal-keer-sporten-per-deelnemer vergroot met 2x
        let divisor = 0.5;
        let newSportsNrOfGames = this.getSportsNrOfGames(roundNumber, divisor);
        while (this.getNrOfPouleGamesBySports(poule, newSportsNrOfGames) <= nrOfPouleGames) {
            bestSportsNrOfGames = newSportsNrOfGames;
            divisor *= 0.5;
            newSportsNrOfGames = this.getSportsNrOfGames(roundNumber, divisor);
        }

        return bestSportsNrOfGames;
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

    getNrOfGamesPerPlace(poule: Poule, nrOfHeadtohead?: number): number {
        const nrOfPlaces = poule.getPlaces().length;
        let nrOfGames = nrOfPlaces - 1;
        const config = poule.getRound().getNumber().getValidPlanningConfig();
        if (config.getTeamup() === true) {
            nrOfGames = this.getNrOfCombinations(nrOfPlaces, true) - this.getNrOfCombinations(nrOfPlaces - 1, true);
        }
        return nrOfGames * (nrOfHeadtohead === undefined ? config.getNrOfHeadtohead() : nrOfHeadtohead);
    }

    getSufficientNrOfHeadtohead(poule: Poule): number {
        const roundNumber = poule.getRound().getNumber();
        // const sportsNrOfGames = this.getSportsNrOfGames(roundNumber);
        let nrOfHeadtohead = roundNumber.getValidPlanningConfig().getNrOfHeadtohead();
        // sportsNrOfGames is 4, 2, 2 en kan dus ook omdat er 9 wedstrijden per deelnemer worden gespeeld
        // maar blijkbaar gaat dit toch niet lukken ????????
        const sportsNrOfGames = this.getPlanningMinNrOfGames(poule);
        const nrOfPouleGamesBySports = this.getNrOfPouleGamesBySports(poule, sportsNrOfGames);
        while ((this.getNrOfPouleGames(poule, nrOfHeadtohead)) < nrOfPouleGamesBySports) {
            nrOfHeadtohead++;
        }
        // TEMPCOMMENT
        // if (this.getNrOfPouleGames(poule, nrOfHeadtohead) === nrOfPouleGamesBySports
        //     && poule.getPlaces().length === 4
        //     && (poule.getPlaces().length - 1) === sportsNrOfGames.length
        //     && sportsNrOfGames.length <= roundNumber.getCompetition().getFields().length
        // ) {
        //     // if (roundNumber.getCompetition().getSports().length !== 3) {
        //     if (nrOfHeadtohead === 1) {
        //         nrOfHeadtohead++;
        //     }

        //     // } else {
        //     //     const x = 1;
        //     // }

        // }
        return nrOfHeadtohead;
    }

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
        // let totalNrOfGamePlaces = 0;
        sportsNrOfGames.forEach((sportNrOfGames) => {
            const minNrOfGames = sportNrOfGames.nrOfGames;
            const nrOfGamePlaces = this.getNrOfGamePlaces(roundNumber, sportNrOfGames.sport, config.getTeamup());
            // nrOfPouleGames += (poule.getPlaces().length / nrOfGamePlaces) * minNrOfGames;
            nrOfPouleGames += Math.ceil((poule.getPlaces().length / nrOfGamePlaces) * minNrOfGames);
        });
        // return Math.ceil(nrOfPouleGames);
        return nrOfPouleGames;
    }

    getNrOfGamePlaces(roundNumber: RoundNumber, sport: Sport, teamup: boolean): number {
        const nrOfGamePlaces = roundNumber.getSportConfig(sport).getNrOfGamePlaces();
        return teamup ? nrOfGamePlaces * 2 : nrOfGamePlaces;
    }

    getNrOfCombinationsExt(roundNumber: RoundNumber): number {
        let nrOfGames = 0;
        const teamup = roundNumber.getValidPlanningConfig().getTeamup();
        roundNumber.getPoules().forEach(poule => {
            nrOfGames += this.getNrOfCombinations(poule.getPlaces().length, teamup);
        });
        return nrOfGames;
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
