
import { AgainstSide } from '../../../../against/side';
import { CompetitionSport } from '../../../../competition/sport';
import { AgainstGame } from '../../../../game/against';
import { Place } from '../../../../place';
import { PlaceSportPerformance } from '../../../../place/sportPerformance';
import { PlaceSportPerformanceCalculator, PlaceSportPerformanceMap } from '../../../../place/sportPerformance/calculator';
import { PlaceAgainstSportPerformanceCalculator } from '../../../../place/sportPerformance/calculator/against';
import { Poule } from '../../../../poule';
import { Round } from '../../../../qualify/group';
import { State } from '../../../../state';
import { RankingFunctionMapCreator } from '../../../functionMapCreator';
import { SportRoundRankingItem } from '../../../item/round/sport';
import { RankingRule } from '../../../rule';
import { SportRoundRankingCalculator } from '../sport';

export class AgainstSportRoundRankingCalculator extends SportRoundRankingCalculator {

    constructor(competitionSport: CompetitionSport, gameStates?: State[]) {
        super(competitionSport, gameStates ?? [State.Finished]);
        const functionMapCreator = new AgainstRankingFunctionMapCreator(competitionSport, gameStates ?? [State.Finished]);
        this.rankFunctionMap = functionMapCreator.getMap();
    }

    getItemsForPoule(poule: Poule): SportRoundRankingItem[] {
        return this.getItems(poule.getRound(), poule.getPlaces(), poule.getAgainstGames());
    }

    getItemsAmongPlaces(poule: Poule, places: Place[]): SportRoundRankingItem[] {
        const games = this.getGamesAmongEachOther(places, poule.getAgainstGames());
        return this.getItems(poule.getRound(), places, games);
    }

    protected getItems(round: Round, places: Place[], games: AgainstGame[]): SportRoundRankingItem[] {
        const calculator = new PlaceAgainstSportPerformanceCalculator(round, this.competitionSport);
        const performances: PlaceSportPerformance[] = calculator.getPerformances(places, this.getFilteredGames(games));
        return this.getItemsHelper(round, performances);
    }

    protected getFilteredGames(games: AgainstGame[]): AgainstGame[] {
        return games.filter((game: AgainstGame) => this.gameStateMap[game.getState()] !== undefined);
    }

    private getGamesAmongEachOther = (places: Place[], games: AgainstGame[]): AgainstGame[] => {
        const gamesRet: AgainstGame[] = [];
        games.forEach((game: AgainstGame) => {
            const inHome = places.some((place: Place) => game.isParticipating(place, AgainstSide.Home));
            const inAway = places.some((place: Place) => game.isParticipating(place, AgainstSide.Away));
            if (inHome && inAway) {
                gamesRet.push(game);
            }
        });
        return gamesRet;
    }
}

export class AgainstRankingFunctionMapCreator extends RankingFunctionMapCreator {

    constructor(private competitionSport: CompetitionSport, private gameStates: State[]) {
        super();
        this.myInitMap();
    }

    private myInitMap() {
        this.map[RankingRule.BestUnitDifference] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            return this.getBestDifference(performances, false);
        };
        this.map[RankingRule.BestSubUnitDifference] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            return this.getBestDifference(performances, true);
        }
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
        this.map[RankingRule.BestAmongEachOther] = (performances: PlaceSportPerformance[]): PlaceSportPerformance[] => {
            const places = performances.map((performances: PlaceSportPerformance) => performances.getPlace());
            const poule = places[0].getPoule();
            const rankingCalculator = new AgainstSportRoundRankingCalculator(this.competitionSport, this.gameStates);
            const rankingItems = rankingCalculator.getItemsAmongPlaces(poule, places)
                .filter((sportRankingItem: SportRoundRankingItem) => sportRankingItem.getRank() === 1);

            if (rankingItems.length === performances.length) {
                return performances;
            }
            const performanceMap = this.getPerformanceMap(performances);
            return rankingItems.map((rankingItem: SportRoundRankingItem) => performanceMap[rankingItem.getPlaceLocation().getRoundLocationId()]);

        }
    }

    private getPerformanceMap(performances: PlaceSportPerformance[]): PlaceSportPerformanceMap {
        const map: PlaceSportPerformanceMap = {};
        performances.forEach((performance: PlaceSportPerformance) => map[performance.getPlaceLocation().getRoundLocationId()] = performance);
        return map;
    }

    private getBestDifference = (performances: PlaceSportPerformance[], sub: boolean): PlaceSportPerformance[] => {
        let bestDiff: number | undefined;
        let bestPerformances: PlaceSportPerformance[] = [];
        performances.forEach((performance: PlaceSportPerformance) => {
            const diff = sub ? performance.getSubDiff() : performance.getDiff();
            if (bestDiff === undefined || diff === bestDiff) {
                bestDiff = diff;
                bestPerformances.push(performance);
            } else if (diff > bestDiff) {
                bestDiff = diff;
                bestPerformances = [performance];
            }
        });
        return bestPerformances;
    }
}