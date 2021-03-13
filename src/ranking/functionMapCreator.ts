import { PlaceSportPerformance } from "../place/sportPerformance";
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
        this.map[RankingRule.MostPoints] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            let mostPoints: number | undefined;
            let bestPerformances: PlaceSportPerformance[] = [];
            performances.forEach((performance: PlaceSportPerformance) => {
                const points = performance.getPoints();
                if (mostPoints === undefined || points === mostPoints) {
                    mostPoints = points;
                    bestPerformances.push(performance);
                } else if (points > mostPoints) {
                    mostPoints = points;
                    bestPerformances = [performance];
                }
            });
            return bestPerformances;
        };
        this.map[RankingRule.FewestGames] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            let fewestGames: number | undefined;
            let bestPerformances: PlaceSportPerformance[] = [];
            performances.forEach((performance: PlaceSportPerformance) => {
                const nrOfGames = performance.getGames();
                if (fewestGames === undefined || nrOfGames === fewestGames) {
                    fewestGames = nrOfGames;
                    bestPerformances.push(performance);
                } else if (nrOfGames < fewestGames) {
                    fewestGames = nrOfGames;
                    bestPerformances = [performance];
                }
            });
            return bestPerformances;
        };
        this.map[RankingRule.MostUnitsScored] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            return this.getMostScored(performances, false);
        }
        this.map[RankingRule.MostSubUnitsScored] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            return this.getMostScored(performances, true);
        }
    }

    protected getMostScored = (performances: PlaceSportPerformance[], sub: boolean): PlaceSportPerformance[] => {
        let mostScored: number | undefined;
        let bestPerformances: PlaceSportPerformance[] = [];
        performances.forEach((performance: PlaceSportPerformance) => {
            const scored = sub ? performance.getSubScored() : performance.getScored();
            if (mostScored === undefined || scored === mostScored) {
                mostScored = scored;
                bestPerformances.push(performance);
            } else if (scored > mostScored) {
                mostScored = scored;
                bestPerformances = [performance];
            }
        });
        return bestPerformances;
    }
}

export interface RankFunctionMap {
    [key: number]: Function;
}
