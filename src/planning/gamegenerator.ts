import { Sport } from '../../tmp/src/sport';
import { Game } from '../game';
import { Place } from '../place';
import { PlaceCombination, PlaceCombinationNumber } from '../place/combination';
import { Poule } from '../poule';
import { RoundNumber } from '../round/number';
import { SportPlanningConfig } from '../sport/planningconfig';
import { PlanningConfig } from './config';
import { PlanningGameRound } from './gameround';

export class GameGenerator {
    private sportPlanningConfigs: SportPlanningConfig[];

    public constructor() {
    }

    // protected createPouleMultiply(poule: Poule, gameRounds: PlanningGameRound[], nrOfHeadtoHead: number) {
    //     for (let headToHead = 1; headToHead <= nrOfHeadtoHead; headToHead++) {
    //         const reverseHomeAway = (headToHead % 2) === 0;

    //         const headToHeadNumber = ((headToHead - 1) * gameRounds.length);
    //         gameRounds.forEach(gameRound => {
    //             let subNumber = 1;
    //             gameRound.getCombinations().forEach(combination => {
    //                 const game = new Game(poule, headToHeadNumber + gameRound.getNumber(), subNumber++);
    //                 game.setPlaces(combination.getGamePlaces(game, reverseHomeAway/*, reverseCombination*/));
    //             });
    //         });
    //     }
    // }



    create(roundNumber: RoundNumber) {
        this.setSportPlanningConfigs(roundNumber);
        roundNumber.getPoules().forEach(poule => {
            this.createPoule(poule, roundNumber.getPlanningConfig());
        });
    }

    protected createPoule(poule: Poule, config: PlanningConfig) {
        const nrOfHeadtohead = this.getNrOfHeadtoheadNeeded(poule);
        const gameRounds = this.createPouleGameRounds(poule, config.getTeamup());
        for (let headtohead = 1; headtohead <= nrOfHeadtohead; headtohead++) {
            const reverseHomeAway = (headtohead % 2) === 0;
            const startGameRoundNumber = ((headtohead - 1) * gameRounds.length);
            gameRounds.forEach(gameRound => {
                let subNumber = 1;
                gameRound.getCombinations().forEach(combination => {
                    const game = new Game(poule, startGameRoundNumber + gameRound.getNumber(), subNumber++);
                    game.setPlaces(combination.getGamePlaces(game, reverseHomeAway/*, reverseCombination*/));
                });
            });
        }
    }

    // 1 per sport kijk je hoeveel wedstrijden je minimaal nodig bent om iedereen het vereiste aantal voor de sport te laten spelen
    // 2 je telt alle wedstrijden bij elkaar op
    // dan kun je obv bepalen hoeveel nrOfHeadtohead je nodig bent!!

    // voor 1 sport moet is minNrOfGames = 

    //     { 
    //     pouleA: 12 placegames needed
    //     pouleB: 12 placegames needed
    //     pouleC: 16 placegames needed
    // }

    protected getNrOfHeadtoheadNeeded(poule: Poule): number {
        const nrOfPouleGamesNeeded = this.getNrOfPouleGamesNeeded(poule);
        const config = poule.getRound().getNumber().getValidPlanningConfig();

        const nrOfCombinations = this.getUniqueNrOfCombinations(poule.getPlaces().length, config.getTeamup());
        let nrOfHeadtoheadNeeded = Math.ceil(nrOfPouleGamesNeeded / nrOfCombinations);
        if (config.getNrOfHeadtohead() > nrOfHeadtoheadNeeded) {
            return config.getNrOfHeadtohead();
        }
        return nrOfHeadtoheadNeeded;
    }

