import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Ranking } from '../ranking';
import { RankingItem } from '../ranking/item';
import { Round } from '../round';
import { Team } from '../team';
import { QualifyRule } from './rule';

export class QualifyService {
    constructor(private parentRound: Round, private childRound: Round) {
    }

    createRules() {
        // console.log('createRules started: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
        // childRoundPoulePlaces
        const order = this.childRound.getQualifyOrder() === Round.QUALIFYORDER_RANK ? Round.ORDER_POULE_NUMBER : Round.ORDER_NUMBER_POULE;
        const childRoundPoulePlaces = this.childRound.getPoulePlaces(order);

        const parentRoundPoulePlacesPer: PoulePlace[][] = this.getParentPoulePlacesPer();

        let nrOfShifts = 0;
        while (childRoundPoulePlaces.length > 0 && parentRoundPoulePlacesPer.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);
            // from places
            let nrOfPoulePlaces = 0;
            {
                let poulePlaces: PoulePlace[] = parentRoundPoulePlacesPer.shift();
                if (this.childRound.getQualifyOrder() === Round.QUALIFYORDER_CROSS) {
                    poulePlaces = this.getShuffledPoulePlaces(poulePlaces, nrOfShifts, this.childRound);
                    nrOfShifts++;
                }
                poulePlaces.forEach(function (poulePlaceIt) {
                    qualifyRule.addFromPoulePlace(poulePlaceIt);
                });
                nrOfPoulePlaces = poulePlaces.length;
                if (this.childRound.getWinnersOrLosers() === Round.LOSERS
                    && this.childRound.getQualifyOrder() === Round.QUALIFYORDER_CROSS
                    && (childRoundPoulePlaces.length % nrOfPoulePlaces) !== 0) {
                    nrOfPoulePlaces = (childRoundPoulePlaces.length % nrOfPoulePlaces);
                }
            }
            if (nrOfPoulePlaces === 0) {
                break;
            }
            // to places
            for (let nI = 0; nI < nrOfPoulePlaces; nI++) {
                if (childRoundPoulePlaces.length === 0) {
                    break;
                }
                const toPoulePlace = childRoundPoulePlaces.shift();
                qualifyRule.addToPoulePlace(toPoulePlace);
            }
        }
        // console.log('createRules ended: ' + this.parentRound.getNumberAsValue() + ' < -> ' + this.childRound.getNumberAsValue());
    }

    protected getShuffledPoulePlaces(poulePlaces: PoulePlace[], nrOfShifts: number, childRound: Round): PoulePlace[] {
        let shuffledPoulePlaces: PoulePlace[] = [];
        const qualifyOrder = childRound.getQualifyOrder();
        if (!childRound.hasCustomQualifyOrder()) {
            if ((poulePlaces.length % 2) === 0) {
                for (let shiftTime = 0; shiftTime < nrOfShifts; shiftTime++) {
                    poulePlaces.push(poulePlaces.shift());
                }
            }
            shuffledPoulePlaces = poulePlaces;
        } else if (qualifyOrder === 4) { // shuffle per two on oneven placenumbers, horizontal-children
            if ((poulePlaces[0].getNumber() % 2) === 0) {
                while (poulePlaces.length > 0) {
                    shuffledPoulePlaces = shuffledPoulePlaces.concat(poulePlaces.splice(0, 2).reverse());
                }
            } else {
                shuffledPoulePlaces = poulePlaces;
            }
        } else if (qualifyOrder === 5) { // reverse second and third item, vertical-children
            if (poulePlaces.length % 4 === 0) {
                while (poulePlaces.length > 0) {
                    const poulePlacesTmp = poulePlaces.splice(0, 4);
                    poulePlacesTmp.splice(1, 0, poulePlacesTmp.splice(2, 1)[0]);
                    shuffledPoulePlaces = shuffledPoulePlaces.concat(poulePlacesTmp);
                }
            } else {
                shuffledPoulePlaces = poulePlaces;
            }
        }
        return shuffledPoulePlaces;
    }

    protected getParentPoulePlacesPer(): PoulePlace[][] {
        /** LOSERS
         * [ C3 B3 A3 ]
        *  [ C2 B2 A2 ]
        *  [ C1 B1 A1 ]
         */
        const nrOfChildRoundPlaces = this.childRound.getPoulePlaces().length;
        if (this.childRound.getQualifyOrder() !== Round.QUALIFYORDER_RANK) {
            const poulePlacesPerNumber = this.parentRound.getPoulePlacesPerNumber(Round.WINNERS);
            if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
                poulePlacesPerNumber.reverse();
                let spliceIndexReversed;
                for (let i = 0, x = 0; i < poulePlacesPerNumber.length; i++) {
                    if (x >= nrOfChildRoundPlaces) {
                        spliceIndexReversed = i; break;
                    }
                    x += poulePlacesPerNumber[i].length;
                }
                poulePlacesPerNumber.splice(spliceIndexReversed);
                poulePlacesPerNumber.reverse();
            }
            return poulePlacesPerNumber;
        }

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
            return this.parentRound.getPoulePlaces(Round.ORDER_NUMBER_POULE); // ANDERSOM
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
        rules.forEach(rule => {
            qualifiers = qualifiers.concat(this.getQualifiers(rule));
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

    protected getQualifiers(rule: QualifyRule): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is
        const newQualifiers: INewQualifier[] = [];
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const fromRound = rule.getFromRound();
        const fromPoulePlaces = rule.getFromPoulePlaces();
        const toPoulePlaces = rule.getToPoulePlaces();
        const toWinnersLosers = rule.getToRound().getWinnersOrLosers();

        if (!rule.isMultiple()) {
            fromPoulePlaces.forEach(fromPoulePlace => {
                const fromPoule = fromPoulePlace.getPoule();
                let qualifiedTeam;
                if (fromPoule.getState() === Game.STATE_PLAYED) {
                    const rank = fromPoulePlace.getNumber();
                    qualifiedTeam = this.getQualifiedTeam(fromPoulePlace.getPoule(), rank);
                }
                newQualifiers.push({ poulePlace: rule.getToEquivalent(fromPoulePlace), team: qualifiedTeam });
            });
            return newQualifiers;
        }

        // multiple
        if (fromRound.getState() !== Game.STATE_PLAYED) {
            toPoulePlaces.forEach((toPoulePlace) => {
                newQualifiers.push({ poulePlace: toPoulePlace, team: undefined });
            });
            return newQualifiers;
        }

        const roundRankingItems: RankingItem[] = rankingService.getItemsForRound(fromRound, fromPoulePlaces);
        const roundRankingPoulePlaces: PoulePlace[] = rankingService.getPoulePlaces(roundRankingItems, toWinnersLosers);
        while (roundRankingPoulePlaces.length > toPoulePlaces.length) {
            roundRankingPoulePlaces.pop();
        }

        toPoulePlaces.forEach((toPoulePlace) => {
            let rankedPoulePlace = this.getRankedPoulePlace(roundRankingPoulePlaces, toPoulePlace.getPoule());
            if (rankedPoulePlace === undefined && roundRankingPoulePlaces.length > 0) {
                rankedPoulePlace = roundRankingPoulePlaces[0];
            }
            if (rankedPoulePlace === undefined) {
                return;
            }
            newQualifiers.push({ poulePlace: toPoulePlace, team: rankedPoulePlace.getTeam() });
            roundRankingPoulePlaces.splice(roundRankingPoulePlaces.indexOf(rankedPoulePlace), 1);
        });
        return newQualifiers;
    }

    getQualifiedTeam(poule: Poule, rank: number): Team {
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const pouleRankingItems: RankingItem[] = rankingService.getItems(poule.getPlaces(), poule.getGames());
        const poulePlace = rankingService.getItem(pouleRankingItems, rank).getPoulePlace();
        return poulePlace ? poulePlace.getTeam() : undefined;
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
        const toTeams = toPoule.getTeams();
        return rankedPoulePlaces.find(rankedPoulePlace => {
            return !this.hasTeam(toTeams, rankedPoulePlace.getPoule().getTeams());
        });
    }

    protected hasTeam(allTeams: Team[], teamsToFind: Team[]) {
        return allTeams.some(team => teamsToFind.some(teamToFind => teamToFind === team));
    }
}

export interface INewQualifier {
    team: Team;
    poulePlace: PoulePlace;
}
