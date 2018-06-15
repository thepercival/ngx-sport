import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';

/**
 * Created by coen on 22-3-17.
 */


export class StructureNameService {
    constructor() {
    }

    getRoundName(round: Round, sameName: boolean = false) {
        if (this.roundAndParentsNeedsRanking(round) || (round.getChildRounds().length > 1
            && round.getChildRound(Round.WINNERS).getNrOfRoundsToGo() !== round.getChildRound(Round.LOSERS).getNrOfRoundsToGo())) {
            return this.getHtmlNumber(round.getNumber()) + ' ronde';
        }

        const nrOfRoundsToGo = round.getNrOfRoundsToGo();
        if (nrOfRoundsToGo >= 2 && nrOfRoundsToGo <= 5) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo - 1)) + ' finale';
        } else if (nrOfRoundsToGo === 1 && this.aChildRoundHasMultiplePlacesPerPoule(round)) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        } else if (nrOfRoundsToGo === 1 || (nrOfRoundsToGo === 0 && round.getPoulePlaces().length > 1)) {
            if (round.getPoulePlaces().length === 2 && sameName === false) {
                const rankedPlace = this.getRankedPlace(round);
                return this.getHtmlNumber(rankedPlace) + '/' + this.getHtmlNumber(rankedPlace + 1) + ' plaats';
            }
            return 'finale';
        } else if (nrOfRoundsToGo === 0) {
            return Round.getWinnersLosersDescription(round.getWinnersOrLosers());
        }
        return '?';
    }

    /**
     *  als allemaal dezelfde naam dan geef die naam
     * als verschillde namen geef dan xde ronde met tooltip van de namen
     *
     * @param roundsByNumber
     *
     */
    getRoundsName(roundNumber, roundsByNumber: Round[]) {
        if (this.roundsHaveSameName(roundsByNumber) === true) {
            return this.getRoundName(roundsByNumber[0], true);
        }
        return this.getHtmlNumber(roundNumber) + ' ronde';
    }

    roundsHaveSameName(roundsByNumber: Round[]) {
        let roundNameAll;
        return roundsByNumber.some((round) => {
            const roundName = this.getRoundName(round, true);
            if (roundNameAll === undefined) {
                roundNameAll = roundName;
                return true;
            }
            if (roundNameAll === roundName) {
                return true;
            }
            return false;
        });
    }

    getPouleName(poule: Poule, withPrefix: boolean) {
        const round = poule.getRound();
        const previousNrOfPoules = this.getNrOfPreviousPoules(round.getNumber(), round, poule);
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = round.getType() === Round.TYPE_KNOCKOUT ? 'wed. ' : 'poule ';
        }
        const secondLetter = previousNrOfPoules % 26;
        if (previousNrOfPoules >= 26) {
            const firstLetter = (previousNrOfPoules - secondLetter) / 26;
            pouleName += (String.fromCharCode('A'.charCodeAt(0) + (firstLetter - 1)));
        }
        pouleName += (String.fromCharCode('A'.charCodeAt(0) + secondLetter));
        return pouleName;
    }

    getPoulePlaceName(pouleplace: PoulePlace, teamName = false) {
        if (teamName === true && pouleplace.getTeam() !== undefined) {
            return pouleplace.getTeam().getName();
        }
        const poule = pouleplace.getPoule();
        const round = poule.getRound();

        const fromQualifyRule = pouleplace.getFromQualifyRule();
        if (fromQualifyRule === undefined) { // first round
            return this.getPoulePlaceNameSimple(pouleplace, false);
        }

        if (fromQualifyRule.isMultiple() === false) {
            const fromPoulePlace = fromQualifyRule.getSingleFromEquivalent(pouleplace);
            return this.getPoulePlaceNameSimple(fromPoulePlace, false);
        }

        return '?' + fromQualifyRule.getFromPoulePlaces()[0].getNumber();
    }

    getPoulePlaceNameSimple(pouleplace: PoulePlace, teamName = false) {
        if (teamName === true && pouleplace.getTeam() !== undefined) {
            return pouleplace.getTeam().getName();
        }
        const pouleplaceName = this.getPouleName(pouleplace.getPoule(), false);
        return pouleplaceName + pouleplace.getNumber();
    }

    private roundAndParentsNeedsRanking(round: Round) {

        if (round.needsRanking()) {
            if (round.getParentRound() !== undefined) {
                return this.roundAndParentsNeedsRanking(round.getParentRound());
            }
            return true;
        }
        return false;
    }

    /**
     * determine number of pouleplaces on left side
     * @param round
     */
    private getRankedPlace(round: Round, rankedPlace: number = 1) {
        const parentRound = round.getParentRound();
        if (parentRound === undefined) {
            return rankedPlace;
        }
        if (round.getWinnersOrLosers() === Round.LOSERS) {
            rankedPlace += parentRound.getPoulePlaces().length - round.getPoulePlaces().length;
        }
        return this.getRankedPlace(parentRound, rankedPlace);
    }

    private getHtmlFractalNumber(number) {
        if (number === 4 || number === 3 || number === 2) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    private getHtmlNumber(number) {
        return number + '<sup>' + (number === 1 ? 'st' : 'd') + 'e</sup>';
    }

    private aChildRoundHasMultiplePlacesPerPoule(round: Round) {
        return round.getChildRounds().some(childRound => {
            return childRound.getPoules().some(poule => poule.getPlaces().length > 1);
        });
    }

    private getNrOfPreviousPoules(roundNumber: number, round: Round, poule: Poule): number {
        let nrOfPoules = poule.getNumber() - 1;
        nrOfPoules += this.getNrOfPoulesParentRounds(round);
        nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, round);
        return nrOfPoules;
    }

    private getNrOfPoulesParentRounds(round: Round): number {
        return this.getNrOfPoulesParentRoundsHelper(round.getNumber() - 1, round.getRootRound());
    }

    private getNrOfPoulesParentRoundsHelper(maxRoundNumber: number, round: Round): number {
        if (round.getNumber() > maxRoundNumber) {
            return 0;
        }
        let nrOfPoules = round.getPoules().length;
        round.getChildRounds().forEach((childRound) => {
            nrOfPoules += this.getNrOfPoulesParentRoundsHelper(maxRoundNumber, childRound);
        });
        return nrOfPoules;
    }

    private getNrOfPoulesSiblingRounds(roundNumber: number, round: Round): number {
        let nrOfPoules = 0;

        const parentRound = round.getParentRound();
        if (parentRound !== undefined) {
            nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, parentRound/* round */);
        }

        if (round.getWinnersOrLosers() === Round.LOSERS) {
            const winningSibling = round.getOpposing();
            if (winningSibling !== undefined) {
                nrOfPoules += this.getNrOfPoulesForChildRounds(winningSibling, roundNumber);
            }
        }
        return nrOfPoules;
    }

    private getNrOfPoulesForChildRounds(round: Round, roundNumber: number): number {
        let nrOfChildPoules = 0;
        if (round.getNumber() > roundNumber) {
            return nrOfChildPoules;
        } else if (round.getNumber() === roundNumber) {
            return round.getPoules().length;
        }

        round.getChildRounds().forEach((childRound) => {
            nrOfChildPoules += this.getNrOfPoulesForChildRounds(childRound, roundNumber);
        });
        return nrOfChildPoules;
    }
}
