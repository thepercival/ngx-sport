

/* eslint:disable:no-bitwise */

import { Place } from "../../place";
import { PlaceLocation } from "../../place/location";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { Round } from "../../qualify/group";
import { State } from "../../state";
import { RankedRoundItem, UnrankedRoundItem } from "../item";
import { RankingItemsGetterTogether } from "../itemsgetter/together";

export class TogetherRankingServiceHelper {
    private gameStates: number;
    private rankedRoundItemMap: RankedRoundItemMap = {};
    private cacheEnabled = true;

    constructor(
        gameStates?: number
    ) {
        this.gameStates = (gameStates !== undefined) ? gameStates : State.Finished;
    }

    disableCache() {
        this.cacheEnabled = false;
    }

    getRuleDescriptions() {
        return this.getRankFunctions().filter(rankFunction => {
            return rankFunction !== this.filterMostSubUnitsScored;
        }).map(rankFunction => {
            if (rankFunction === this.filterMostPoints) {
                return 'het meeste aantal punten';
            } else /*if (rankFunction === this.filterFewestGames)*/ {
                return 'het minste aantal wedstrijden';
            }
        });
    }

    getItemsForPoule(poule: Poule): RankedRoundItem[] {
        if (!this.cacheEnabled || this.rankedRoundItemMap[poule.getNumber()] === undefined) {
            const round: Round = poule.getRound();
            const getter = new RankingItemsGetterTogether(round, this.gameStates);
            const unrankedItems: UnrankedRoundItem[] = getter.getUnrankedItems(poule.getPlaces(), poule.getTogetherGames());
            const rankedItems = this.rankItems(unrankedItems);
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
            return rankingItem.getPlace() as Place;
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
        return this.rankItems(unrankedRoundItems);
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

    private rankItems(unrankedItems: UnrankedRoundItem[]): RankedRoundItem[] {
        const rankedItems: RankedRoundItem[] = [];
        const rankFunctions = this.getRankFunctions();
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
            bestItems = rankFunction(bestItems);
            return (bestItems.length < 2);
        });
        return bestItems;
    }

    private getRankFunctions(): Function[] {
        let rankFunctions: Function[] = [
            this.filterMostUnitsScored,
            this.filterMostSubUnitsScored,
            this.filterFewestGames
        ];
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
}

interface RankedRoundItemMap {
    [key: number]: RankedRoundItem[];
}
