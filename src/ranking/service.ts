import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualify/rule';
import { Round } from '../round';
import { RankingItemsGetter } from './helper';
import { RankingItem } from './item';

/* tslint:disable:no-bitwise */

export class RankingService {
    static readonly SCORED = 1;
    static readonly RECEIVED = 2;
    static readonly RULESSET_WC = 1;
    static readonly RULESSET_EC = 2;
    private rulesSet: number;
    private maxPoulePlaces = 64;
    private gameStates: number;

    constructor(
        private round: Round,
        rulesSet: number,
        gameStates?: number
    ) {
        this.rulesSet = rulesSet;
        if (gameStates === undefined) {
            gameStates = Game.STATE_PLAYED;
        }
        this.gameStates = gameStates;
    }

    getRuleDescriptions() {
        return this.getRankFunctions().filter(rankFunction => {
            return rankFunction !== this.filterBestSubUnitDifference
                && rankFunction !== this.filterMostSubUnitsScored;
        }).map(rankFunction => {
            if (rankFunction === this.filterMostPoints) {
                return 'het meeste aantal punten';
            } else if (rankFunction === this.filterFewestGames) {
                return 'het minste aantal wedstrijden';
            } else if (rankFunction === this.filterBestUnitDifference) {
                return 'het beste saldo';
            } else if (rankFunction === this.filterMostUnitsScored) {
                return 'het meeste aantal eenheden voor';
            } else if (rankFunction === this.filterBestAgainstEachOther) {
                return 'het beste onderling resultaat';
            }
            return '';
        });
    }

    getItemsForPoule(poule: Poule): RankingItem[] {
        return this.getItems(poule.getPlaces(), poule.getGames(), true)
    }

    getItemsForMultipleRule(multipleRule: QualifyRule): RankingItem[] {
        const roundItems: RankingItem[] = [];
        multipleRule.getFromPoulePlaces().forEach(fromPoulePlace => {
            const pouleItems: RankingItem[] = this.getItemsForPoule(fromPoulePlace.getPoule());
            const fromRankNr = fromPoulePlace.getNumber();
            roundItems.push(this.getItemByRank(pouleItems, fromRankNr));
        });
        return this.rankItems(roundItems, false);
    }

    private getItems(poulePlaces: PoulePlace[], games: Game[], againstEachOther: boolean): RankingItem[] {
        const getter = new RankingItemsGetter(this.round.getNumber().getConfig(), this.gameStates);
        const unrankedItems: RankingItem[] = getter.getFormattedItems(poulePlaces, games);
        return this.rankItems(unrankedItems, againstEachOther);
    }

