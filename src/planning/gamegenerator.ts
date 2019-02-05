import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { PoulePlaceCombination, PoulePlaceCombinationNumber } from '../pouleplace/combination';
import { RoundNumberConfig } from '../round/number/config';
import { PlanningGameRound } from './gameround';

export class GameGenerator {
    public constructor(private poule: Poule) {
    }

    /*public generateBen(): PlanningGameRound[] {
        const gameRounds: PlanningGameRound[] = [];
        let gameRound = new PlanningGameRound(1, []); gameRounds.push(gameRound);
        const p = this.poule.getPlaces();
        p.unshift(undefined);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[2]], [p[7], p[8]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[4]], [p[5], p[6]])); ////
        // gameRound = new PlanningGameRound(2, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[3]], [p[4], p[1]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[5]], [p[2], p[6]])); ////
        // gameRound = new PlanningGameRound(3, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[1]], [p[6], p[4]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[2]], [p[3], p[7]])); ////
        // gameRound = new PlanningGameRound(4, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[5]], [p[4], p[2]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[7]], [p[3], p[8]])); ////
        // gameRound = new PlanningGameRound(5, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[2], p[4]], [p[1], p[6]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[7]], [p[3], p[5]])); ////
        // gameRound = new PlanningGameRound(6, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[4]], [p[1], p[5]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[2]], [p[6], p[3]])); //
        // gameRound = new PlanningGameRound(7, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[8]], [p[2], p[3]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[4]], [p[5], p[7]])); ////

        // // next
        // gameRound = new PlanningGameRound(8, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[3]], [p[2], p[1]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[4]], [p[7], p[6]])); //// 
        // gameRound = new PlanningGameRound(9, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[1]], [p[4], p[7]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[3]], [p[2], p[5]])); //// 
        // gameRound = new PlanningGameRound(10, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[3]], [p[2], p[7]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[4], p[6]], [p[5], p[8]])); ////
        // gameRound = new PlanningGameRound(11, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[2]], [p[3], p[1]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[5]], [p[4], p[8]])); ////
        // gameRound = new PlanningGameRound(12, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[7]], [p[4], p[5]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[2]], [p[1], p[8]])); ////
        // gameRound = new PlanningGameRound(13, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[2]], [p[4], p[3]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[1]], [p[8], p[6]])); ////
        // gameRound = new PlanningGameRound(14, []); gameRounds.push(gameRound);
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[6]], [p[7], p[1]])); ////
        // gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[4]], [p[2], p[8]])); ////

        gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[2]], [p[5], p[6]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[4]], [p[7], p[8]])); ////
        gameRound = new PlanningGameRound(2, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[3]], [p[2], p[6]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[5]], [p[4], p[1]])); ////
        gameRound = new PlanningGameRound(3, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[1]], [p[3], p[7]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[2]], [p[6], p[4]])); ////
        gameRound = new PlanningGameRound(4, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[5]], [p[3], p[8]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[7]], [p[4], p[2]])); ////
        gameRound = new PlanningGameRound(5, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[2], p[4]], [p[3], p[5]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[7]], [p[1], p[6]])); ////
        gameRound = new PlanningGameRound(6, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[4]], [p[6], p[3]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[2]], [p[1], p[5]])); //
        gameRound = new PlanningGameRound(7, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[8]], [p[5], p[7]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[4]], [p[2], p[3]])); ////

        // next
        gameRound = new PlanningGameRound(8, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[3]], [p[7], p[6]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[4]], [p[2], p[1]])); //// 
        gameRound = new PlanningGameRound(9, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[1]], [p[2], p[5]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[8], p[3]], [p[4], p[7]])); //// 
        gameRound = new PlanningGameRound(10, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[1], p[3]], [p[5], p[8]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[4], p[6]], [p[2], p[7]])); ////
        gameRound = new PlanningGameRound(11, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[2]], [p[4], p[8]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[5]], [p[3], p[1]])); ////
        gameRound = new PlanningGameRound(12, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[6], p[7]], [p[1], p[8]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[2]], [p[4], p[5]])); ////
        gameRound = new PlanningGameRound(13, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[7], p[2]], [p[8], p[6]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[1]], [p[4], p[3]])); ////
        gameRound = new PlanningGameRound(14, []); gameRounds.push(gameRound);
        gameRound.getCombinations().push(new PoulePlaceCombination([p[3], p[6]], [p[2], p[8]])); ////
        gameRound.getCombinations().push(new PoulePlaceCombination([p[5], p[4]], [p[7], p[1]])); ////

        p.shift();
        return gameRounds;
    }*/