    protected getNrOfPouleGamesNeeded(poule: Poule): number {

        const roundNumber = poule.getRound().getNumber();
        const config = roundNumber.getValidPlanningConfig();
        // multiple sports
        let nrOfPouleGamesNeeded = 0;
        this.sportPlanningConfigs.forEach((sportPlanningConfig) => {
            const minNrOfGames = sportPlanningConfig.getMinNrOfGames();
            nrOfPouleGamesNeeded += Math.ceil((poule.getPlaces().length / sportPlanningConfig.getNrOfGamePlaces(config.getTeamup()) * minNrOfGames));
        });
        return nrOfPouleGamesNeeded;
    }

    protected setSportPlanningConfigs(roundNumber: RoundNumber) {
        const usedSports = roundNumber.getCompetition().getFields().map(field => field.getSport());
        this.sportPlanningConfigs = roundNumber.getSportPlanningConfigs().filter(config => {
            return usedSports.some(sport => config.getSport() === sport);
        });
    }

    createPouleGameRounds(poule: Poule, teamup: boolean): PlanningGameRound[] {
        const gameRoundsSingle: PlanningGameRound[] = this.generateRRSchedule(poule.getPlaces().slice());

        const nrOfPlaces = poule.getPlaces().length;
        if (teamup !== true || nrOfPlaces < PlanningConfig.TEAMUP_MIN || nrOfPlaces > PlanningConfig.TEAMUP_MAX) {
            return gameRoundsSingle;
        }
        const teams: Place[][] = [];
        gameRoundsSingle.forEach(gameRoundIt => gameRoundIt.getCombinations().forEach((combination) => {
            teams.push(combination.get());
        }));

        const gameRoundsTmp: PlanningGameRound[] = [];
        // teams are all possible combinations of two places
        teams.forEach(team => {
            const opponents = this.getCombinationsWithOut(poule, team);
            for (let nr = 1; nr <= opponents.length; nr++) {
                let gameRoundIt = gameRoundsTmp.find(gameRoundItIt => nr === gameRoundItIt.getNumber());
                if (gameRoundIt === undefined) {
                    gameRoundIt = new PlanningGameRound(nr, []);
                    gameRoundsTmp.push(gameRoundIt);
                }
                const combination = new PlaceCombination(team, opponents[nr - 1].get());
                gameRoundIt.getCombinations().push(combination);
            }
        });

        const games = this.flattenGameRounds(gameRoundsTmp);

        const totalNrOfCombinations = this.getNrOfCombinations(nrOfPlaces, true);
        if (totalNrOfCombinations !== games.length) {
            console.error('not correct permu');
        }

        const uniqueGames: PlaceCombination[] = this.getUniqueGames(games);

        const gameRounds: PlanningGameRound[] = [];
        let gameRound = new PlanningGameRound(1, []);
        gameRounds.push(gameRound);

        while (uniqueGames.length > 0) {
            const game = uniqueGames.shift();
            if (this.isPlaceInRoundGame(gameRound.getCombinations(), game)) {
                uniqueGames.push(game);
                continue;
            }
            gameRound.getCombinations().push(game);
            if (((gameRound.getCombinations().length * 4) + 4) > nrOfPlaces) {
                gameRound = new PlanningGameRound(gameRound.getNumber() + 1, []);
                gameRounds.push(gameRound);
            }
        }
        if (gameRound.getCombinations().length === 0) {
            const index = gameRounds.indexOf(gameRound);
            if (index > -1) {
                gameRounds.splice(index, 1);
            }
        }
        return gameRounds;
    }

    protected getUniqueGames(games: PlaceCombination[]): PlaceCombination[] {
        const combinationNumbers: PlaceCombinationNumber[] = [];
        const uniqueGames: PlaceCombination[] = [];
        games.forEach(game => {
            const gameCombinationNumber = new PlaceCombinationNumber(game);
            const combinationNumber = combinationNumbers.find(combinationNumberIt => {
                return gameCombinationNumber.equals(combinationNumberIt);
            });
            if (combinationNumber !== undefined) { // als wedstrijd al is geweest, dan wedstrijd niet opnemen
                return;
            }
            combinationNumbers.push(gameCombinationNumber);
            uniqueGames.push(game);
        });
        return uniqueGames;
    }

