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

    getItems(rootRound: Round): RankingItem[] {
        return this.getItemsHelper(rootRound);
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
        if (round.getState() === Game.STATE_PLAYED) {
            return this.getDeadPlacesFromRoundPlayed(round);
        }
        return this.getDeadPlacesFromRoundNotPlayed(round);
    }

    protected getDeadPlacesFromRoundNotPlayed(round: Round): PoulePlace[] {
        const deadPlaces: PoulePlace[] = this.getDeadPlacesFromRulesNotPlayed(round, round.getToQualifyRules());
        round.getPoulePlaces()
            .filter(poulePlace => poulePlace.getToQualifyRules().length === 0)
            .forEach(poulePlace => deadPlaces.push(undefined));
        return deadPlaces;
    }

    protected getDeadPlacesFromRulesNotPlayed(fromRound: Round, toRules: QualifyRule[]): PoulePlace[] {
        const fromPlaces = this.getUniqueFromPlaces(toRules);
        let nrOfToPlaces = 0;
        toRules.forEach(toRule => { nrOfToPlaces += toRule.getToPoulePlaces().length; });
        const nrOfDeadPlaces = fromPlaces.length - nrOfToPlaces;
        const deadPlaces = [];
        for (let i = 0; i < nrOfDeadPlaces; i++) {
            deadPlaces.push(undefined);
        }
        return deadPlaces;
    }

    protected getUniqueFromPlaces(toRules: QualifyRule[]): PoulePlace[] {
        const fromPlaces: PoulePlace[] = [];
        toRules.forEach(toRule => {
            const ruleFromPlaces = toRule.getFromPoulePlaces();
            ruleFromPlaces.forEach(ruleFromPlace => {
                if (fromPlaces.find(fromPlace => fromPlace === ruleFromPlace) === undefined) {
                    fromPlaces.push(ruleFromPlace);
                }
            });
        });
        return fromPlaces;
    }

    /**
     * 1 pak weer de unique plaatsen
     * 2 bepaal wie er doorgaan van de winnaars en haal deze eraf
     * 3 doe de plekken zonder to - regels
     * 4 bepaal wie er doorgaan van de verliezers en haal deze eraf
     * 5 voeg de overgebleven plekken toe aan de deadplaces
     *
     * @param round
     */
    protected getDeadPlacesFromRoundPlayed(round: Round): PoulePlace[] {
        const deadPlaces: PoulePlace[] = [];

        const multipleRules = round.getToQualifyRules().filter(toRule => toRule.isMultiple());
        const multipleWinnersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === Round.WINNERS);
        const multipleLosersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === Round.LOSERS);

        let nrOfUniqueFromPlacesMultiple = this.getUniqueFromPlaces(multipleRules).length;
        if (multipleWinnersRule !== undefined) {
            const qualifyAmount = multipleWinnersRule.getToPoulePlaces().length;
            const rankingItems: RankingItem[] = this.getRankingItemsForMultipleRule(multipleWinnersRule);
            for (let i = 0; i < qualifyAmount; i++) {
                nrOfUniqueFromPlacesMultiple--;
                rankingItems.shift();
            }
            const amountQualifyLosers = multipleLosersRule !== undefined ? multipleLosersRule.getToPoulePlaces().length : 0;
            while (nrOfUniqueFromPlacesMultiple - amountQualifyLosers > 0) {
                nrOfUniqueFromPlacesMultiple--;
                deadPlaces.push(rankingItems.shift().getPoulePlace());
            }
        }
        const poulePlacesPer: PoulePlace[][] = this.getPoulePlacesPer(round);
        poulePlacesPer.forEach(poulePlaces => {
            if (round.getWinnersOrLosers() === Round.LOSERS) {
                poulePlaces.reverse();
            }
            const deadPlacesPer = poulePlaces.filter(poulePlace => poulePlace.getToQualifyRules().length === 0);
            this.getDeadPlacesFromPlaceNumber(deadPlacesPer, round).forEach(deadPoulePlace => {
                deadPlaces.push(deadPoulePlace);
            });
        });
        if (multipleLosersRule !== undefined) {
            const qualifyAmount = multipleLosersRule.getToPoulePlaces().length;
            const rankingItems: RankingItem[] = this.getRankingItemsForMultipleRule(multipleLosersRule);
            for (let i = 0; i < qualifyAmount; i++) {
                nrOfUniqueFromPlacesMultiple--;
                rankingItems.pop(); // or shift()???
            }
            while (nrOfUniqueFromPlacesMultiple) {
                nrOfUniqueFromPlacesMultiple--;
                deadPlaces.push(rankingItems.pop().getPoulePlace());
            }
        }
        return deadPlaces;
    }

    getPoulePlacesPer(round: Round): PoulePlace[][] {
        if ( round.isRoot() || round.getQualifyOrder() !== Round.QUALIFYORDER_RANK ) {
            return round.getPoulePlacesPerNumber(Round.WINNERS);
        }
        return round.getPoulePlacesPerPoule();
    }

    protected filterDeadPoulePlacesToAdd(toRule: QualifyRule, deadPlacesToAdd: PoulePlace[]) {
        const rankingItems: RankingItem[] = this.getRankingItemsForMultipleRule(toRule);
        this.getQualifiedRankingItems(toRule, rankingItems).forEach(qualRankingItem => {
            const index = deadPlacesToAdd.indexOf(qualRankingItem.getPoulePlace());
            if (index > -1) {
                deadPlacesToAdd.splice(index, 1);
            }
        });
    }

    protected getQualifiedRankingItems(toRule: QualifyRule, rankingItems: RankingItem[]): RankingItem[] {
        const amount = toRule.getToPoulePlaces().length;
        const start = (toRule.getWinnersOrLosers() === Round.WINNERS) ? 0 : rankingItems.length - amount;
        return rankingItems.splice(start, amount);
    }

    protected getRankingItemsForMultipleRule(toRule: QualifyRule): RankingItem[] {
        const poulePlacesToCompare: PoulePlace[] = [];
        toRule.getFromPoulePlaces().forEach(fromPoulePlace => {
            poulePlacesToCompare.push(this.getRankedEquivalent(fromPoulePlace));
        });
        return this.rankingService.getItems(poulePlacesToCompare, toRule.getFromRound().getGames());
    }

    protected getRankedEquivalent(poulePlace: PoulePlace): PoulePlace {
        const rankingItems = this.rankingService.getItems(poulePlace.getPoule().getPlaces(), poulePlace.getPoule().getGames());
        return this.rankingService.getItem(rankingItems, poulePlace.getNumber()).getPoulePlace();
    }

    protected getDeadPlacesFromPlaceNumber(poulePlaces: PoulePlace[], round: Round): PoulePlace[] {
        let rankingItems: RankingItem[];
        {
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
}