    public generate(teamUp: boolean): PlanningGameRound[] {
        const gameRoundsSingle: PlanningGameRound[] = this.generateRRSchedule(this.poule.getPlaces().slice());

        const nrOfPoulePlaces = this.poule.getPlaces().length;
        if (teamUp !== true || nrOfPoulePlaces < RoundNumberConfig.TEAMUP_MIN || nrOfPoulePlaces > RoundNumberConfig.TEAMUP_MAX) {
            return gameRoundsSingle;
        }
        const teams: PoulePlace[][] = [];
        gameRoundsSingle.forEach(gameRound => gameRound.getCombinations().forEach((combination) => {
            teams.push(combination.get());
        }));



        const gameRoundsTmp: PlanningGameRound[] = [];
        // teams are all possible combinations of two pouleplaces
        teams.forEach(team => {
            const opponents = this.getCombinationsWithOut(team);
            for (let nr = 1; nr <= opponents.length; nr++) {
                let gameRound = gameRoundsTmp.find(gameRoundIt => nr === gameRoundIt.getNumber());
                if (gameRound === undefined) {
                    gameRound = new PlanningGameRound(nr, []);
                    gameRoundsTmp.push(gameRound);
                }
                const combination = new PoulePlaceCombination(team, opponents[nr - 1].get());
                gameRound.getCombinations().push(combination);
            }
        });

        let games = this.flattenGameRounds(gameRoundsTmp);



        const totalNrOfCombinations = this.getTotalNrOfCombinations(nrOfPoulePlaces);
        if (totalNrOfCombinations !== games.length) {
            console.error('not correct permu');
        }

        const uniqueGames: PoulePlaceCombination[] = this.getUniqueGames(games);

        const gameRounds: PlanningGameRound[] = [];
        let gameRound = new PlanningGameRound(1, []);
        gameRounds.push(gameRound);
        let nrOfGames = 0;
        while (uniqueGames.length > 0) {
            const game = uniqueGames.shift();
            if (this.isPoulePlaceInRoundGame(gameRound.getCombinations(), game)) {
                uniqueGames.push(game);
                continue;
            }
            gameRound.getCombinations().push(game); nrOfGames++;
            if (((gameRound.getCombinations().length * 4) + 4) > nrOfPoulePlaces) {
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

    protected getUniqueGames(games: PoulePlaceCombination[]): PoulePlaceCombination[] {
        const combinationNumbers: PoulePlaceCombinationNumber[] = [];
        const uniqueGames: PoulePlaceCombination[] = [];
        games.forEach(game => {
            const gameCombinationNumber = new PoulePlaceCombinationNumber(game);
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

    protected getTotalNrOfCombinations(nrOfPoulePlaces: number): number {
        return this.above(nrOfPoulePlaces, 2) * this.above(nrOfPoulePlaces - 2, 2);
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

    protected getCombinationsWithOut(team: PoulePlace[]): PoulePlaceCombination[] {
        const opponents = this.poule.getPlaces().filter(poulePlaceIt => {
            return team.find(poulePlace => poulePlace === poulePlaceIt) === undefined;
        });
        return this.flattenGameRounds(this.generateRRSchedule(opponents.slice()));
    }

    protected flattenGameRounds(gameRounds: PlanningGameRound[]): PoulePlaceCombination[] {
        let games: PoulePlaceCombination[] = [];
        gameRounds.forEach(gameRound => { games = games.concat(gameRound.getCombinations()); });
        return games;
    }

    protected isPoulePlaceInRoundGame(gameRoundCombinations: PoulePlaceCombination[], game: PoulePlaceCombination): boolean {
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

    private generateRRSchedule(places: PoulePlace[]): PlanningGameRound[] {
        let nrOfPlaces = places.length;
        if (nrOfPlaces === 0) {
            return [];
        }

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
            const combinations: PoulePlaceCombination[] = [];
            const halves = this.chunk(places, 2);
            const firstHalf = halves.shift();
            const secondHalf = halves.shift().reverse();
            // generate each match in the set
            for (let i = 0; i < nrOfMatches; i++) {
                if (firstHalf[i] === undefined || secondHalf[i] === undefined) {
                    continue;
                }
                combinations.push(new PoulePlaceCombination([firstHalf[i]], [secondHalf[i]]));
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

    private chunk(arr: any[], pieces: number): any[][] {
        const chunkSize = Math.round(arr.length / pieces);
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            if (result.length < pieces - 1) {
                result.push(arr.slice(i, i + chunkSize).map(a => a));
            } else {
                result.push(arr.slice(i).map(a => a));
                break;
            }
        }
        return result;
    }
}
