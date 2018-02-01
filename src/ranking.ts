import { Game } from './game';
import { PoulePlace } from './pouleplace';

/* tslint:disable:no-bitwise */

export class Ranking {
    static readonly SCORED = 1;
    static readonly RECEIVED = 2;
    static readonly RULESSET_WC = 1;
    static readonly RULESSET_EC = 2;
    private rulesSet: number;
    private rankFunctions: Function[] = [];
    private maxPoulePlaces = 64;

    private gameStates: number;
    private subtractPenaltyPoints = true;

    constructor(
        rulesSet: number,
        gameStates?: number
    ) {
        this.rulesSet = rulesSet;
        if (gameStates === undefined) {
            gameStates = Game.STATE_PLAYED;
        }
        this.gameStates = gameStates;
        this.initFunctions();
    }

    private initFunctions() {
        this.rankFunctions.push(this.getPoulePlacesWithMostPoints);
        this.rankFunctions.push(this.getPoulePlacesWithFewestGames);

        if (this.rulesSet === Ranking.RULESSET_WC) {
            this.rankFunctions.push(this.getPoulePlacesWithBestGoalDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostGoalsScored);
            this.rankFunctions.push(this.getBestPoulePlacesAgainstEachOther);
        } else if (this.rulesSet === Ranking.RULESSET_EC) {
            this.rankFunctions.push(this.getBestPoulePlacesAgainstEachOther);
            this.rankFunctions.push(this.getPoulePlacesWithBestGoalDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostGoalsScored);
        } else {
            throw new Error('Unknown qualifying rule');
        }
    }

    getPoulePlacesByRank(p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[][] {
        const ranking: PoulePlace[][] = [];
        const poulePlaces = p_poulePlaces.slice(0);
        let nrOfIterations = 0;
        while (poulePlaces.length > 0) {
            const bestPoulePlaces = this.getBestPoulePlaces(poulePlaces, games, false);
            ranking.push(bestPoulePlaces);
            bestPoulePlaces.forEach(bestPoulePlace => {
                const index = poulePlaces.indexOf(bestPoulePlace);
                if (index > -1) {
                    poulePlaces.splice(index, 1);
                }
            });
            if (++nrOfIterations > this.maxPoulePlaces) {
                break;
            }
        }
        return ranking;
    }

    getPoulePlacesByRankSingle(p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] {
        let ranking: PoulePlace[] = [];
        this.getPoulePlacesByRank(p_poulePlaces, games).forEach(poulePlaces => ranking = ranking.concat(poulePlaces));
        return ranking;
    }

    private getBestPoulePlaces(p_poulePlaces: PoulePlace[], games: Game[], skip: boolean): PoulePlace[] {
        let poulePlacesRet: PoulePlace[] = p_poulePlaces.slice(0);
        this.rankFunctions.some(rankFunction => {
            if (rankFunction === this.getBestPoulePlacesAgainstEachOther) {
                this.subtractPenaltyPoints = false;
                if (skip === true) {
                    return;
                }
            }
            poulePlacesRet = rankFunction(poulePlacesRet, games);
            return (poulePlacesRet.length < 2);
        });
        this.subtractPenaltyPoints = true;
        return poulePlacesRet;
    }

    private getPoulePlacesWithMostPoints = (p_poulePlaces: PoulePlace[], games: Game[]) => {
        let mostPoints;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            let points = this.getPoints(p_poulePlaceIt, games);
            if (this.subtractPenaltyPoints === true) {
                points -= p_poulePlaceIt.getPenaltyPoints();
            }
            if (mostPoints === undefined || points === mostPoints) {
                mostPoints = points;
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (points > mostPoints) {
                mostPoints = points;
                poulePlacesRet = [];
                poulePlacesRet.push(p_poulePlaceIt);
            }
        });

        return poulePlacesRet;
    }

