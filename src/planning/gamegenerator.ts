import { Game } from '../game';
import { Place } from '../place';
import { PlaceCombination, PlaceCombinationNumber } from '../place/combination';
import { Poule } from '../poule';
import { RoundNumber } from '../round/number';
import { SportPlanningConfig } from '../sport/planningconfig';
import { SportPlanningConfigService } from '../sport/planningconfig/service';
import { PlanningConfig } from './config';
import { PlanningGameRound } from './gameround';

export class GameGenerator {
    private sportPlanningConfigService: SportPlanningConfigService;
    private sportPlanningConfigs: SportPlanningConfig[];

    public constructor() {
        this.sportPlanningConfigService = new SportPlanningConfigService();
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
        roundNumber.getPoules().forEach(poule => {
            this.createPoule(poule, roundNumber.getValidPlanningConfig());
        });
    }

    protected getSufficientNrOfHeadtohead(poule: Poule): number {
        const roundNumber = poule.getRound().getNumber();
        const sportsNrOfGames = this.sportPlanningConfigService.getSportsNrOfGames(roundNumber);
        let nrOfHeadtohead = roundNumber.getValidPlanningConfig().getNrOfHeadtohead();
        const nrOfPouleGamesBySports = this.sportPlanningConfigService.getNrOfPouleGamesBySports(poule, sportsNrOfGames);
        while ((this.sportPlanningConfigService.getNrOfPouleGames(poule, nrOfHeadtohead)) < nrOfPouleGamesBySports) {
            nrOfHeadtohead++;
        }
        return nrOfHeadtohead;
    }

    protected createPoule(poule: Poule, config: PlanningConfig) {
        let nrOfHeadtohead = this.getSufficientNrOfHeadtohead(poule);
        if (config.getNrOfHeadtohead() > nrOfHeadtohead) {
            nrOfHeadtohead = config.getNrOfHeadtohead();
        }
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
