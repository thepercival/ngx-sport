import { Game } from './game';
import { GamePoulePlace } from './game/pouleplace';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { QualifyRule } from './qualify/rule';
import { Round } from './round';
import { RoundNumber } from './round/number';

export class NameService {
    constructor() {
    }

    getWinnersLosersDescription(winnersOrLosers: number, multiple: boolean = false): string {
        const description = winnersOrLosers === Round.WINNERS ? 'winnaar' : (winnersOrLosers === Round.LOSERS ? 'verliezer' : '');
        return ((multiple && (description !== '')) ? description + 's' : description);
    }

    /**
    *  als allemaal dezelfde naam dan geef die naam
    * als verschillde namen geef dan xde ronde met tooltip van de namen
    */
    getRoundNumberName(roundNumber: RoundNumber) {
        if (this.roundsHaveSameName(roundNumber)) {
            return this.getRoundName(roundNumber.getARound(), true);
        }
        return this.getHtmlNumber(roundNumber) + ' ronde';
    }

    getRoundName(round: Round, sameName: boolean = false) {
        if (this.roundAndParentsNeedsRanking(round) || !this.childRoundsHaveEqualDepth(round) ) {
            return this.getHtmlNumber(round.getNumberAsValue()) + ' ronde';
        }

        const nrOfRoundsToGo = this.getMaxDepth(round);
        if (nrOfRoundsToGo >= 2 && nrOfRoundsToGo <= 5) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        } else if (nrOfRoundsToGo === 1 && this.aChildRoundHasMultiplePlacesPerPoule(round)) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        } else if (nrOfRoundsToGo === 1 || (nrOfRoundsToGo === 0 && round.getPoulePlaces().length > 1)) {
            if (round.getPoulePlaces().length === 2 && sameName === false) {
                const rankedPlace = this.getRankedPlace(round);
                return this.getHtmlNumber(rankedPlace) + '/' + this.getHtmlNumber(rankedPlace + 1) + ' plaats';
            }
            return 'finale';
        } else if (nrOfRoundsToGo === 0) {
            return this.getWinnersLosersDescription(round.getWinnersOrLosers());
        }
        return '?';
    }

    getPouleName(poule: Poule, withPrefix: boolean) {
        const round = poule.getRound();
        const previousNrOfPoules = this.getNrOfPreviousPoules(round.getNumberAsValue(), round, poule);
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = poule.needsRanking() ? 'poule ' : 'wed. ';
        }
        const secondLetter = previousNrOfPoules % 26;
        if (previousNrOfPoules >= 26) {
            const firstLetter = (previousNrOfPoules - secondLetter) / 26;
            pouleName += (String.fromCharCode('A'.charCodeAt(0) + (firstLetter - 1)));
        }
        pouleName += (String.fromCharCode('A'.charCodeAt(0) + secondLetter));
        return pouleName;
    }

    getPoulePlaceFromName(pouleplace: PoulePlace, competitorName = false, longName = false) {
        if (competitorName === true && pouleplace.getCompetitor() !== undefined) {
            return pouleplace.getCompetitor().getName();
        }
        const fromQualifyRule = pouleplace.getFromQualifyRule();
        if (fromQualifyRule === undefined) { // first round
            return this.getPoulePlaceName(pouleplace, false, longName);
        }
        if (fromQualifyRule.isMultiple() === false) {
            const fromPoulePlace = fromQualifyRule.getFromEquivalent(pouleplace);
            if (longName !== true || fromPoulePlace.getPoule().needsRanking()) {
                return this.getPoulePlaceName(fromPoulePlace, false, longName);
            }
            const name = this.getWinnersLosersDescription(fromPoulePlace.getNumber() === 1 ? Round.WINNERS : Round.LOSERS);
            return name + ' ' + this.getPouleName(fromPoulePlace.getPoule(), false);
        }
        if (longName === true) {
            return 'poule ? nr. ' + this.getNumberFromQualifyRule(fromQualifyRule);
        }
        return '?' + this.getNumberFromQualifyRule(fromQualifyRule);
    }

    getQualifyRuleName(qualifyRule: QualifyRule): string {
        if (qualifyRule.isSingle()) {
            return 'nummers ' + this.getNumberFromQualifyRule(qualifyRule);
        }
        if (qualifyRule.getWinnersOrLosers() === Round.WINNERS) {
            return qualifyRule.getToPoulePlaces().length + ' beste nummers ' + this.getNumberFromQualifyRule(qualifyRule);
        }
        const firstFromPoulePlace = qualifyRule.getFromPoulePlaces()[0];
        let nr = firstFromPoulePlace.getPoule().getPlaces().length - firstFromPoulePlace.getNumber();
        const start = qualifyRule.getToPoulePlaces().length + ' slechtste ';
        if (nr === 0) {
            return start + 'nummers laatst';
        }
        return start + 'nummers ' + nr + ' na laatst';
    }

    protected childRoundsHaveEqualDepth(round: Round): boolean {
        if( round.getQualifyPoules().length < 2 ) {
            return false;
        }
        let maxDepth = undefined;
        return round.getQualifyPoules().some( qualifyPoule => {
            const qualifyPouleMaxDepth = this.getMaxDepth(qualifyPoule.getChildRound());
            if( maxDepth === undefined ) {
                maxDepth = qualifyPouleMaxDepth;
            }
            return maxDepth === qualifyPouleMaxDepth;
        } );
    }

    protected getNumberFromQualifyRule(qualifyRule: QualifyRule): number {
        const poulePlaces = qualifyRule.getFromPoulePlaces();
        if (qualifyRule.getWinnersOrLosers() === Round.WINNERS) {
            return poulePlaces[0].getNumber();
        }
        return poulePlaces[poulePlaces.length - 1].getNumber();
    }

    getPoulePlacesFromName(gamePoulePlaces: GamePoulePlace[], competitorName = false, longName = false) {
        return gamePoulePlaces.map(gamePoulePlace => this.getPoulePlaceFromName(gamePoulePlace.getPoulePlace(), competitorName, longName)).join(' & ');
    }

    getPoulePlaceName(poulePlace: PoulePlace, competitorName = false, longName = false) {
        if (competitorName === true && poulePlace.getCompetitor() !== undefined) {
            return poulePlace.getCompetitor().getName();
        }
        if (longName === true) {
            return this.getPouleName(poulePlace.getPoule(), true) + ' nr. ' + poulePlace.getNumber();
        }
        const name = this.getPouleName(poulePlace.getPoule(), false);
        return name + poulePlace.getNumber();
    }

    getRefereeName(game: Game, longName?: boolean): string {
        if (game.getReferee() !== undefined) {
            return longName ? game.getReferee().getName() : game.getReferee().getInitials();
        }
        if (game.getRefereePoulePlace() !== undefined) {
            return this.getPoulePlaceName(game.getRefereePoulePlace(), true, longName);
        }
        return undefined;
    }

    private roundsHaveSameName(roundNumber: RoundNumber): boolean {
        let roundNameAll;
        return roundNumber.getRounds().some((round) => {
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

    private roundAndParentsNeedsRanking(round: Round) {

        if (!round.needsRanking()) {
            return false;
        }
        if (!round.isRoot()) {
            return this.roundAndParentsNeedsRanking(round.getParent());
        }
        return true;
    }

    /**
     * determine number of pouleplaces on left side
     * @param round
     */
    private getRankedPlace(round: Round, rankedPlace: number = 1) {
        const parentRound = round.getParent();
        if (parentRound === undefined) {
            return rankedPlace;
        }
        if (round.getWinnersOrLosers() === Round.LOSERS) {
            rankedPlace += parentRound.getPoulePlaces().length - round.getPoulePlaces().length;
        }
        return this.getRankedPlace(parentRound, rankedPlace);
    }

    private getHtmlFractalNumber(number) {
        if (number === 2 || number === 4) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    private getHtmlNumber(number) {
        return number + '<sup>' + (number === 1 ? 'st' : 'd') + 'e</sup>';
    }

    private aChildRoundHasMultiplePlacesPerPoule(round: Round) {
        return round.getChildren().some(childRound => {
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
        console.error('getNrOfPoulesParentRounds');
        return -1;
        // return this.getNrOfPoulesParentRoundsHelper(round.getNumberAsValue() - 1, round.getRoot());
    }

    private getNrOfPoulesParentRoundsHelper(maxRoundNumber: number, round: Round): number {
        if (round.getNumberAsValue() > maxRoundNumber) {
            return 0;
        }
        let nrOfPoules = round.getPoules().length;
        round.getChildren().forEach((childRound) => {
            nrOfPoules += this.getNrOfPoulesParentRoundsHelper(maxRoundNumber, childRound);
        });
        return nrOfPoules;
    }

    private getNrOfPoulesSiblingRounds(roundNumber: number, round: Round): number {
        let nrOfPoules = 0;

        const parentRound = round.getParent();
        if (parentRound !== undefined) {
            nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, parentRound/* round */);
        }

        if (round.getWinnersOrLosers() === Round.LOSERS) {
            console.error('opposing');
            // const winningSibling = round.getOpposing();
            // if (winningSibling !== undefined) {
            //     nrOfPoules += this.getNrOfPoulesForChildRounds(winningSibling, roundNumber);
            // }
        }
        return nrOfPoules;
    }

    private getNrOfPoulesForChildRounds(round: Round, roundNumber: number): number {
        let nrOfChildPoules = 0;
        if (round.getNumberAsValue() > roundNumber) {
            return nrOfChildPoules;
        } else if (round.getNumberAsValue() === roundNumber) {
            return round.getPoules().length;
        }

        round.getChildren().forEach((childRound) => {
            nrOfChildPoules += this.getNrOfPoulesForChildRounds(childRound, roundNumber);
        });
        return nrOfChildPoules;
    }

     /* maak hier een aparte functie van, buiten ROUND? */
     getMaxDepth(round: Round): number {
        if( round.getQualifyPoules().length === 0 ) {
            return 0;
        }
        let biggestMaxDepth = 1;
        round.getChildren().forEach( child => {
            const maxDepth = this.getMaxDepth(child);
            if (maxDepth > biggestMaxDepth) {
                biggestMaxDepth = maxDepth;
            }
        });
        return biggestMaxDepth;
    }
}
