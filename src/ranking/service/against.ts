
import { Round, HorizontalPoule, PlaceLocation } from 'public_api';
import { AgainstSide } from '../../against/side';
import { AgainstGame } from '../../game/against';
import { Place } from '../../place';
import { Poule } from '../../poule';
import { State } from '../../state';
import { RankedRoundItem, UnrankedRoundItem } from '../item';
import { RankingItemsGetterAgainst } from '../itemsgetter/against';
import { RankingRuleSet } from '../ruleSet';

/* eslint:disable:no-bitwise */

export class AgainstRankingServiceHelper {
    private gameStates: number;
    private rankedRoundItemMap: RankedRoundItemMap = {};
    private cacheEnabled = true;

    constructor(
        private rulesSet: RankingRuleSet,
        gameStates?: number
    ) {
        this.gameStates = (gameStates !== undefined) ? gameStates : State.Finished;
    }

    disableCache() {
        this.cacheEnabled = false;
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
            } else /* if (rankFunction === this.filterBestAgainstEachOther) */ {
                return 'het beste onderling resultaat';
            }
        });
    }

    getItemsForPoule(poule: Poule): RankedRoundItem[] {
        if (!this.cacheEnabled || this.rankedRoundItemMap[poule.getNumber()] === undefined) {
            const round: Round = poule.getRound();
            const getter = new RankingItemsGetterAgainst(round, this.gameStates);
            const unrankedItems: UnrankedRoundItem[] = getter.getUnrankedItems(poule.getPlaces(), poule.getAgainstGames());
            const rankedItems = this.rankItems(unrankedItems, true);
            this.rankedRoundItemMap[poule.getNumber()] = rankedItems;
        }
        return this.rankedRoundItemMap[poule.getNumber()];
    }

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): PlaceLocation[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlaceLocation();
        });
    }

    getPlacesForHorizontalPoule(horizontalPoule: HorizontalPoule): Place[] {
        return this.getItemsForHorizontalPoule(horizontalPoule, true).map(rankingItem => {
            return rankingItem.getPlace();
        });
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule, checkOnSingleQualifyRule?: boolean): RankedRoundItem[] {
        const unrankedRoundItems: UnrankedRoundItem[] = [];
        horizontalPoule.getPlaces().forEach(place => {
            if (checkOnSingleQualifyRule && this.hasPlaceSingleQualifyRule(place)) {
                return;
            }
            const pouleRankingItems: RankedRoundItem[] = this.getItemsForPoule(place.getPoule());
            const pouleRankingItem = this.getItemByRank(pouleRankingItems, place.getNumber());
            if (pouleRankingItem === undefined) {
                return;
            }
            unrankedRoundItems.push(pouleRankingItem.getUnranked());
        });
        return this.rankItems(unrankedRoundItems, false);
    }

    /**
     * Place can have a multiple and a single rule, if so than do not
     * process place for horizontalpoule(multiple)
     *
     * @param place
     */
    protected hasPlaceSingleQualifyRule(place: Place): boolean {
        return place.getToQualifyRules().filter(qualifyRuleIt => qualifyRuleIt.isSingle()).length > 0;
    }

    getItemByRank(rankingItems: RankedRoundItem[], rank: number): RankedRoundItem | undefined {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    private rankItems(unrankedItems: UnrankedRoundItem[], againstEachOther: boolean): RankedRoundItem[] {
        const rankedItems: RankedRoundItem[] = [];
        const rankFunctions = this.getRankFunctions(againstEachOther);
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems: UnrankedRoundItem[] = this.findBestItems(unrankedItems, rankFunctions);
            const rank = nrOfIterations + 1;
            bestItems.sort((unrankedA, unrankedB) => {
                if (unrankedA.getPlaceLocation().getPouleNr() === unrankedB.getPlaceLocation().getPouleNr()) {
                    return unrankedA.getPlaceLocation().getPlaceNr() - unrankedB.getPlaceLocation().getPlaceNr();
                }
                return unrankedA.getPlaceLocation().getPouleNr() - unrankedB.getPlaceLocation().getPouleNr();
            });
            bestItems.forEach(bestItem => {
                unrankedItems.splice(unrankedItems.indexOf(bestItem), 1);
                rankedItems.push(new RankedRoundItem(bestItem, ++nrOfIterations, rank));
            });
            // if (nrOfIterations > this.maxPlaces) {
            //     console.error('should not be happening for ranking calc');
            //     break;
            // }
        }
        return rankedItems;
    }

    private findBestItems(orgItems: UnrankedRoundItem[], rankFunctions: Function[]): UnrankedRoundItem[] {
        let bestItems: UnrankedRoundItem[] = orgItems.slice();
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
        let rankFunctions: Function[] = [this.filterMostPoints, this.filterFewestGames];
        const unitRankFunctions: Function[] = [
            this.filterBestUnitDifference, this.filterMostUnitsScored, this.filterBestSubUnitDifference, this.filterMostSubUnitsScored
        ];
        if (this.rulesSet === RankingRuleSet.WC) {
            rankFunctions = rankFunctions.concat(unitRankFunctions);
            if (againstEachOther !== false) {
                rankFunctions.push(this.filterBestAgainstEachOther);
            }
        } else if (this.rulesSet === RankingRuleSet.EC) {
            if (againstEachOther !== false) {
                rankFunctions.push(this.filterBestAgainstEachOther);
            }
            rankFunctions = rankFunctions.concat(unitRankFunctions);
        } else {
            throw new Error('Unknown qualifying rule');
        }
        return rankFunctions;
    }

    private filterMostPoints = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        let mostPoints: number | undefined;
        let bestItems: UnrankedRoundItem[] = [];
        items.forEach(item => {
            const points = item.getPoints();
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

    private filterFewestGames = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        let fewestGames: number | undefined;
        let bestItems: UnrankedRoundItem[] = [];
        items.forEach(item => {
            const nrOfGames = item.getGames();
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

    protected filterUndef<T>(ts: (T | undefined)[]): T[] {
        return ts.filter((t: T | undefined): t is T => !!t)
    }

    private filterBestAgainstEachOther = (unrankedItems: UnrankedRoundItem[]): (UnrankedRoundItem | undefined)[] => {
        const places = this.filterUndef(unrankedItems.map(unrankedItem => {
            return unrankedItem.getRound().getPlace(unrankedItem.getPlaceLocation());
        }));
        const poule = places[0].getPoule();
        if (!poule) {
            return unrankedItems;
        }
        const round: Round = poule.getRound();
        const games = this.getGamesBetweenEachOther(places, poule.getAgainstGames());
        if (games.length === 0) {
            return unrankedItems;
        }
        const getter = new RankingItemsGetterAgainst(round, this.gameStates);
        const unrankedItemsTmp: UnrankedRoundItem[] = getter.getUnrankedItems(places, games);
        const rankedItems = this.rankItems(unrankedItemsTmp, true).filter(rankItem => rankItem.getRank() === 1);
        if (rankedItems.length === unrankedItems.length) {
            return unrankedItems;
        }
        return rankedItems.map(rankedItem => {
            return unrankedItems.find(unrankedItem => {
                return unrankedItem.getPlaceLocation().getPouleNr() === rankedItem.getPlaceLocation().getPouleNr()
                    && unrankedItem.getPlaceLocation().getPlaceNr() === rankedItem.getPlaceLocation().getPlaceNr();
            });
        });
    }

    private filterBestUnitDifference = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterBestDifference(items, false);
    }

    private filterBestSubUnitDifference = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterBestDifference(items, true);
    }

    private filterBestDifference = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
        let bestDiff: number | undefined;
        let bestItems: UnrankedRoundItem[] = [];
        items.forEach(item => {
            const diff = sub ? item.getSubDiff() : item.getDiff();
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

    private filterMostUnitsScored = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterMostScored(items, false);
    }

    private filterMostSubUnitsScored = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterMostScored(items, true);
    }

    private filterMostScored = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
        let mostScored: number | undefined;
        let bestItems: UnrankedRoundItem[] = [];
        items.forEach(item => {
            const scored = sub ? item.getSubScored() : item.getScored();
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

    private getGamesBetweenEachOther = (places: Place[], games: AgainstGame[]): AgainstGame[] => {
        const gamesRet: AgainstGame[] = [];
        games.forEach(p_gameIt => {
            if ((p_gameIt.getState() & this.gameStates) === 0) {
                return;
            }
            const inHome = places.some(place => p_gameIt.isParticipating(place, AgainstSide.Home));
            const inAway = places.some(place => p_gameIt.isParticipating(place, AgainstSide.Away));
            if (inHome && inAway) {
                gamesRet.push(p_gameIt);
            }
        });
        return gamesRet;
    }
}

interface RankedRoundItemMap {
    [key: number]: RankedRoundItem[];
}
