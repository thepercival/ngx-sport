
import { AgainstSide } from '../../../../against/side';
import { CompetitionSport } from '../../../../competition/sport';
import { AgainstGame } from '../../../../game/against';
import { Place } from '../../../../place';
import { Poule } from '../../../../poule';
import { Round } from '../../../../qualify/group';
import { State } from '../../../../state';
import { RankingFunctionMapCreator } from '../../../functionMapCreator';
import { RankedSportRoundItem } from '../../../item/round/sportranked';
import { UnrankedRoundItem } from '../../../item/round/unranked';
import { RankingItemsGetterAgainst } from '../../../itemsgetter/against';
import { RankingRule } from '../../../rule';
import { SportRoundRankingCalculator } from '../sport';

export class AgainstSportRoundRankingCalculator extends SportRoundRankingCalculator {

    constructor(competitionSport: CompetitionSport, gameStates?: State[]) {
        super(competitionSport, gameStates ?? [State.Finished]);
        const functionMapCreator = new AgainstRankingFunctionMapCreator(competitionSport, gameStates ?? [State.Finished]);
        this.rankFunctionMap = functionMapCreator.getMap();
    }

    getItemsForPoule(poule: Poule): RankedSportRoundItem[] {
        return this.getItems(poule.getRound(), poule.getPlaces(), poule.getAgainstGames());
    }

    getItemsAmongPlaces(poule: Poule, places: Place[]): RankedSportRoundItem[] {
        const games = this.getGamesAmongEachOther(places, poule.getAgainstGames());
        return this.getItems(poule.getRound(), places, games);
    }

    protected getItems(round: Round, places: Place[], games: AgainstGame[]): RankedSportRoundItem[] {
        const getter = new RankingItemsGetterAgainst(round);
        const unrankedItems: UnrankedRoundItem[] = getter.getUnrankedItems(places, this.getFilteredGames(games));
        const scoreConfig = round.getValidScoreConfig(this.competitionSport);
        const ruleSet = this.competitionSport.getCompetition().getRankingRuleSet();
        const rankingRules: RankingRule[] = this.rankingRuleGetter.getRules(ruleSet, scoreConfig.useSubScore());
        return this.rankItems(unrankedItems, rankingRules);
    }

    protected getFilteredGames(games: AgainstGame[]): AgainstGame[] {
        return games.filter((game: AgainstGame) => {
            return this.gameStateMap[game.getState()] !== undefined
                && this.competitionSport === game.getCompetitionSport();
        });
    }

    protected rankItems(unrankedItems: UnrankedRoundItem[], rankingRules: RankingRule[]): RankedSportRoundItem[] {
        const rankedItems: RankedSportRoundItem[] = [];
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems: UnrankedRoundItem[] = this.findBestItems(unrankedItems, rankingRules);
            const rank = nrOfIterations + 1;
            bestItems.sort((unrankedA, unrankedB) => {
                if (unrankedA.getPlaceLocation().getPouleNr() === unrankedB.getPlaceLocation().getPouleNr()) {
                    return unrankedA.getPlaceLocation().getPlaceNr() - unrankedB.getPlaceLocation().getPlaceNr();
                }
                return unrankedA.getPlaceLocation().getPouleNr() - unrankedB.getPlaceLocation().getPouleNr();
            });
            bestItems.forEach(bestItem => {
                unrankedItems.splice(unrankedItems.indexOf(bestItem), 1);
                rankedItems.push(new RankedSportRoundItem(bestItem, ++nrOfIterations, rank));
            });
        }
        return rankedItems;
    }

    private findBestItems(orgItems: UnrankedRoundItem[], rankingRules: RankingRule[]): UnrankedRoundItem[] {
        let bestItems: UnrankedRoundItem[] = orgItems.slice();
        rankingRules.some((rankingRule: RankingRule) => {
            const rankingFunction = this.rankFunctionMap[rankingRule];
            if (rankingRule === RankingRule.BestAmongEachOther && orgItems.length === bestItems.length) {
                return false;
            }
            bestItems = rankingFunction(bestItems);
            return (bestItems.length < 2);
        });
        return bestItems;
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
        this.map[RankingRule.BestUnitDifference] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
            return this.getBestDifference(items, false);
        };
        this.map[RankingRule.BestSubUnitDifference] = (items: UnrankedRoundItem[]): UnrankedRoundItem[] => {
            return this.getBestDifference(items, true);
        }
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
        this.map[RankingRule.BestAmongEachOther] = (unrankedItems: UnrankedRoundItem[]): (UnrankedRoundItem | undefined)[] => {
            const places = this.filterUndef(unrankedItems.map((unrankedItem: UnrankedRoundItem) => {
                return unrankedItem.getRound().getPlace(unrankedItem.getPlaceLocation());
            }));
            const poule = places[0].getPoule();
            if (!poule) {
                return unrankedItems;
            }
            const rankingService = new AgainstSportRoundRankingCalculator(this.competitionSport, this.gameStates);
            const rankedItems = rankingService.getItemsAmongPlaces(poule, places)
                .filter((rankedItem: RankedSportRoundItem) => rankedItem.getRank() === 1);

            if (rankedItems.length === unrankedItems.length) {// performance
                return unrankedItems;
            }
            return rankedItems.map(rankedItem => {
                return unrankedItems.find(unrankedItem => {
                    return unrankedItem.getPlaceLocation().getPouleNr() === rankedItem.getPlaceLocation().getPouleNr()
                        && unrankedItem.getPlaceLocation().getPlaceNr() === rankedItem.getPlaceLocation().getPlaceNr();
                });
            });
        }
        // this.rankFunctionMap[RankingRule.BestAmongEachOther] = (unrankedItems: UnrankedRoundItem[]): (UnrankedRoundItem | undefined)[] => {
        //     const places = this.filterUndef(unrankedItems.map(unrankedItem => {
        //         return unrankedItem.getRound().getPlace(unrankedItem.getPlaceLocation());
        //     }));
        //     const poule = places[0].getPoule();
        //     if (!poule) {
        //         return unrankedItems;
        //     }
        //     const round: Round = poule.getRound();
        //     const games = this.getGamesAmongEachOther(places, poule.getAgainstGames());
        //     if (games.length === 0) {
        //         return unrankedItems;
        //     }
        //     const getter = new RankingItemsGetterAgainst(round);
        //     const unrankedItemsTmp: UnrankedRoundItem[] = getter.getUnrankedItems(places, games);
        //     const scoreConfig: ScoreConfig = round.getValidScoreConfig(this.competitionSport);
        //     const rankedItems = this.rankItems(unrankedItemsTmp, scoreConfig, true).filter(rankItem => rankItem.getRank() === 1);
        //     if (rankedItems.length === unrankedItems.length) {
        //         return unrankedItems;
        //     }
        //     return rankedItems.map(rankedItem => {
        //         return unrankedItems.find(unrankedItem => {
        //             return unrankedItem.getPlaceLocation().getPouleNr() === rankedItem.getPlaceLocation().getPouleNr()
        //                 && unrankedItem.getPlaceLocation().getPlaceNr() === rankedItem.getPlaceLocation().getPlaceNr();
        //         });
        //     });
        // }
    }

    private filterUndef<T>(ts: (T | undefined)[]): T[] {
        return ts.filter((t: T | undefined): t is T => !!t)
    }

    private getBestDifference = (items: UnrankedRoundItem[], sub: boolean): UnrankedRoundItem[] => {
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
}