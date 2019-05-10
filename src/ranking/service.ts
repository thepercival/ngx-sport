import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { PoulePlaceLocation } from '../pouleplace/location';
import { QualifyRuleMultiple } from '../qualify/rule/multiple';
import { Round } from '../round';
import { RankingItemsGetter } from './helper';
import { RoundRankingItem } from './item';

/* tslint:disable:no-bitwise */

export class RankingService {
    static readonly RULESSET_WC = 1;
    static readonly RULESSET_EC = 2;
    private rulesSet: number;
    private maxPoulePlaces = 64;
    private gameStates: number;

    constructor(
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

    getItemsForPoule(poule: Poule): RoundRankingItem[] {
        const round: Round = poule.getRound();
        const getter = new RankingItemsGetter(round, this.gameStates);
        const unrankedItems: RoundRankingItem[] = getter.getFormattedItems(poule.getPlaces(), poule.getGames());
        return this.rankItems(unrankedItems, true);
    }

    getItemsForMultipleRule(multipleRule: QualifyRuleMultiple): RoundRankingItem[] {
        const placeLocations = multipleRule.getFromHorizontalPoule().getPlaces().map(poulePlace => poulePlace.getLocation());
        return this.getItemsForPlaceLocations(multipleRule.getFromRound(), placeLocations);
    }

    getItemsForPlaceLocations(round: Round, placeLocations: PoulePlaceLocation[]): RoundRankingItem[] {
        const roundItems: RoundRankingItem[] = [];
        placeLocations.forEach(placeLocation => {
            const pouleItems: RoundRankingItem[] = this.getItemsForPoule(round.getPoule(placeLocation.getPouleNr()));
            const fromRankNr = placeLocation.getPlaceNr();
            roundItems.push(this.getItemByRank(pouleItems, fromRankNr));
        });
        return this.rankItems(roundItems, false);
    }

    getItemByRank(rankingItems: RoundRankingItem[], rank: number): RoundRankingItem {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    private rankItems(unrankedItems: RoundRankingItem[], againstEachOther: boolean): RoundRankingItem[] {
        const rankedItems: RoundRankingItem[] = [];
        const rankFunctions = this.getRankFunctions(againstEachOther);
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems = this.findBestItems(unrankedItems, rankFunctions);
            const rank = nrOfIterations + 1;
            bestItems.forEach(bestItem => {
                bestItem.setUniqueRank(++nrOfIterations);
                bestItem.setRank(rank);
                const idx = unrankedItems.indexOf(bestItem);
                if (idx > -1) {
                    unrankedItems.splice(idx, 1);
                }
                rankedItems.push(bestItem);
            });
            if (nrOfIterations > this.maxPoulePlaces) {
                console.error('should not be happening for ranking calc');
                break;
            }
        }
        return rankedItems;
    }

    private findBestItems(orgItems: RoundRankingItem[], rankFunctions: Function[]): RoundRankingItem[] {
        let bestItems: RoundRankingItem[] = orgItems.slice();
        rankFunctions.some(rankFunction => {
            if (rankFunction === this.filterBestAgainstEachOther && orgItems.length === bestItems.length) {
                return false;
            }
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

    private filterMostPoints = (items: RoundRankingItem[]): RoundRankingItem[] => {
        let mostPoints;
        let bestItems: RoundRankingItem[] = [];
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

    private filterFewestGames = (items: RoundRankingItem[]): RoundRankingItem[] => {
        let fewestGames;
        let bestItems: RoundRankingItem[] = [];
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

    private filterBestAgainstEachOther = (items: RoundRankingItem[]): RoundRankingItem[] => {
        if (items.length === 0) {
            return [];
        }
        const poulePlaces = items.map(item => {
            return item.getRound().getPoulePlace(item.getPoulePlaceLocation());
        });
        if (poulePlaces.length === 0) {
            return [];
        }
        const poule = poulePlaces[0].getPoule();
        const round: Round = poule.getRound();
        const games = this.getGamesBetweenEachOther(poulePlaces, poule.getGames());
        if (games.length === 0) {
            return items;
        }
        const getter = new RankingItemsGetter(round, this.gameStates);
        const unrankedItems: RoundRankingItem[] = getter.getFormattedItems(poulePlaces, games);
        const rankedItems = this.rankItems(unrankedItems, true).filter(rankItem => rankItem.getRank() === 1);
        if (rankedItems.length === items.length) {
            return items;
        }
        return rankedItems.map(rankedItem => {
            return items.find(item => item.getPoulePlaceLocation().getPouleNr() === rankedItem.getPoulePlaceLocation().getPouleNr()
                && item.getPoulePlaceLocation().getPlaceNr() === rankedItem.getPoulePlaceLocation().getPlaceNr())
        });
    }

    private filterBestUnitDifference = (items: RoundRankingItem[]): RoundRankingItem[] => {
        return this.filterBestDifference(items, false);
    }

    private filterBestSubUnitDifference = (items: RoundRankingItem[]): RoundRankingItem[] => {
        return this.filterBestDifference(items, true);
    }

    private filterBestDifference = (items: RoundRankingItem[], sub: boolean): RoundRankingItem[] => {
        let bestDiff;
        let bestItems: RoundRankingItem[] = [];
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

    private filterMostUnitsScored = (items: RoundRankingItem[]): RoundRankingItem[] => {
        return this.filterMostScored(items, false);
    }

    private filterMostSubUnitsScored = (items: RoundRankingItem[]): RoundRankingItem[] => {
        return this.filterMostScored(items, true);
    }

    private filterMostScored = (items: RoundRankingItem[], sub: boolean): RoundRankingItem[] => {
        let mostScored;
        let bestItems: RoundRankingItem[] = [];
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

    private getGamesBetweenEachOther = (poulePlaces: PoulePlace[], games: Game[]): Game[] => {
        const gamesRet: Game[] = [];
        games.forEach(p_gameIt => {
            if ((p_gameIt.getState() & this.gameStates) === 0) {
                return;
            }
            const inHome = poulePlaces.some(poulePlace => p_gameIt.isParticipating(poulePlace, Game.HOME));
            const inAway = poulePlaces.some(poulePlace => p_gameIt.isParticipating(poulePlace, Game.AWAY));
            if (inHome && inAway) {
                gamesRet.push(p_gameIt);
            }
        });
        return gamesRet;
    }
}
