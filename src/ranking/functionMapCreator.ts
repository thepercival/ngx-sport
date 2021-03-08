import { UnrankedRoundItem } from "./item/round/unranked";
import { RankingRule } from "./rule";

export class RankingFunctionMapCreator {
    protected map: RankFunctionMap = {};

    constructor(
    ) {
        this.initMap();
    }

    getMap(): RankFunctionMap {
        return this.map;
    }

    private initMap() {
        this.map[RankingRule.MostPoints] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
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
        };
        this.map[RankingRule.FewestGames] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
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
        };
        this.map[RankingRule.MostUnitsScored] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
            return this.getMostScored(items, false);
        }
        this.map[RankingRule.MostSubUnitsScored] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
            return this.getMostScored(items, true);
        }
    }

    protected getMostScored = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
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

export interface RankFunctionMap {
    [key: number]: Function;
}
