import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Ranking, RankingItem } from '../ranking';
import { Round } from '../round';
import { Team } from '../team';
import { QualifyRule } from './rule';

/**
 * Created by coen on 18-10-17.
 */

export class QualifyService {
    private parentRound: Round;

    constructor(private childRound: Round) {
        this.parentRound = childRound.getParentRound();
    }

    createObjectsForParentRound() {
        const parentRoundPoulePlacesPerNumber = this.parentRound.getPoulePlacesPerNumber(this.childRound.getWinnersOrLosers());
        const orderedByPlace = true;
        const childRoundPoulePlaces = this.childRound.getPoulePlaces(this.childRound.getQualifyOrder());
        if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            childRoundPoulePlaces.reverse();
        }

        let nrOfShifts = 0;
        while (childRoundPoulePlaces.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);
            // from places
            let nrOfPoulePlaces = 0;
            {
                const poulePlaces: PoulePlace[] = parentRoundPoulePlacesPerNumber.shift();
                const shuffledPoulePlaces = this.getShuffledPoulePlaces(poulePlaces, nrOfShifts, this.childRound);
                if (this.childRound.getQualifyOrder() < Round.ORDER_CUSTOM && nrOfPoulePlaces > 0) {
                    nrOfShifts++;
                }
                shuffledPoulePlaces.forEach(function (poulePlaceIt) {
                    qualifyRule.addFromPoulePlace(poulePlaceIt);
                });
                nrOfPoulePlaces = shuffledPoulePlaces.length;
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
    }

    getShuffledPoulePlaces(poulePlaces: PoulePlace[], nrOfShifts: number, childRound: Round): PoulePlace[] {
        let shuffledPoulePlaces: PoulePlace[] = [];
        const qualifyOrder = childRound.getQualifyOrder();
        if (qualifyOrder === Round.ORDER_VERTICAL || qualifyOrder === Round.ORDER_HORIZONTAL) {
            for (let shiftTime = 0; shiftTime < nrOfShifts; shiftTime++) {
                poulePlaces.push(poulePlaces.shift());
            }
            shuffledPoulePlaces = poulePlaces;
        } else if (qualifyOrder === 4) { // shuffle per two on oneven placenumbers, horizontal-children
            if (poulePlaces[0].getNumber() % 2 === 0) {
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

    removeObjectsForParentRound() {
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

    oneMultipleToSingle() {
        const fromQualifyRules = this.parentRound.getToQualifyRules();
        const multiples = fromQualifyRules.filter(function (qualifyRuleIt) {
            return qualifyRuleIt.isMultiple();
        });
        if (multiples.length !== 1) {
            return;
        }

        const multiple = multiples.pop();
        const multipleFromPlaces = multiple.getFromPoulePlaces().slice();
        while (multiple.getFromPoulePlaces().length > 1) {
            multiple.removeFromPoulePlace(multipleFromPlaces.pop());
        }
    }

    // getActiveQualifyRules( winnersOrLosers: number ): QualifyRule[] {
    // let qualifyRules: QualifyRule[] = [];
    // const poulePlacesByNumber = this.round.getPoulePlaces( true );
    // if( winnersOrLosers === Round.WINNERS ){
    //  while
    //
    //  poulePlacesByNumber.forEach( (poulePlaceIt) => )
    // }
    // return qualifyRules;
    // }

    getActivePoulePlaceNumber(winnersOrLosers: number) {
        // als winners dan
    }

    getNewQualifiers(ruleParts: IQualifyRulePart[]): INewQualifier[] {
        let qualifiers: INewQualifier[] = [];
        ruleParts.forEach(rulePart => {
            qualifiers = qualifiers.concat(this.getQualifiers(rulePart));
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
    getRulePartsToProcess(poule: Poule, oldPouleState: number, oldRoundState: number): IQualifyRulePart[] {
        const ruleParts: IQualifyRulePart[] = [];

        const newPouleState = poule.getState();
        const newRoundState = poule.getRound().getState();
        if ((oldRoundState !== Game.STATE_PLAYED && newRoundState === Game.STATE_PLAYED)
            || (oldRoundState === Game.STATE_PLAYED && newRoundState !== Game.STATE_PLAYED)
            || (oldRoundState === Game.STATE_PLAYED && newRoundState === Game.STATE_PLAYED)) {
            const winnersOrLosers = this.childRound.getWinnersOrLosers();
            poule.getRound().getToQualifyRules(winnersOrLosers).forEach(rule => ruleParts.push({ qualifyRule: rule }));
        } else if ((oldPouleState !== Game.STATE_PLAYED && newPouleState === Game.STATE_PLAYED)
            || (oldPouleState === Game.STATE_PLAYED && newPouleState !== Game.STATE_PLAYED)
            || (oldPouleState === Game.STATE_PLAYED && newPouleState === Game.STATE_PLAYED)) {
            const winnersOrLosers = this.childRound.getWinnersOrLosers();
            poule.getPlaces().forEach(poulePlace => {
                const qualifyRule = poulePlace.getToQualifyRule(winnersOrLosers);
                if (qualifyRule !== undefined && !qualifyRule.isMultiple()) {
                    ruleParts.push({ qualifyRule: qualifyRule, poule: poule });
                }
            });
        }
        return ruleParts;
    }

    protected getQualifiers(rulePart: IQualifyRulePart): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is
        const newQualifiers: INewQualifier[] = [];
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const fromRound = rulePart.qualifyRule.getFromRound();
        const fromPoulePlaces = rulePart.qualifyRule.getFromPoulePlaces();
        const toPoulePlaces = rulePart.qualifyRule.getToPoulePlaces();

        if (!rulePart.qualifyRule.isMultiple()) {
            const poules: Poule[] = [];
            if (rulePart.poule === undefined) {
                fromRound.getPoules().forEach(poule => poules.push(poule));
            } else {
                poules.push(rulePart.poule);
            }
            poules.forEach((poule) => {
                const toPoulePlace = toPoulePlaces[poule.getNumber() - 1];
                let qualifiedTeam;
                if (poule.getState() === Game.STATE_PLAYED) {
                    const fromPoulePlace = fromPoulePlaces[poule.getNumber() - 1];
                    const rank = fromPoulePlace.getNumber();
                    qualifiedTeam = this.getQualifiedTeam(fromPoulePlace.getPoule(), rank);
                }
                newQualifiers.push({ poulePlace: toPoulePlace, team: qualifiedTeam });
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
        const roundRankingPoulePlaces: PoulePlace[] = roundRankingItems.map(roundRankingItem => roundRankingItem.getPoulePlace());
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

export interface IQualifyRulePart {
    qualifyRule: QualifyRule;
    poule?: Poule;
}
