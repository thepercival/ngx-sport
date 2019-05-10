import { Game } from '../game';
import { PoulePlace } from '../pouleplace';
import { QualifyGroup } from '../qualify/group';
import { QualifyRule } from '../qualify/rule';
import { Round } from '../round';
import { EndRankingItem } from './item';
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

        round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {
            this.addRound(qualifyGroup.getChildRound());
        });

        if (round.getState() === Game.STATE_PLAYED) {
            this.addDropouts(round);
        } else {
            this.addDropoutsNotPlayed(round);
        }

        round.getQualifyGroups(QualifyGroup.LOSERS).reverse().forEach(qualifyGroup => {
            this.addRound(qualifyGroup.getChildRound());
        });
    }

    protected addDropoutsNotPlayed(round: Round) {
        console.error('addDropoutsNotPlayed');
        // let nrOfDropouts: number = this.getNrOfDropoutsFromRules(round, round.getToQualifyRules());
        // nrOfDropouts += round.getPoulePlaces().filter(poulePlace => poulePlace.getToQualifyRules().length === 0).length;
        // for (let i = 0; i < nrOfDropouts; i++) {
        //     this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, 'nog onbekend'));
        // }
    }

    protected getNrOfDropoutsFromRules(fromRound: Round, toRules: QualifyRule[]): number {
        console.error("getNrOfDropoutsFromRules");
        return 0;
        // const fromPlaces = this.getUniqueFromPlaces(toRules);
        // let nrOfToPlaces = 0;
        // toRules.forEach(toRule => { nrOfToPlaces += toRule.getToPoulePlaces().length; });
        // return fromPlaces.length - nrOfToPlaces;
    }

    protected getUniqueFromPlaces(toRules: QualifyRule[]): PoulePlace[] {
        console.error("getUniqueFromPlaces");
        return [];
        // const fromPlaces: PoulePlace[] = [];
        // toRules.forEach(toRule => {
        //     const ruleFromPlaces = toRule.getFromPoulePlaces();
        //     ruleFromPlaces.forEach(ruleFromPlace => {
        //         if (fromPlaces.find(fromPlace => fromPlace === ruleFromPlace) === undefined) {
        //             fromPlaces.push(ruleFromPlace);
        //         }
        //     });
        // });
        // return fromPlaces;
    }

    /**
     * 1 pak weer de unique plaatsen
     * 2 bepaal wie er doorgaan van de winnaars en haal deze eraf
     * 3 doe de plekken zonder to - regels
     * 4 bepaal wie er doorgaan van de verliezers en haal deze eraf
     * 5 voeg de overgebleven plekken toe aan de dropouts places
     *
     * @param round
     */
    protected addDropouts(round: Round) {
        const nrOfUniqueFromPlacesMultiple = this.addDropoutsMultipleRuleWinners(round);
        this.addDropoutPlaces(round);
        this.addDropoutsMultipleRuleLosers(round, nrOfUniqueFromPlacesMultiple);
    }

    protected addDropoutsMultipleRuleWinners(round: Round): number {
        console.error('addDropoutsMultipleRuleWinners');
        return 0;
        // const multipleRules = round.getToQualifyRules().filter(toRule => toRule.isMultiple());
        // const multipleWinnersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === QualifyGroup.WINNERS);

        // let nrOfUniqueFromPlacesMultiple = this.getUniqueFromPlaces(multipleRules).length;
        // if (multipleWinnersRule !== undefined) {
        //     const multipleLosersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === QualifyGroup.LOSERS);
        //     const rankingService = new RankingService(this.ruleSet);
        //     const qualifyAmount = multipleWinnersRule.getToPoulePlaces().length;
        //     const rankingItems: RoundRankingItem[] = rankingService.getItemsForMultipleRule(multipleWinnersRule);
        //     for (let i = 0; i < qualifyAmount; i++) {
        //         nrOfUniqueFromPlacesMultiple--;
        //         rankingItems.shift();
        //     }
        //     const amountQualifyLosers = multipleLosersRule !== undefined ? multipleLosersRule.getToPoulePlaces().length : 0;
        //     while (nrOfUniqueFromPlacesMultiple - amountQualifyLosers > 0) {
        //         nrOfUniqueFromPlacesMultiple--;
        //         const poulePlace = round.getPoulePlace(rankingItems.shift().getPoulePlaceLocation());
        //         const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
        //         this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
        //     }
        // }
        // return nrOfUniqueFromPlacesMultiple;
    }

    protected addDropoutsMultipleRuleLosers(round: Round, nrOfUniqueFromPlacesMultiple: number) {
        console.error('addDropoutsMultipleRuleLosers');
        return 0;
        // const multipleRules = round.getToQualifyRules().filter(toRule => toRule.isMultiple());
        // const multipleLosersRule = multipleRules.find(toRule => toRule.getWinnersOrLosers() === QualifyGroup.LOSERS);

        // if (multipleLosersRule !== undefined) {
        //     const rankingService = new RankingService(this.ruleSet);
        //     const qualifyAmount = multipleLosersRule.getToPoulePlaces().length;
        //     const rankingItems: RoundRankingItem[] = rankingService.getItemsForMultipleRule(multipleLosersRule);
        //     for (let i = 0; i < qualifyAmount; i++) {
        //         nrOfUniqueFromPlacesMultiple--;
        //         rankingItems.pop();
        //     }
        //     while (nrOfUniqueFromPlacesMultiple) {
        //         nrOfUniqueFromPlacesMultiple--;
        //         const poulePlace = round.getPoulePlace(rankingItems.pop().getPoulePlaceLocation());
        //         const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
        //         this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
        //     }
        // }
    }

    protected addDropoutPlaces(round: Round) {
        const rankingService = new RankingService(this.ruleSet);
        console.error('addDropoutPlaces');
        // if (round.isRoot() || round.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
        //     const poulePlacesPerNumber = round.getPoulePlacesPerNumber(QualifyGroup.WINNERS);
        //     poulePlacesPerNumber.forEach(poulePlaces => {
        //         const dropoutPlaceLocations = poulePlaces
        //             .filter(poulePlace => poulePlace.getToQualifyRules().length === 0)
        //             .map(poulePlace => poulePlace.getLocation());
        //         const rankingItems = rankingService.getItemsForPlaceLocations(round,dropoutPlaceLocations)

        //         rankingItems.forEach(rankingItem => {
        //             const poulePlace = round.getPoulePlace(rankingItem.getPoulePlaceLocation());
        //             const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
        //             this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
        //         });
        //     });
        // } else {
        //     round.getPoules().forEach(poule => {
        //         const rankingItems: RoundRankingItem[] = rankingService.getItemsForPoule(poule);
        //         const dropoutRanks: number[] = poule.getPlaces()
        //             .filter(poulePlace => poulePlace.getToQualifyRules().length === 0)
        //             .map(poulePlace => poulePlace.getNumber());

        //         dropoutRanks.forEach(dropoutRank => {
        //             const rankingItem = rankingService.getItemByRank(rankingItems, dropoutRank);
        //             const poulePlace = round.getPoulePlace(rankingItem.getPoulePlaceLocation());
        //             const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
        //             this.items.push(new EndRankingItem(this.items.length + 1, this.items.length + 1, name));
        //         });
        //     });
        // }
    }
}
