import { Competitor } from '../competitor';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Ranking } from '../ranking';
import { RankingItem } from '../ranking/item';
import { Round } from '../round';
import { PoulePlaceDivider } from './pouleplacedivider';
import { QualifyReservationService } from './reservationservice';
import { QualifyRule } from './rule';

export class QualifyService {
    constructor(private parentRound: Round, private childRound: Round) {
    }

    createRules() {
        // console.log('createRules started: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        const order = this.childRound.getQualifyOrder() === Round.QUALIFYORDER_RANK ? Round.ORDER_POULE_NUMBER : Round.ORDER_NUMBER_POULE;
        const childRoundPoulePlaces = this.childRound.getPoulePlaces(order);

        const parentRoundPoulePlacesPer: PoulePlace[][] = this.getParentPoulePlacesPer();

        const poulePlaceDivider = new PoulePlaceDivider(this.childRound);

        while (childRoundPoulePlaces.length > 0 && parentRoundPoulePlacesPer.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);

            const poulePlaces: PoulePlace[] = parentRoundPoulePlacesPer.shift();
            const nrOfPlacesToAdd = this.getNrOfToPlacesToAdd(parentRoundPoulePlacesPer);
            const nrOfToPoulePlaces = this.getNrOfToPoulePlaces(childRoundPoulePlaces.length, poulePlaces.length, nrOfPlacesToAdd);
            // to places
            for (let nI = 0; nI < nrOfToPoulePlaces; nI++) {
                if (childRoundPoulePlaces.length === 0) {
                    break;
                }
                qualifyRule.addToPoulePlace(childRoundPoulePlaces.shift());
            }
            // from places (needs toplaces)
            poulePlaceDivider.divide(qualifyRule, poulePlaces);
        }
        this.repairOverlappingRules();
        // console.log('createRules ended: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
    }

    protected getNrOfToPlacesToAdd(parentRoundPoulePlacesPer: PoulePlace[][]): number {
        let nrOfPlacesToAdd = 0;
        parentRoundPoulePlacesPer.forEach(poulePlaces => nrOfPlacesToAdd += poulePlaces.length);
        return nrOfPlacesToAdd;
    }

    protected getNrOfToPoulePlaces(childRoundPoulePlaces: number, nrOfPlacesAdding: number, nrOfPlacesToAdd: number): number {
        if (this.childRound.getWinnersOrLosers() === Round.WINNERS
           /* || this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_CROSS */) {
            return nrOfPlacesAdding;
        }
        const nrOfPlacesTooMuch = (nrOfPlacesAdding + nrOfPlacesToAdd) - childRoundPoulePlaces;
        if (nrOfPlacesTooMuch > 0) {
            return (childRoundPoulePlaces % this.parentRound.getPoules().length);
        }
        return nrOfPlacesAdding;
    }

    protected repairOverlappingRules() {
        this.parentRound.getPoulePlaces().filter(poulePlace => poulePlace.getToQualifyRules().length > 1).forEach(poulePlace => {
            const winnersRule = poulePlace.getToQualifyRule(Round.WINNERS);
            const losersRule = poulePlace.getToQualifyRule(Round.LOSERS);
            if (winnersRule.isSingle() && losersRule.isMultiple()) {
                losersRule.removeFromPoulePlace(poulePlace);
            } else if (winnersRule.isMultiple() && losersRule.isSingle()) {
                winnersRule.removeFromPoulePlace(poulePlace);
            }
        });
    }

    protected getParentPoulePlacesPer(): PoulePlace[][] {
        if (this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
            return this.getParentPoulePlacesPerNumber();
        }
        return this.getParentPoulePlacesPerQualifyRule();
    }

    protected getParentPoulePlacesPerNumber(): PoulePlace[][] {
        if (this.childRound.getWinnersOrLosers() === Round.WINNERS) {
            return this.parentRound.getPoulePlacesPerNumber(Round.WINNERS);
        }
        const poulePlacesPerNumber: PoulePlace[][] = [];
        const nrOfPoules = this.parentRound.getPoules().length;
        const reversedPoulePlaces = this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE, true);
        let nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;
        while (nrOfChildRoundPlaces > 0) {
            let tmp = reversedPoulePlaces.splice(0, nrOfPoules).reverse().filter(poulePlace => {
                const toQualifyRule = poulePlace.getToQualifyRule(Round.WINNERS);
                return toQualifyRule === undefined || toQualifyRule.isMultiple();
            });
            // if( tmp.length > nrOfChildRoundPlaces ) {
            //     tmp = tmp.splice(0,nrOfChildRoundPlaces);
            // }
            poulePlacesPerNumber.unshift(tmp);
            nrOfChildRoundPlaces -= nrOfPoules;
        }
        return poulePlacesPerNumber;
    }

    protected getParentPoulePlacesPerQualifyRule(): PoulePlace[][] {
        const nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;

        const poulePlacesToAdd = this.getPoulePlacesPerParentFromQualifyRule();
        if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            poulePlacesToAdd.splice(0, poulePlacesToAdd.length - nrOfChildRoundPlaces);
        }

        const poulePlacesPerQualifyRule = [];
        let placeNumber = 0;
        const poulePlacesPerNumberRank = this.parentRound.getPoulePlacesPerNumber(this.childRound.getWinnersOrLosers());
        while (poulePlacesToAdd.length > 0) {
            const tmp = poulePlacesToAdd.splice(0, poulePlacesPerNumberRank[placeNumber++].length);
            poulePlacesPerQualifyRule.push(tmp);
        }
        return poulePlacesPerQualifyRule;
    }

    protected getPoulePlacesPerParentFromQualifyRule(): PoulePlace[] {

        if (this.parentRound.isRoot()) {
            return this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE);
        }

        let poulePlaces = [];
        this.parentRound.getFromQualifyRules().forEach(parentFromQualifyRule => {
            const parentPoulePlaces = parentFromQualifyRule.getToPoulePlaces().slice();
            parentPoulePlaces.sort((pPoulePlaceA, pPoulePlaceB) => {
                if (pPoulePlaceA.getNumber() > pPoulePlaceB.getNumber()) {
                    return 1;
                }
                if (pPoulePlaceA.getNumber() < pPoulePlaceB.getNumber()) {
                    return -1;
                }
                if (pPoulePlaceA.getPoule().getNumber() > pPoulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (pPoulePlaceA.getPoule().getNumber() < pPoulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                return 0;
            });
            poulePlaces = poulePlaces.concat(parentPoulePlaces);
        });
        return poulePlaces;
    }

    removeRules() {
        // console.log('removeRules: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
        fromQualifyRules.forEach(function (qualifyRuleIt) {
            while (qualifyRuleIt.getFromPoulePlaces().length > 0) {
                qualifyRuleIt.removeFromPoulePlace();
            }
            while (qualifyRuleIt.getToPoulePlaces().length > 0) {
                qualifyRuleIt.removeToPoulePlace();
            }
            qualifyRuleIt.setFromRound(undefined);
            qualifyRuleIt.setToRound(undefined);
        });
        fromQualifyRules = undefined;
    }

    getNewQualifiers(rules: QualifyRule[]): INewQualifier[] {
        let qualifiers: INewQualifier[] = [];
        const qualifyReservationService = new QualifyReservationService(this.childRound);
        qualifyReservationService.reserveSingleRules();
        rules.forEach(rule => {
            qualifiers = qualifiers.concat(this.getQualifiers(rule, qualifyReservationService));
        });
        return qualifiers;
    }

    // transities:
    // state changed
    // 1 van hele ronde gespeeld naar niet hele ronde gespeeld
    // 2 van niet hele ronde gespeeld naar hele ronde gespeeld
    // 3 hele ronde gespeeld
    //      update all
    // 4 van niet hele poule gespeeld naar hele poule gespeeld
    // 5 van hele poule gespeeld naar niet hele poule gespeeld
    // 6 hele poule gespeeld
    //      update from poule
    getRulesToProcess(poule: Poule, oldPouleState: number, oldRoundState: number): QualifyRule[] {
        const rules: QualifyRule[] = [];

        const newPouleState = poule.getState();
        const newRoundState = poule.getRound().getState();
        if ((oldRoundState !== Game.STATE_PLAYED && newRoundState === Game.STATE_PLAYED)
            || (oldRoundState === Game.STATE_PLAYED && newRoundState !== Game.STATE_PLAYED)
            || (oldRoundState === Game.STATE_PLAYED && newRoundState === Game.STATE_PLAYED)) {
            const winnersOrLosers = this.childRound.getWinnersOrLosers();
            poule.getRound().getToQualifyRules(winnersOrLosers).forEach(rule => rules.push(rule));
        } else if ((oldPouleState !== Game.STATE_PLAYED && newPouleState === Game.STATE_PLAYED)
            || (oldPouleState === Game.STATE_PLAYED && newPouleState !== Game.STATE_PLAYED)
            || (oldPouleState === Game.STATE_PLAYED && newPouleState === Game.STATE_PLAYED)) {
            const winnersOrLosers = this.childRound.getWinnersOrLosers();
            poule.getPlaces().forEach(poulePlace => {
                const qualifyRule = poulePlace.getToQualifyRule(winnersOrLosers);
                if (qualifyRule !== undefined && !qualifyRule.isMultiple()) {
                    rules.push(qualifyRule);
                }
            });
        }
        return rules;
    }

    protected getQualifiers(rule: QualifyRule, qualifyReservationService: QualifyReservationService): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is
        const newQualifiers: INewQualifier[] = [];
        const toPoulePlaces = rule.getToPoulePlaces();
        const toWinnersLosers = rule.getToRound().getWinnersOrLosers();

        if (!rule.isMultiple()) {
            rule.getFromPoulePlaces().forEach(fromPoulePlace => {
                const fromPoule = fromPoulePlace.getPoule();
                let qualifiedCompetitor;
                if (fromPoule.getState() === Game.STATE_PLAYED) {
                    const rank = fromPoulePlace.getNumber();
                    qualifiedCompetitor = this.getQualifiedCompetitor(fromPoulePlace.getPoule(), rank);
                }
                newQualifiers.push({ poulePlace: rule.getToEquivalent(fromPoulePlace), competitor: qualifiedCompetitor });
            });
            return newQualifiers;
        }

        // multiple
        if (rule.getFromRound().getState() !== Game.STATE_PLAYED) {
            toPoulePlaces.forEach((toPoulePlace) => {
                newQualifiers.push({ poulePlace: toPoulePlace, competitor: undefined });
            });
            return newQualifiers;
        }
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const roundRankingItems: RankingItem[] = rankingService.getItemsForMultipleRule(rule);
        const roundRankingPoulePlaces: PoulePlace[] = rankingService.getPoulePlaces(roundRankingItems, toWinnersLosers);
        while (roundRankingPoulePlaces.length > toPoulePlaces.length) {
            roundRankingPoulePlaces.pop();
        }

        toPoulePlaces.forEach((toPoulePlace) => {
            const toPouleNumber = toPoulePlace.getPoule().getNumber();
            const rankedPoulePlace = qualifyReservationService.getFreeAndLeastAvailabe(toPouleNumber, roundRankingPoulePlaces);
            if (rankedPoulePlace === undefined) {
                return;
            }
            newQualifiers.push({ poulePlace: toPoulePlace, competitor: rankedPoulePlace.getCompetitor() });
            roundRankingPoulePlaces.splice(roundRankingPoulePlaces.indexOf(rankedPoulePlace), 1);
        });
        return newQualifiers;
    }

    getQualifiedCompetitor(poule: Poule, rank: number): Competitor {
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const pouleRankingItems: RankingItem[] = rankingService.getItems(poule.getPlaces(), poule.getGames());
        const poulePlace = rankingService.getItem(pouleRankingItems, rank).getPoulePlace();
        return poulePlace ? poulePlace.getCompetitor() : undefined;
    }

    // getRankedPoulePlacesForRound(round: Round, fromPoulePlaces: PoulePlace[]): PoulePlace[] {
    //     const rankingService = new Ranking(Ranking.RULESSET_WC);
    //     const selectedPoulePlaces: PoulePlace[] = [];
    //     fromPoulePlaces.forEach(fromPoulePlace => {
    //         const fromPoule = fromPoulePlace.getPoule();
    //         const fromRankNr = fromPoulePlace.getNumber();
    //         const ranking: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(fromPoule.getPlaces(), fromPoule.getGames());
    //         selectedPoulePlaces.push(ranking[fromRankNr - 1]);
    //     });
    //     return rankingService.getPoulePlacesByRankSingle(selectedPoulePlaces, round.getGames());
    // }

    protected getRankedPoulePlace(rankedPoulePlaces: PoulePlace[], toPoule: Poule): PoulePlace {
        const toCompetitors = toPoule.getCompetitors();
        return rankedPoulePlaces.find(rankedPoulePlace => {
            return !this.hasCompetitor(toCompetitors, rankedPoulePlace.getPoule().getCompetitors());
        });
    }

    protected hasCompetitor(allCompetitors: Competitor[], competitorsToFind: Competitor[]) {
        return allCompetitors.some(competitor => competitorsToFind.some(competitorToFind => competitorToFind === competitor));
    }
}

export interface INewQualifier {
    competitor: Competitor;
    poulePlace: PoulePlace;
}
