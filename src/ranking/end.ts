import { Game } from '../game';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualify/rule';
import { Ranking } from '../ranking';
import { Round } from '../round';
import { RankingItem } from './item';

/* tslint:disable:no-bitwise */

export class EndRanking {
    private rankingService: Ranking;

    constructor(
        private ruleSet: number = Ranking.RULESSET_WC
    ) {
        this.rankingService = new Ranking(ruleSet);
    }

    getItems(firstRound: Round): RankingItem[] {
        return this.getItemsHelper(firstRound);
    }

    protected getItemsHelper(round: Round, rankingItems: RankingItem[] = []): RankingItem[] {
        if (round === undefined) {
            return [];
        }
        this.getItemsHelper(round.getChildRound(Round.WINNERS), rankingItems);
        const deadPlaces = this.getDeadPlacesFromRound(round);
        deadPlaces.forEach(deadPlace => {
            rankingItems.push(new RankingItem(rankingItems.length + 1, deadPlace));
        });
        this.getItemsHelper(round.getChildRound(Round.LOSERS), rankingItems);
        return rankingItems;
    }

    protected getDeadPlacesFromRound(round: Round): PoulePlace[] {
        let deadPlaces: PoulePlace[] = [];
        // eerst alles met multiplie winners torule
        round.getToQualifyRules(Round.WINNERS).forEach(winnersToRule => {
            deadPlaces = deadPlaces.concat(this.getDeadPlacesFromRule(winnersToRule));
        });

        const poulePlacesPer: PoulePlace[][] = round.getPoulePlacesPer(Round.WINNERS, round.getQualifyOrder(), Round.ORDER_VERTICAL);
        poulePlacesPer.forEach(poulePlaces => {
            const deadPlacesPer = poulePlaces.filter(poulePlace => poulePlace.getToQualifyRules().length === 0);
            this.getDeadPlacesFromPlaceNumber(deadPlacesPer, round).forEach(deadPoulePlace => {
                deadPlaces.push(deadPoulePlace);
            });
        });
        // daarna alles met multiplie losers torule
        round.getToQualifyRules(Round.LOSERS).forEach(losersToRule => {
            deadPlaces = deadPlaces.concat(this.getDeadPlacesFromRule(losersToRule));
        });
        return deadPlaces;
    }

    protected getDeadPlacesFromRule(toRule: QualifyRule): PoulePlace[] {
        if (toRule.isMultiple() === false) {
            return [];
        }
        let rankingItems: RankingItem[];
        if (toRule.getFromRound().getState() !== Game.STATE_PLAYED) {
            rankingItems = this.getUndeterminableItems(toRule.getFromPoulePlaces().length);
        } else {
            rankingItems = this.getRankingItemsForMultipleRule(toRule);
        }
        return rankingItems.map(rankingItem => rankingItem.getPoulePlace());
    }

    protected filterDeadRankingItems(toRule: QualifyRule, rankingItems: RankingItem[]): RankingItem[] {
        const amount = rankingItems.length - toRule.getToPoulePlaces().length;
        const start = (toRule.getWinnersOrLosers() === Round.WINNERS) ? 0 : rankingItems.length - amount;
        rankingItems.splice(start, amount);
        return rankingItems;
    }

    /*protected filterQualifiedRankingItems(toRule: QualifyRule, rankingItems: RankingItem[]): RankingItem[] {
        const amount = rankingItems.length - toRule.getToPoulePlaces().length;
        const start = (toRule.getWinnersOrLosers() === Round.WINNERS) ? rankingItems.length - amount : 0;
        rankingItems.splice(start, amount);
        return rankingItems;
    }*/

    protected getRankingItemsForMultipleRule(toRule: QualifyRule): RankingItem[] {
        const poulePlacesToCompare: PoulePlace[] = [];
        toRule.getFromPoulePlaces().forEach(fromPoulePlace => {
            poulePlacesToCompare.push(this.getRankedEquivalent(fromPoulePlace));
        });
        const rankingItems = this.rankingService.getItems(poulePlacesToCompare, toRule.getFromRound().getGames());
        return this.filterDeadRankingItems(toRule, rankingItems);
    }

    protected getRankedEquivalent(poulePlace: PoulePlace): PoulePlace {
        const rankingItems = this.rankingService.getItems(poulePlace.getPoule().getPlaces(), poulePlace.getPoule().getGames());
        return this.rankingService.getItem(rankingItems, poulePlace.getNumber()).getPoulePlace();
    }

    protected getDeadPlacesFromPlaceNumber(poulePlaces: PoulePlace[], round: Round): PoulePlace[] {
        let rankingItems: RankingItem[];
        if (round.getGames().length > 0 && round.getState() !== Game.STATE_PLAYED) {
            rankingItems = this.getUndeterminableItems(poulePlaces.length);
        } else {
            const poulePlacesToCompare: PoulePlace[] = [];
            poulePlaces.forEach(poulePlace => {
                rankingItems = this.rankingService.getItems(poulePlace.getPoule().getPlaces(), poulePlace.getPoule().getGames());
                const rankingItem = this.rankingService.getItem(rankingItems, poulePlace.getNumber());
                if (rankingItem.isSpecified()) {
                    poulePlacesToCompare.push(rankingItem.getPoulePlace());
                }
            });
            rankingItems = this.rankingService.getItems(poulePlacesToCompare, round.getGames());
        }
        return rankingItems.map(rankingItem => rankingItem.getPoulePlace());
    }

    protected getUndeterminableItems(numberOfItems: number): RankingItem[] {
        const rankingItems: RankingItem[] = [];
        const rankingNumbers = Array(numberOfItems).fill(0).map((e, i) => i + 1);
        rankingNumbers.forEach(rankingNumber => {
            rankingItems.push(new RankingItem(rankingItems.length + 1));
        });
        return rankingItems;
    }
}