    private rankItems(unrankedItems: RankingItem[], againstEachOther: boolean): RankingItem[] {
        const rankedItems: RankingItem[] = [];
        const rankFunctions = this.getRankFunctions(againstEachOther);
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems = this.findBestItems(unrankedItems, rankFunctions);
            const rank = nrOfIterations + 1;
            bestItems.forEach(bestItem => {
                bestItem.setUniqueRank(++nrOfIterations);
                bestItem.setRank(rank);
                unrankedItems.splice(unrankedItems.indexOf(bestItem), 1);
                rankedItems.push(bestItem);
            });
            if (nrOfIterations > this.maxPoulePlaces) {
                console.error('should not be happening for ranking calc');
                break;
            }
        }
        return rankedItems;
    }

    // getPoulePlaces(rankingItems: RankingItem[], winnersLosers: number): PoulePlace[] {
    //     const rankingPoulePlaces: PoulePlace[] = rankingItems.map(rankingItem => rankingItem.getPoulePlace());
    //     if (winnersLosers === Round.LOSERS) {
    //         rankingPoulePlaces.reverse();
    //     }
    //     return rankingPoulePlaces;
    // }

    private getItemByRank(rankingItems: RankingItem[], rank: number): RankingItem {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    private findBestItems(p_items: RankingItem[], rankFunctions: Function[]): RankingItem[] {
        let bestItems: RankingItem[] = p_items.slice(0);
        rankFunctions.some(rankFunction => {
            bestItems = rankFunction(bestItems);
            return (bestItems.length < 2);
        });
        return bestItems;
    }

    private getRankFunctions(againstEachOther?: boolean): Function[] {
        const rankFunctions: Function[] = [this.filterMostPoints, this.filterFewestGames];
        if (this.rulesSet === RankingService.RULESSET_WC) {
            rankFunctions.push(this.filterBestUnitDifference);
            rankFunctions.push(this.filterMostUnitsScored);
            rankFunctions.push(this.filterBestSubUnitDifference);
            rankFunctions.push(this.filterMostSubUnitsScored);
            if (againstEachOther !== false) {
                rankFunctions.push(this.filterBestAgainstEachOther);
            }
        } else if (this.rulesSet === RankingService.RULESSET_EC) {
            if (againstEachOther !== false) {
                rankFunctions.push(this.filterBestAgainstEachOther);
            }
            rankFunctions.push(this.filterBestUnitDifference);
            rankFunctions.push(this.filterMostUnitsScored);
            rankFunctions.push(this.filterBestSubUnitDifference);
            rankFunctions.push(this.filterMostSubUnitsScored);
        } else {
            throw new Error('Unknown qualifying rule');
        }
        return rankFunctions;
    }

    private filterMostPoints = (items: RankingItem[]): RankingItem[] => {
        let mostPoints;
        let bestItems: RankingItem[] = [];
        items.forEach(item => {
            let points = item.getPoints();
            if (mostPoints === undefined || points === mostPoints) {
                mostPoints = points;
                bestItems.push(item);
            } else if (points > mostPoints) {
                mostPoints = points;
                bestItems = [];
                bestItems.push(item);
            }
        });
        return bestItems;
    }

    private filterFewestGames = (items: RankingItem[]): RankingItem[] => {
        let fewestGames;
        let bestItems: RankingItem[] = [];
        items.forEach(item => {
            let nrOfGames = item.getGames();
            if (fewestGames === undefined || nrOfGames === fewestGames) {
                fewestGames = nrOfGames;
                bestItems.push(item);
            } else if (nrOfGames < fewestGames) {
                fewestGames = nrOfGames;
                bestItems = [item];
            }
        });
        return bestItems;
    }

    private filterBestAgainstEachOther = (items: RankingItem[]): RankingItem[] => {

        // met de rankFunctions zonder eachother
        // met de games van alleen de items
        // alleen rank 1 door!!

        // nieuwe items zonder penaltyPoints

        // const poulePlaces = get from items
        // const games = get from ?filter on pouleplaces
        // getGamesBetweenEachOther = (p_poulePlaces: PoulePlace[], p_games: Game[]): Game[] => {
        // const itemsNew = this.getItems(poulePlaces, games, false);
        // filter on rank 1 
        // and only return items with same pouleplace locations
        return [];
    }

    private filterBestUnitDifference = (items: RankingItem[]): RankingItem[] => {
        return this.filterBestDifference(items, false);
    }

    private filterBestSubUnitDifference = (items: RankingItem[]): RankingItem[] => {
        return this.filterBestDifference(items, true);
    }

    private filterBestDifference = (items: RankingItem[], sub: boolean): RankingItem[] => {
        let bestDiff;
        let bestItems: RankingItem[] = [];
        items.forEach(item => {
            let diff = sub ? item.getSubDiff() : item.getDiff();
            if (bestDiff === undefined || diff === bestDiff) {
                bestDiff = diff;
                bestItems.push(item);
            } else if (diff > bestDiff) {
                bestDiff = diff;
                bestItems = [item];
            }
        });
        return bestItems;
    }

    private filterMostUnitsScored = (items: RankingItem[]): RankingItem[] => {
        return this.filterMostScored(items, false);
    }

    private filterMostSubUnitsScored = (items: RankingItem[]): RankingItem[] => {
        return this.filterMostScored(items, true);
    }

    private filterMostScored = (items: RankingItem[], sub: boolean): RankingItem[] => {
        let mostScored;
        let bestItems: RankingItem[] = [];
        items.forEach(item => {
            let scored = sub ? item.getSubScored() : item.getScored();
            if (mostScored === undefined || scored === mostScored) {
                mostScored = scored;
                bestItems.push(item);
            } else if (scored > mostScored) {
                mostScored = scored;
                bestItems = [item];
            }
        });
        return bestItems;
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

    // private getNrOfGamesWithState(poulePlace: PoulePlace, games: Game[]): number {
    //     let nrOfGames = 0;
    //     games.forEach(game => {
    //         if ((game.getState() & this.gameStates) === 0) {
    //             return;
    //         }
    //         if (!game.isParticipating(poulePlace)) {
    //             return;
    //         }
    //         nrOfGames++;
    //     });
    //     return nrOfGames;
    // }
}