    protected getNrOfCombinations(nrOfPlaces: number, teamup: boolean): number {
        let nrOfCombinations = this.above(nrOfPlaces, Sport.TEMPDEFAULT);
        if (teamup === true) {
            nrOfCombinations *= this.above(nrOfPlaces - Sport.TEMPDEFAULT, Sport.TEMPDEFAULT);
        }
        return nrOfCombinations;
    }

    protected getUniqueNrOfCombinations(nrOfPlaces: number, teamup: boolean): number {
        let nrOfCombinations = this.getNrOfCombinations(nrOfPlaces, teamup);
        if (teamup === true) {
            nrOfCombinations /= Sport.TEMPDEFAULT;
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

    protected getCombinationsWithOut(poule: Poule, team: Place[]): PlaceCombination[] {
        const opponents = poule.getPlaces().filter(placeIt => {
            return team.find(place => place === placeIt) === undefined;
        });
        return this.flattenGameRounds(this.generateRRSchedule(opponents.slice()));
    }

    protected flattenGameRounds(gameRounds: PlanningGameRound[]): PlaceCombination[] {
        let games: PlaceCombination[] = [];
        gameRounds.forEach(gameRound => { games = games.concat(gameRound.getCombinations()); });
        return games;
    }

    protected isPlaceInRoundGame(gameRoundCombinations: PlaceCombination[], game: PlaceCombination): boolean {
        return gameRoundCombinations.some(combination => combination.hasOverlap(game));
    }

    private generateRRSchedule(places: Place[]): PlanningGameRound[] {
        let nrOfPlaces = places.length;
        if (nrOfPlaces === 0) {
            return [];
        }
        const nrOfHomeGames = {}; places.forEach(place => nrOfHomeGames[place.getNumber()] = 0);

        // add a placeholder if the count is odd
        if ((nrOfPlaces % 2) !== 0) {
            places.push(undefined);
            nrOfPlaces++;
        }

        // calculate the number of sets and matches per set
        const nrOfRoundNumbers = nrOfPlaces - 1;
        const nrOfMatches = nrOfPlaces / 2;
        const gameRounds: PlanningGameRound[] = [];

        // generate each set
        for (let roundNumber = 1; roundNumber <= nrOfRoundNumbers; roundNumber++) {
            const evenRoundNumber = (roundNumber % 2) === 0;
            const combinations: PlaceCombination[] = [];
            const halves = this.chunk(places, 2);
            const firstHalf = halves.shift();
            const secondHalf = halves.shift().reverse();
            // generate each match in the set
            for (let i = 0; i < nrOfMatches; i++) {
                if (firstHalf[i] === undefined || secondHalf[i] === undefined) {
                    continue;
                }
                let homePlace = evenRoundNumber ? secondHalf[i] : firstHalf[i];
                let awayPlace = evenRoundNumber ? firstHalf[i] : secondHalf[i];
                if (nrOfHomeGames[awayPlace.getNumber()] < nrOfHomeGames[homePlace.getNumber()]) {
                    const tmpPlace = homePlace;
                    homePlace = awayPlace;
                    awayPlace = tmpPlace;
                }
                combinations.push(new PlaceCombination([homePlace], [awayPlace]));
                nrOfHomeGames[homePlace.getNumber()]++;
            }
            gameRounds.push(new PlanningGameRound(roundNumber, combinations));
            // remove the first player and store
            const first = places.shift();
            // move the second player to the end of the list
            places.push(places.shift());
            // place the first item back in the first position
            places.unshift(first);
        }
        return gameRounds;
    }

    private chunk(places: Place[], parts: number): any[][] {
        const chunkSize = Math.round(places.length / parts);
        const result = [];
        for (let i = 0; i < places.length; i += chunkSize) {
            if (result.length < parts - 1) {
                result.push(places.slice(i, i + chunkSize).map(a => a));
            } else {
                result.push(places.slice(i).map(a => a));
                break;
            }
        }
        return result;
    }
}
