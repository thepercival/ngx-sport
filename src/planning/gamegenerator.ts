import { Poule } from '../poule';
import { Place } from '../place';
import { PlaceCombination, PlaceCombinationNumber } from '../place/combination';
import { Config } from '../config';
import { PlanningGameRound } from './gameround';

export class GameGenerator {
    public constructor(private poule: Poule) {
    }

    /*public generateBen(): PlanningGameRound[] {
        const gameRounds: PlanningGameRound[] = [];
        let gameRound = new PlanningGameRound(1, []); gameRounds.push(gameRound);
        const p = this.poule.getPlaces();
        p.unshift(undefined);
        // gameRound.getCombinations().push(new PlaceCombination([p[1], p[2]], [p[7], p[8]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[3], p[4]], [p[5], p[6]])); ////
        // gameRound = new PlanningGameRound(2, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[7], p[3]], [p[4], p[1]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[5]], [p[2], p[6]])); ////
        // gameRound = new PlanningGameRound(3, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[1]], [p[6], p[4]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[5], p[2]], [p[3], p[7]])); ////
        // gameRound = new PlanningGameRound(4, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[6], p[5]], [p[4], p[2]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[1], p[7]], [p[3], p[8]])); ////
        // gameRound = new PlanningGameRound(5, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[2], p[4]], [p[1], p[6]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[7]], [p[3], p[5]])); ////
        // gameRound = new PlanningGameRound(6, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[7], p[4]], [p[1], p[5]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[2]], [p[6], p[3]])); //
        // gameRound = new PlanningGameRound(7, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[6], p[8]], [p[2], p[3]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[1], p[4]], [p[5], p[7]])); ////

        // // next
        // gameRound = new PlanningGameRound(8, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[5], p[3]], [p[2], p[1]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[4]], [p[7], p[6]])); //// 
        // gameRound = new PlanningGameRound(9, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[6], p[1]], [p[4], p[7]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[8], p[3]], [p[2], p[5]])); //// 
        // gameRound = new PlanningGameRound(10, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[1], p[3]], [p[2], p[7]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[4], p[6]], [p[5], p[8]])); ////
        // gameRound = new PlanningGameRound(11, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[6], p[2]], [p[3], p[1]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[7], p[5]], [p[4], p[8]])); ////
        // gameRound = new PlanningGameRound(12, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[6], p[7]], [p[4], p[5]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[3], p[2]], [p[1], p[8]])); ////
        // gameRound = new PlanningGameRound(13, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[7], p[2]], [p[4], p[3]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[5], p[1]], [p[8], p[6]])); ////
        // gameRound = new PlanningGameRound(14, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PlaceCombination([p[3], p[6]], [p[7], p[1]])); ////
        // gameRound.getCombinations().push(new PlaceCombination([p[5], p[4]], [p[2], p[8]])); ////

        gameRound.getCombinations().push(new PlaceCombination([p[1], p[2]], [p[5], p[6]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[3], p[4]], [p[7], p[8]])); ////
        gameRound = new PlanningGameRound(2, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[7], p[3]], [p[2], p[6]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[5]], [p[4], p[1]])); ////
        gameRound = new PlanningGameRound(3, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[1]], [p[3], p[7]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[5], p[2]], [p[6], p[4]])); ////
        gameRound = new PlanningGameRound(4, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[6], p[5]], [p[3], p[8]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[1], p[7]], [p[4], p[2]])); ////
        gameRound = new PlanningGameRound(5, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[2], p[4]], [p[3], p[5]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[7]], [p[1], p[6]])); ////
        gameRound = new PlanningGameRound(6, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[7], p[4]], [p[6], p[3]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[2]], [p[1], p[5]])); //
        gameRound = new PlanningGameRound(7, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[6], p[8]], [p[5], p[7]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[1], p[4]], [p[2], p[3]])); ////

        // next
        gameRound = new PlanningGameRound(8, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[5], p[3]], [p[7], p[6]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[4]], [p[2], p[1]])); //// 
        gameRound = new PlanningGameRound(9, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[6], p[1]], [p[2], p[5]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[8], p[3]], [p[4], p[7]])); //// 
        gameRound = new PlanningGameRound(10, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[1], p[3]], [p[5], p[8]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[4], p[6]], [p[2], p[7]])); ////
        gameRound = new PlanningGameRound(11, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[6], p[2]], [p[4], p[8]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[7], p[5]], [p[3], p[1]])); ////
        gameRound = new PlanningGameRound(12, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[6], p[7]], [p[1], p[8]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[3], p[2]], [p[4], p[5]])); ////
        gameRound = new PlanningGameRound(13, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[7], p[2]], [p[8], p[6]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[5], p[1]], [p[4], p[3]])); ////
        gameRound = new PlanningGameRound(14, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PlaceCombination([p[3], p[6]], [p[2], p[8]])); ////
        gameRound.getCombinations().push(new PlaceCombination([p[5], p[4]], [p[7], p[1]])); ////

        p.shift();
        return gameRounds;
    }*/

    public generate(teamUp: boolean): PlanningGameRound[] {
        const gameRoundsSingle: PlanningGameRound[] = this.generateRRSchedule(this.poule.getPlaces().slice());

        const nrOfPlaces = this.poule.getPlaces().length;
        if (teamUp !== true || nrOfPlaces < Config.TEAMUP_MIN || nrOfPlaces > Config.TEAMUP_MAX) {
            return gameRoundsSingle;
        }
        const teams: Place[][] = [];
        gameRoundsSingle.forEach(gameRound => gameRound.getCombinations().forEach((combination) => {
            teams.push(combination.get());
        }));

        const gameRoundsTmp: PlanningGameRound[] = [];
        // teams are all possible combinations of two places
        teams.forEach(team => {
            const opponents = this.getCombinationsWithOut(team);
            for (let nr = 1; nr <= opponents.length; nr++) {
                let gameRound = gameRoundsTmp.find(gameRoundIt => nr === gameRoundIt.getNumber());
                if (gameRound === undefined) {
                    gameRound = new PlanningGameRound(nr, []);
                    gameRoundsTmp.push(gameRound);
                }
                const combination = new PlaceCombination(team, opponents[nr - 1].get());
                gameRound.getCombinations().push(combination);
            }
        });

        let games = this.flattenGameRounds(gameRoundsTmp);

        const totalNrOfCombinations = this.getTotalNrOfCombinations(nrOfPlaces);
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

    protected getTotalNrOfCombinations(nrOfPlaces: number): number {
        return this.above(nrOfPlaces, 2) * this.above(nrOfPlaces - 2, 2);
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

    protected getCombinationsWithOut(team: Place[]): PlaceCombination[] {
        const opponents = this.poule.getPlaces().filter(placeIt => {
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

    /*
    t       r1  r2  r3
    1-2     3-4 3-5 4-5
    1-3     2-4 2-5 4-5
    1-4     2-3 2-5 3-5
    1-5     2-3 2-4 4-5
    2-3     1-4 1-5 4-5
    2-4     1-3 1-5 3-5
    2-5     1-3 1-4 1-5
    3-4     1-2 1-5 2-5
    3-5     1-2 1-4 2-4
    4-5     1-2 1-3 2-3
    */

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
