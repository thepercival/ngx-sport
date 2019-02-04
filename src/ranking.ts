import { Game } from './game';
import { GameScoreHomeAway } from './game/score/homeaway';
import { PoulePlace } from './pouleplace';
import { RankingItem } from './ranking/item';
import { Round } from './round';
import { QualifyRule } from './qualify/rule';

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
            this.rankFunctions.push(this.getPoulePlacesWithBestUnitDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostUnitsScored);
            this.rankFunctions.push(this.getPoulePlacesWithBestSubUnitDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostSubUnitsScored);
            this.rankFunctions.push(this.getBestPoulePlacesAgainstEachOther);
        } else if (this.rulesSet === Ranking.RULESSET_EC) {
            this.rankFunctions.push(this.getBestPoulePlacesAgainstEachOther);
            this.rankFunctions.push(this.getPoulePlacesWithBestUnitDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostUnitsScored);
            this.rankFunctions.push(this.getPoulePlacesWithBestSubUnitDifference);
            this.rankFunctions.push(this.getPoulePlacesWithMostSubUnitsScored);
        } else {
            throw new Error('Unknown qualifying rule');
        }
    }

    getRuleDescriptions() {
        return this.rankFunctions.filter(rankFunction => {
            return rankFunction !== this.getPoulePlacesWithBestSubUnitDifference
                && rankFunction !== this.getPoulePlacesWithMostSubUnitsScored;
        })
            .map(rankFunction => {
                if (rankFunction === this.getPoulePlacesWithMostPoints) {
                    return 'het meeste aantal punten';
                } else if (rankFunction === this.getPoulePlacesWithFewestGames) {
                    return 'het minste aantal wedstrijden';
                } else if (rankFunction === this.getPoulePlacesWithBestUnitDifference) {
                    return 'het beste saldo';
                } else if (rankFunction === this.getPoulePlacesWithMostUnitsScored) {
                    return 'het meeste aantal eenheden voor';
                } else if (rankFunction === this.getBestPoulePlacesAgainstEachOther) {
                    return 'het beste onderling resultaat';
                }
                return '';
            });
    }

    getItems(p_poulePlaces: PoulePlace[], games: Game[]): RankingItem[] {
        const items: RankingItem[] = [];
        const poulePlaces = p_poulePlaces.slice(0);
        let nrOfIterations = 0; let rank = 1;
        while (poulePlaces.length > 0) {
            const bestPoulePlaces = this.getBestPoulePlaces(poulePlaces, games, false);
            bestPoulePlaces.forEach(bestPoulePlace => {
                items.push(new RankingItem(++nrOfIterations, rank, bestPoulePlace));
                const index = poulePlaces.indexOf(bestPoulePlace);
                if (index > -1) {
                    poulePlaces.splice(index, 1);
                }
            });
            rank++;            
            if (nrOfIterations > this.maxPoulePlaces) {
                break;
            }
        }
        return items;
    }
    
    getItemsForMultipleRule(multipleRule: QualifyRule): RankingItem[] {
        const selectedPoulePlaces: PoulePlace[] = this.getSingleRankedPoulePlaces(multipleRule.getFromPoulePlaces());
        return this.getItems(selectedPoulePlaces, multipleRule.getFromRound().getGames());
    }

    getEqualItems(rankingItems: RankingItem[]): RankingItem[][] {
        const equalItems = [];
        const maxRank = rankingItems[rankingItems.length-1].getRankExt();
        for( let rank = 1 ; rank <= maxRank ; rank++ ) {
            const equalItemsTmp = rankingItems.filter( item => item.getRankExt() === rank );
            if( equalItemsTmp.length > 1 ) {
                equalItems.push(equalItemsTmp);
            }
        }
        return equalItems;
    }

    getPoulePlaces(rankingItems: RankingItem[], winnersLosers: number): PoulePlace[] {
        const rankingPoulePlaces: PoulePlace[] = rankingItems.map(rankingItem => rankingItem.getPoulePlace());
        if (winnersLosers === Round.LOSERS) {
            rankingPoulePlaces.reverse();
        }
        return rankingPoulePlaces;
    }

    private getSingleRankedPoulePlaces(fromPoulePlaces: PoulePlace[]): PoulePlace[] {
        const selectedPoulePlaces: PoulePlace[] = [];
        fromPoulePlaces.forEach(fromPoulePlace => {
            const fromPoule = fromPoulePlace.getPoule();
            const fromRankNr = fromPoulePlace.getNumber();
            const pouleItems: RankingItem[] = this.getItems(fromPoule.getPlaces(), fromPoule.getGames());
            selectedPoulePlaces.push(this.getItem(pouleItems, fromRankNr).getPoulePlace());
        });
        return selectedPoulePlaces;
    }

    getItem(rankingItems: RankingItem[], rank: number) {
        return rankingItems.find(rankingItemIt => rankingItemIt.getRank() === rank);
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

    private getPoulePlacesWithBestUnitDifference = (poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        return this.getPoulePlacesWithBestDifference(poulePlaces, games, false);
    }

    private getPoulePlacesWithBestSubUnitDifference = (poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        return this.getPoulePlacesWithBestDifference(poulePlaces, games, true);
    }

    private getPoulePlacesWithBestDifference = (p_poulePlaces: PoulePlace[], games: Game[], sub: boolean): PoulePlace[] => {
        let bestUnitDifference;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            const unitDifference = this.getUnitDifference(p_poulePlaceIt, games, sub);
            if (unitDifference === bestUnitDifference || bestUnitDifference === undefined) {
                bestUnitDifference = unitDifference;
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (unitDifference > bestUnitDifference) {
                bestUnitDifference = unitDifference;
                poulePlacesRet = [p_poulePlaceIt];
            }
        });
        return poulePlacesRet;
    }

    private getPoulePlacesWithMostUnitsScored = (poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        return this.getPoulePlacesWithMostScored(poulePlaces, games, false);
    }

    private getPoulePlacesWithMostSubUnitsScored = (poulePlaces: PoulePlace[], games: Game[]): PoulePlace[] => {
        return this.getPoulePlacesWithMostScored(poulePlaces, games, true);
    }

    private getPoulePlacesWithMostScored = (p_poulePlaces: PoulePlace[], games: Game[], sub: boolean): PoulePlace[] => {
        let mostUnitsScored;
        let poulePlacesRet: PoulePlace[] = [];
        p_poulePlaces.forEach(p_poulePlaceIt => {
            const unitsScored = this.getNrOfUnitsScored(p_poulePlaceIt, games, sub);
            if (unitsScored === mostUnitsScored || mostUnitsScored === undefined) {
                mostUnitsScored = unitsScored;
                poulePlacesRet.push(p_poulePlaceIt);
            } else if (unitsScored > mostUnitsScored) {
                mostUnitsScored = unitsScored;
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
            const inHome = p_poulePlaces.some(poulePlace => p_gameIt.isParticipating(poulePlace, Game.HOME));
            const inAway = p_poulePlaces.some(poulePlace => p_gameIt.isParticipating(poulePlace, Game.AWAY));
            if (inHome && inAway) {
                gamesRet.push(p_gameIt);
            }
        });
        return gamesRet;
    }

    getPoints(poulePlace: PoulePlace, games: Game[]): number {
        const config = poulePlace.getPoule().getRound().getNumber().getConfig();
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
            if (finalScore === undefined) {
                return;
            }
            if (this.get(finalScore, homeAway) > this.get(finalScore, !homeAway)) {
                if (game.getScoresMoment() === Game.MOMENT_EXTRATIME) {
                    points += config.getWinPointsExt();
                } else {
                    points += config.getWinPoints();
                }
            } else if (this.get(finalScore, homeAway) === this.get(finalScore, !homeAway)) {
                if (game.getScoresMoment() === Game.MOMENT_EXTRATIME) {
                    points += config.getDrawPointsExt();
                } else {
                    points += config.getDrawPoints();
                }
            }
        });
        return points;
    }

    getUnitDifference(poulePlace: PoulePlace, games: Game[], sub?: boolean): number {
        return (this.getNrOfUnitsScored(poulePlace, games, sub) - this.getNrOfUnitsReceived(poulePlace, games, sub));
    }

    getNrOfUnitsScored(poulePlace: PoulePlace, games: Game[], sub?: boolean): number {
        return this.getNrOfUnits(poulePlace, games, Ranking.SCORED, sub);
    }

    getNrOfUnitsReceived(poulePlace: PoulePlace, games: Game[], sub?: boolean): number {
        return this.getNrOfUnits(poulePlace, games, Ranking.RECEIVED, sub);
    }

    protected getNrOfUnits(poulePlace: PoulePlace, games: Game[], scoredReceived: number, sub: boolean): number {
        let nrOfUnits = 0;
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            const homeAway = game.getHomeAway(poulePlace);
            if (homeAway === undefined) {
                return;
            }
            const finalScore = game.getFinalScore(sub);
            if (finalScore === undefined) {
                return;
            }
            nrOfUnits += this.get(finalScore, scoredReceived === Ranking.SCORED ? homeAway : !homeAway);
        });
        return nrOfUnits;
    }

    getNrOfGamesWithState(poulePlace: PoulePlace, games: Game[]): number {
        let nrOfGames = 0;
        games.forEach(game => {
            if ((game.getState() & this.gameStates) === 0) {
                return;
            }
            if (!game.isParticipating(poulePlace)) {
                return;
            }
            nrOfGames++;
        });
        return nrOfGames;
    }

    get(gameScoreHomeAway: GameScoreHomeAway, homeAway: boolean): number {
        return homeAway === Game.HOME ? gameScoreHomeAway.getHome() : gameScoreHomeAway.getAway();
    }
}
