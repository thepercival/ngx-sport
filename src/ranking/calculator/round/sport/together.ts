import { CompetitionSport } from "../../../../competition/sport";
import { TogetherGame } from "../../../../game/together";
import { Poule } from "../../../../poule";
import { Round } from "../../../../qualify/group";
import { State } from "../../../../state";
import { RankedSportRoundItem } from "../../../item/round/sportranked";
import { UnrankedSportRoundItem } from "../../../item/round/sportunranked";
import { RankingItemsGetterTogether } from "../../../itemsgetter/together";
import { RankingRule } from "../../../rule";
import { SportRoundRankingCalculator } from "../sport";

export class TogetherSportRoundRankingCalculator extends SportRoundRankingCalculator {

    constructor(competitionSport: CompetitionSport, gameStates?: State[]) {
        super(competitionSport, gameStates ?? [State.Finished]);
    }

    getItemsForPoule(poule: Poule): RankedSportRoundItem[] {
        const round: Round = poule.getRound();
        const getter = new RankingItemsGetterTogether(round, this.competitionSport);
        const games = this.getFilteredGames(poule.getTogetherGames());
        const unrankedItems: UnrankedSportRoundItem[] = getter.getUnrankedItems(poule.getPlaces(), games);
        const scoreConfig = round.getValidScoreConfig(this.competitionSport);
        const ruleSet = this.competitionSport.getCompetition().getRankingRuleSet();
        const rankingRules: RankingRule[] = this.rankingRuleGetter.getRules(ruleSet, scoreConfig.useSubScore());
        return this.rankItems(unrankedItems, rankingRules);
    }

    protected getFilteredGames(games: TogetherGame[]): TogetherGame[] {
        return games.filter((game: TogetherGame) => this.gameStateMap[game.getState()] !== undefined);
    }

    protected rankItems(unrankedItems: UnrankedSportRoundItem[], rankingRules: RankingRule[]): RankedSportRoundItem[] {
        const rankedItems: RankedSportRoundItem[] = [];
        let nrOfIterations = 0;
        while (unrankedItems.length > 0) {
            const bestItems: UnrankedSportRoundItem[] = this.findBestItems(unrankedItems, rankingRules);
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
            // if (nrOfIterations > this.maxPlaces) {
            //     console.error('should not be happening for ranking calc');
            //     break;
            // }
        }
        return rankedItems;
    }

    private findBestItems(orgItems: UnrankedSportRoundItem[], rankingRules: RankingRule[]): UnrankedSportRoundItem[] {
        let bestItems: UnrankedSportRoundItem[] = orgItems.slice();
        rankingRules.some((rankingRule: RankingRule) => {
            const rankingFunction = this.rankFunctionMap[rankingRule];
            bestItems = rankingFunction(bestItems);
            return (bestItems.length < 2);
        });
        return bestItems;
    }
}