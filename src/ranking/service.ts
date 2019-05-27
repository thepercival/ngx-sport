import { Competitor } from '../competitor';
import { Game } from '../game';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';
import { RankingItemsGetter } from './helper';
import { RankedRoundItem, UnrankedRoundItem } from './item';

/* tslint:disable:no-bitwise */

export class RankingService {
    static readonly RULESSET_WC = 1;
    static readonly RULESSET_EC = 2;
    private maxPoulePlaces = 64;
    private gameStates: number;
    private cache: {} = {};

    constructor(
        private round: Round, /* because cache-id is poulenumber */
        private rulesSet: number,
        gameStates?: number
    ) {
        this.gameStates = (gameStates !== undefined) ? gameStates : Game.STATE_PLAYED;
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

    getItemsForPoule(poule: Poule): RankedRoundItem[] {
        if (this.cache[poule.getNumber()] === undefined) {
            const round: Round = poule.getRound();
            const getter = new RankingItemsGetter(round, this.gameStates);
            const unrankedItems: UnrankedRoundItem[] = getter.getUnrankedItems(poule.getPlaces(), poule.getGames());
            const rankedItems = this.rankItems(unrankedItems, true);
            this.cache[poule.getNumber()] = rankedItems;
        }
        return this.cache[poule.getNumber()];
    }

    getItemsForHorizontalPoule(horizontalPoule: HorizontalPoule): RankedRoundItem[] {
        const unrankedRoundItems: UnrankedRoundItem[] = [];
        horizontalPoule.getPlaces().forEach(place => {
            const pouleRankingItems: RankedRoundItem[] = this.getItemsForPoule(place.getPoule());
            const pouleRankingItem = this.getItemByRank(pouleRankingItems, place.getNumber());
            unrankedRoundItems.push(pouleRankingItem.getUnranked());
        });
        return this.rankItems(unrankedRoundItems, false);
    }

    getPlaceLocationsForHorizontalPoule(horizontalPoule: HorizontalPoule): PlaceLocation[] {
        return this.getItemsForHorizontalPoule(horizontalPoule).map(rankingItem => {
            return rankingItem.getPlaceLocation();
        });
    }

    getItemByRank(rankingItems: RankedRoundItem[], rank: number): RankedRoundItem {
        return rankingItems.find(rankingItemIt => rankingItemIt.getUniqueRank() === rank);
    }

    getCompetitor(placeLocation: PlaceLocation): Competitor {
        const poulePlace = this.round.getPoule(placeLocation.getPouleNr()).getPlace(placeLocation.getPlaceNr());
        return poulePlace ? poulePlace.getCompetitor() : undefined;
    }

    private rankItems(unrankedItems: UnrankedRoundItem[], againstEachOther: boolean): RankedRoundItem[] {
        const rankedItems: RankedRoundItem[] = [];
        const rankFunctions = this.getRankFunctions(againstEachOther);
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems: UnrankedRoundItem[] = this.findBestItems(unrankedItems, rankFunctions);
            const rank = nrOfIterations + 1;
            bestItems.forEach(bestItem => {
                const idx = unrankedItems.indexOf(bestItem);
                if (idx > -1) {
                    unrankedItems.splice(idx, 1);
                }
                rankedItems.push(new RankedRoundItem(bestItem, ++nrOfIterations, rank));
            });
            if (nrOfIterations > this.maxPoulePlaces) {
                console.error('should not be happening for ranking calc');
                break;
            }
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

    private filterMostPoints = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        let mostPoints;
        let bestItems: UnrankedRoundItem[] = [];
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

    private filterFewestGames = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        let fewestGames;
        let bestItems: UnrankedRoundItem[] = [];
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

    private filterBestAgainstEachOther = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        if (items.length === 0) {
            return [];
        }
        const poulePlaces = items.map(item => {
            return item.getRound().getPoulePlace(item.getPlaceLocation());
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
        const unrankedItems: UnrankedRoundItem[] = getter.getUnrankedItems(poulePlaces, games);
        const rankedItems = this.rankItems(unrankedItems, true).filter(rankItem => rankItem.getRank() === 1);
        if (rankedItems.length === items.length) {
            return items;
        }
        return rankedItems.map(rankedItem => {
            return items.find(item => item.getPlaceLocation().getPouleNr() === rankedItem.getPlaceLocation().getPouleNr()
                && item.getPlaceLocation().getPlaceNr() === rankedItem.getPlaceLocation().getPlaceNr())
        });
    }

    private filterBestUnitDifference = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterBestDifference(items, false);
    }

    private filterBestSubUnitDifference = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterBestDifference(items, true);
    }

    private filterBestDifference = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
        let bestDiff;
        let bestItems: UnrankedRoundItem[] = [];
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

    private filterMostUnitsScored = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterMostScored(items, false);
    }

    private filterMostSubUnitsScored = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
        return this.filterMostScored(items, true);
    }

    private filterMostScored = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
        let mostScored;
        let bestItems: UnrankedRoundItem[] = [];
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
