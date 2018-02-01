import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualifyrule';
import { Ranking } from '../ranking';
import { Round } from '../round';
import { Team } from '../team';

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
        const childRoundPoulePlacesOrderedByPlace = this.childRound.getPoulePlaces(orderedByPlace);
        if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            childRoundPoulePlacesOrderedByPlace.reverse();
        }

        let nrOfShifts = 0;
        while (childRoundPoulePlacesOrderedByPlace.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);
            // from places
            let poulePlaces;
            {
                // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS) {
                poulePlaces = parentRoundPoulePlacesPerNumber.shift();
                for (let shiftTime = 0; shiftTime < nrOfShifts; shiftTime++) {
                    poulePlaces.push(poulePlaces.shift());
                }
                nrOfShifts++;
                // }
                // else {
                //   poulePlaces = poulePlacesPerNumberParentRound.pop();
                // }
                poulePlaces.forEach(function (poulePlaceIt) {
                    qualifyRule.addFromPoulePlace(poulePlaceIt);
                });
            }

            // to places
            for (let nI = 0; nI < poulePlaces.length; nI++) {
                if (childRoundPoulePlacesOrderedByPlace.length === 0) {
                    break;
                }
                let toPoulePlace;
                // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS ) {
                toPoulePlace = childRoundPoulePlacesOrderedByPlace.shift();
                // }
                // else {
                // toPoulePlace = poulePlacesOrderedByPlaceChildRound.pop();
                // }
                qualifyRule.addToPoulePlace(toPoulePlace);
            }
        }
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

    getNewQualifiers(parentPoule: Poule): INewQualifier[] {
        if (parentPoule.getRound() !== this.parentRound) {
            return [];
        }
        const ruleParts = this.getRulePartsToProcess(parentPoule);
        let qualifiers: INewQualifier[] = [];
        ruleParts.forEach(rulePart => {
            qualifiers = qualifiers.concat(this.getQualifiers(rulePart));
        });
        return qualifiers;
    }

    protected getRulePartsToProcess(parentPoule: Poule): IQualifyRulePart[] {
        const ruleParts: IQualifyRulePart[] = [];
        if (parentPoule.getRound().getState() === Game.STATE_PLAYED) {
            parentPoule.getRound().getToQualifyRules().forEach(rule => ruleParts.push({ qualifyRule: rule }));
            return ruleParts;
        }

        if (parentPoule.getState() === Game.STATE_PLAYED) {
            parentPoule.getPlaces().forEach(poulePlace => {
                poulePlace.getToQualifyRules().filter(qualifyRule => !qualifyRule.isMultiple()).forEach(rule => {
                    ruleParts.push({ qualifyRule: rule, poule: parentPoule });
                });
            });
        }
        return ruleParts;
    }

    protected getQualifiers(rulePart: IQualifyRulePart): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is
        const newQualifiers: INewQualifier[] = [];
        const rankingService = new Ranking(Ranking.RULESSET_WC);
        const fromPoulePlaces = rulePart.qualifyRule.getFromPoulePlaces();
        const toPoulePlaces = rulePart.qualifyRule.getToPoulePlaces();

        if (!rulePart.qualifyRule.isMultiple()) {
            const poules: Poule[] = [];
            if (rulePart.poule === undefined) {
                rulePart.qualifyRule.getFromRound().getPoules().forEach(poule => poules.push(poule));
            } else {
                poules.push(rulePart.poule);
            }
            poules.forEach((poule) => {
                const toPoulePlace = toPoulePlaces[poule.getNumber() - 1];
                const fromPoulePlace = fromPoulePlaces[poule.getNumber() - 1];
                const fromRankNr = fromPoulePlace.getNumber();
                const fromPoule = fromPoulePlace.getPoule();
                const ranking: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(fromPoule.getPlaces(), fromPoule.getGames());
                const qualifiedTeam = ranking[fromRankNr - 1].getTeam();
                newQualifiers.push({ poulePlace: toPoulePlace, team: qualifiedTeam });
            });
            return newQualifiers;
        }

        // multiple
        const selectedPoulePlaces: PoulePlace[] = [];
        fromPoulePlaces.forEach(fromPoulePlace => {
            const fromPoule = fromPoulePlace.getPoule();
            const fromRankNr = fromPoulePlace.getNumber();
            const ranking: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(fromPoule.getPlaces(), fromPoule.getGames());
            selectedPoulePlaces.push(ranking[fromRankNr - 1]);
        });

        const rankedPoulePlaces: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(
            selectedPoulePlaces,
            rulePart.qualifyRule.getFromRound().getGames()
        );
        while (rankedPoulePlaces.length > toPoulePlaces.length) {
            rankedPoulePlaces.pop();
        }

        toPoulePlaces.forEach((toPoulePlace) => {
            let rankedPoulePlace = this.getRankedPoulePlace(rankedPoulePlaces, toPoulePlace.getPoule());
            if (rankedPoulePlace === undefined && rankedPoulePlaces.length > 0) {
                rankedPoulePlace = rankedPoulePlaces[0];
            }
            if (rankedPoulePlace === undefined) {
                return;
            }
            newQualifiers.push({ poulePlace: toPoulePlace, team: rankedPoulePlace.getTeam() });
            rankedPoulePlaces.splice(rankedPoulePlaces.indexOf(rankedPoulePlace), 1);
        });
        return newQualifiers;
    }

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
