import { Game } from '../game';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualify/rule';
import { Round } from '../round';
import { EndRankingItem, RoundRankingItem } from './item';
import { RankingService } from './service';

/* tslint:disable:no-bitwise */

export class EndRanking {

    private items: EndRankingItem[]

    constructor(private ruleSet: number) {

    }

    getItems(rootRound: Round): EndRankingItem[] {
        this.items = [];
        this.addRound(rootRound);
        return this.items;
    }

    protected addRound(round: Round) {
        if (round === undefined) {
            return;
        }
        this.addRound(round.getChildRound(Round.WINNERS));
        if (round.getState() === Game.STATE_PLAYED) {
            this.addDead(round);
        } else {
            this.addDeadNotPlayed(round);
        }
        this.addRound(round.getChildRound(Round.LOSERS));
    }

    protected addDeadNotPlayed(round: Round) {
        let nrOfDead: number = this.getNrOfDeadFromRules(round, round.getToQualifyRules());
        nrOfDead += round.getPoulePlaces().filter(poulePlace => poulePlace.getToQualifyRules().length === 0).length;
        for (let i = 0; i < nrOfDead; i++) {
            this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, 'nog onbekend'));
        }
    }

    protected getNrOfDeadFromRules(fromRound: Round, toRules: QualifyRule[]): number {
        const fromPlaces = this.getUniqueFromPlaces(toRules);
        let nrOfToPlaces = 0;
        toRules.forEach(toRule => { nrOfToPlaces += toRule.getToPoulePlaces().length; });
        return fromPlaces.length - nrOfToPlaces;
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
    protected addDead(round: Round) {
        const nrOfUniqueFromPlacesMultiple = this.addDeadMultipleRuleWinners(round);
        this.addDeadPlaces(round);
        this.addDeadMultipleRuleLosers(round, nrOfUniqueFromPlacesMultiple);
    }

    protected addDeadMultipleRuleWinners(round: Round): number {
        const multipleRules = round.getToQualifyRules().filter(toRule => toRule.isMultiple());
        const multipleWinnersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === Round.WINNERS);

        let nrOfUniqueFromPlacesMultiple = this.getUniqueFromPlaces(multipleRules).length;
        if (multipleWinnersRule !== undefined) {
            const multipleLosersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === Round.LOSERS);
            const rankingService = new RankingService(this.ruleSet);
            const qualifyAmount = multipleWinnersRule.getToPoulePlaces().length;
            const rankingItems: RoundRankingItem[] = rankingService.getItemsForMultipleRule(multipleWinnersRule);
            for (let i = 0; i < qualifyAmount; i++) {
                nrOfUniqueFromPlacesMultiple--;
                rankingItems.shift();
            }
            const amountQualifyLosers = multipleLosersRule !== undefined ? multipleLosersRule.getToPoulePlaces().length : 0;
            while (nrOfUniqueFromPlacesMultiple - amountQualifyLosers > 0) {
                nrOfUniqueFromPlacesMultiple--;
                const poulePlace = round.getPoulePlace(rankingItems.shift().getPoulePlaceLocation());
                const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
                this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
            }
        }
        return nrOfUniqueFromPlacesMultiple;
    }

    protected addDeadMultipleRuleLosers(round: Round, nrOfUniqueFromPlacesMultiple: number) {
        const multipleRules = round.getToQualifyRules().filter(toRule => toRule.isMultiple());
        const multipleLosersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === Round.LOSERS);

        if (multipleLosersRule !== undefined) {
            const rankingService = new RankingService(this.ruleSet);
            const qualifyAmount = multipleLosersRule.getToPoulePlaces().length;
            const rankingItems: RoundRankingItem[] = rankingService.getItemsForMultipleRule(multipleLosersRule);
            for (let i = 0; i < qualifyAmount; i++) {
                nrOfUniqueFromPlacesMultiple--;
                rankingItems.pop();
            }
            while (nrOfUniqueFromPlacesMultiple) {
                nrOfUniqueFromPlacesMultiple--;
                const poulePlace = round.getPoulePlace(rankingItems.pop().getPoulePlaceLocation());
                const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
                this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
            }
        }
    }

    protected addDeadPlaces(round: Round) {
        const rankingService = new RankingService(this.ruleSet);
        if (round.isRoot() || round.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
            const poulePlacesPerNumber = round.getPoulePlacesPerNumber(Round.WINNERS);
            if (round.getWinnersOrLosers() === Round.LOSERS) {
                poulePlacesPerNumber.reverse();
            }
            poulePlacesPerNumber.forEach(poulePlaces => {
                const deadPlaceLocations = poulePlaces
                    .filter(poulePlace => poulePlace.getToQualifyRules().length === 0)
                    .map(poulePlace => poulePlace.getLocation());
                const rankingItems = rankingService.getItemsForPlaceLocations(round, deadPlaceLocations)

                rankingItems.forEach(rankingItem => {
                    const poulePlace = round.getPoulePlace(rankingItem.getPoulePlaceLocation());
                    const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
                    this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
                });
            });
        } else {
            round.getPoules().forEach(poule => {
                const rankingItems: RoundRankingItem[] = rankingService.getItemsForPoule(poule);
                const deadRanks: number[] = poule.getPlaces()
                    .filter(poulePlace => poulePlace.getToQualifyRules().length === 0)
                    .map(poulePlace => poulePlace.getNumber());

                if (round.getWinnersOrLosers() === Round.LOSERS) {
                    deadRanks.reverse();
                }
                deadRanks.forEach(deadRank => {
                    const rankingItem = rankingService.getItemByRank(rankingItems, deadRank);
                    const poulePlace = round.getPoulePlace(rankingItem.getPoulePlaceLocation());
                    const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
                    this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
                });
            });
        }
    }
}
