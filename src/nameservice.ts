import { Game } from './game';
import { GamePoulePlace } from './game/pouleplace';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { QualifyGroup } from './qualify/group';
import { QualifyRule } from './qualify/rule';
import { QualifyRuleService } from './qualify/rule/service';
import { Round } from './round';
import { RoundNumber } from './round/number';

export class NameService {
    constructor() {
    }

    getWinnersLosersDescription(winnersOrLosers: number, multiple: boolean = false): string {
        const description = winnersOrLosers === QualifyGroup.WINNERS ? 'winnaar' : (winnersOrLosers === QualifyGroup.LOSERS ? 'verliezer' : '');
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
        return this.getHtmlNumber(roundNumber.getNumber()) + ' ronde';
    }

    getRoundName(round: Round, sameName: boolean = false) {
        if (this.roundAndParentsNeedsRanking(round) || !this.childRoundsHaveEqualDepth(round)) {
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
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = poule.needsRanking() ? 'poule ' : 'wed. ';
        }
        const pouleStructureNumber = poule.getStructureNumber() - 1;
        const secondLetter = pouleStructureNumber % 26;
        if (pouleStructureNumber >= 26) {
            const firstLetter = (pouleStructureNumber - secondLetter) / 26;
            pouleName += (String.fromCharCode('A'.charCodeAt(0) + (firstLetter - 1)));
        }
        pouleName += (String.fromCharCode('A'.charCodeAt(0) + secondLetter));
        return pouleName;
    }

    getPoulePlaceFromName(pouleplace: PoulePlace, competitorName = false, longName = false) {
        if (competitorName === true && pouleplace.getCompetitor() !== undefined) {
            return pouleplace.getCompetitor().getName();
        }

        const parentQualifyGroup = pouleplace.getRound().getParentQualifyGroup();
        if (parentQualifyGroup === undefined) {
            return this.getPoulePlaceName(pouleplace, false, longName);
        }

        const qualifyService = new QualifyRuleService(parentQualifyGroup.getRound());
        if (!qualifyService.hasOneQualifier(pouleplace)) {
            return (longName ? 'poule ? nr. ' : '?') + this.getNumberFromQualifyRule(fromQualifyRule);
        }

        const fromPoulePlace = qualifyService.getQualifier(pouleplace);
        if (longName !== true || fromPoulePlace.getPoule().needsRanking()) {
            return this.getPoulePlaceName(fromPoulePlace, false, longName);
        }
        const name = this.getWinnersLosersDescription(fromPoulePlace.getNumber() === 1 ? QualifyGroup.WINNERS : QualifyGroup.LOSERS);
        return name + ' ' + this.getPouleName(fromPoulePlace.getPoule(), false);

    }

    getQualifyRuleName(qualifyRule: QualifyRule): string {
        if (qualifyRule.isSingle()) {
            return 'nummers ' + this.getNumberFromQualifyRule(qualifyRule);
        }
        if (qualifyRule.getWinnersOrLosers() === QualifyGroup.WINNERS) {
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
        if (round.getQualifyGroups().length < 2) {
            return false;
        }
        let maxDepth = undefined;
        return round.getQualifyGroups().some(qualifyGroup => {
            const qualifyGroupMaxDepth = this.getMaxDepth(qualifyGroup.getChildRound());
            if (maxDepth === undefined) {
                maxDepth = qualifyGroupMaxDepth;
            }
            return maxDepth === qualifyGroupMaxDepth;
        });
    }

    protected getNumberFromQualifyRule(qualifyRule: QualifyRule): number {
        const poulePlaces = qualifyRule.getFromPoulePlaces();
        if (qualifyRule.getWinnersOrLosers() === QualifyGroup.WINNERS) {
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
        if (round.getWinnersOrLosers() === QualifyGroup.LOSERS) {
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

    // private getNrOfPreviousPoules(roundNumber: number, round: Round, poule: Poule): number {
    //     let nrOfPoules = poule.getNumber() - 1;
    //     nrOfPoules += this.getNrOfPoulesParentRounds(round);
    //     nrOfPoules += this.getNrOfPoulesSiblingRounds(roundNumber, round);
    //     return nrOfPoules;
    // }

    /* maak hier een aparte functie van, buiten ROUND? */
    getMaxDepth(round: Round): number {
        if (round.getQualifyGroups().length === 0) {
            return 0;
        }
        let biggestMaxDepth = 1;
        round.getChildren().forEach(child => {
            const maxDepth = this.getMaxDepth(child);
            if (maxDepth > biggestMaxDepth) {
                biggestMaxDepth = maxDepth;
            }
        });
        return biggestMaxDepth;
    }
}