    private getPoulePlacesWithFewestGames = (p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        let fewestGames;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            const nrOfGames = this.getNrOfGamesWithState(p_poulePlaceIt, games);
            if (fewestGames === undefined || nrOfGames === fewestGames) {
                fewestGames = nrOfGames;
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (nrOfGames < fewestGames) {
                fewestGames = nrOfGames;
                poulePlacesRet = [p_poulePlaceIt];
            }
        });
        return poulePlacesRet;
    }

    private getBestPoulePlacesAgainstEachOther = (p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        const gamesAgainstEachOther = this.getGamesBetweenEachOther(p_poulePlaces, games);
        return this.getBestPoulePlaces(p_poulePlaces, gamesAgainstEachOther, true);
    }

    private getPoulePlacesWithBestGoalDifference = (p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        let bestGoalDifference;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            const goalDifference = this.getGoalDifference(p_poulePlaceIt, games);
            if (goalDifference === bestGoalDifference || bestGoalDifference === undefined) {
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (goalDifference > bestGoalDifference) {
                bestGoalDifference = goalDifference;
                poulePlacesRet = [p_poulePlaceIt];
            }
        });
        return poulePlacesRet;
    }

    private getPoulePlacesWithMostGoalsScored = (p_poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        let mostGoalsScored = 0;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            const goalsScored = this.getNrOfGoalsScored(p_poulePlaceIt, games);
            if (goalsScored === mostGoalsScored) {
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (goalsScored > mostGoalsScored) {
                mostGoalsScored = goalsScored;
                poulePlacesRet = [p_poulePlaceIt];
            }
        });
        return poulePlacesRet;
    }

    private getGamesBetweenEachOther = (p_poulePlaces: PoulePlace[], p_games: Game[]): Game[] => {
        const gamesRet: Game[] = [];
        p_games.forEach(p_gameIt => {
            if ((p_gameIt.getState() & this.gameStates) === 0) {
                return;
            }
            if (!p_poulePlaces.find(p_poulePlaceIt => p_poulePlaceIt === p_gameIt.getPoulePlace(Game.HOME))
                || !p_poulePlaces.find(p_poulePlaceIt => p_poulePlaceIt === p_gameIt.getPoulePlace(Game.AWAY))) {
                return;
            }
            gamesRet.push(p_gameIt);
        });
        return gamesRet;
    }

    getPoints(poulePlace: PoulePlace, games: Game[]): number {
        const config = poulePlace.getPoule().getRound().getConfig();
        let points = 0;
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const homeAway = game.getHomeAway(poulePlace);
            if (homeAway === undefined) {
                return;
            }
            const finalScore = game.getFinalScore();
            if (finalScore.get(homeAway) > finalScore.get(!homeAway)) {
                if (finalScore.getExtraTime()) {
                    points += game.getRound().getConfig().getWinPointsExt();
                } else {
                    points += game.getRound().getConfig().getWinPoints();
                }
            } else if (finalScore.get(homeAway) === finalScore.get(!homeAway)) {
                if (finalScore.getExtraTime()) {
                    points += game.getRound().getConfig().getDrawPointsExt();
                } else {
                    points += game.getRound().getConfig().getDrawPoints();
                }
            }
        });
        return points;
    }

    getGoalDifference(poulePlace: PoulePlace, games: Game[]): number {
        return (this.getNrOfGoalsScored(poulePlace, games) - this.getNrOfGoalsReceived(poulePlace, games));
    }

    getNrOfGoalsScored(poulePlace: PoulePlace, games: Game[]): number {
        return this.getNrOfGoals(poulePlace, games, Ranking.SCORED);
    }

    getNrOfGoalsReceived(poulePlace: PoulePlace, games: Game[]): number {
        return this.getNrOfGoals(poulePlace, games, Ranking.RECEIVED);
    }

    protected getNrOfGoals(poulePlace: PoulePlace, games: Game[], scoredReceived: number): number {
        let nrOfGoals = 0;
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const homeAway = game.getHomeAway(poulePlace);
            if (homeAway === undefined) {
                return;
            }
            nrOfGoals += game.getFinalScore().get(scoredReceived === Ranking.SCORED ? homeAway : !homeAway);
        });
        return nrOfGoals;
    }

    // if(game.getPoulePlace(homeAway) === poulePlace) {

    getNrOfGamesWithState(poulePlace: PoulePlace, games: Game[]): number {
        let nrOfGames = 0;
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const homeAway = game.getHomeAway(poulePlace);
            if (homeAway === undefined) {
                return;
            }
            nrOfGames++;
        });
        return nrOfGames;
    }
}
