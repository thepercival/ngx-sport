import { Game } from './game';
import { GamePoulePlace } from './game/pouleplace';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { PoulePlace } from './pouleplace';
import { QualifyGroup } from './qualify/group';
import { QualifyRuleMultiple } from './qualify/rule/multiple';
import { QualifyRuleSingle } from './qualify/rule/single';
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
    getRoundNumberName(roundNumber: RoundNumber): string {
        if (this.roundsHaveSameName(roundNumber)) {
            return this.getRoundName(roundNumber.getARound(), true);
        }
        return this.getHtmlNumber(roundNumber.getNumber()) + ' ronde';
    }

    getRoundName(round: Round, sameName: boolean = false): string {
        if (this.roundAndParentsNeedsRanking(round) || !this.childRoundsHaveEqualDepth(round)) {
            return this.getHtmlNumber(round.getNumberAsValue()) + ' ronde';
        }

        const nrOfRoundsToGo = this.getMaxDepth(round);
        if (nrOfRoundsToGo >= 2 && nrOfRoundsToGo <= 5) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        } else if (nrOfRoundsToGo === 1) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        } else if (nrOfRoundsToGo === 1 || (nrOfRoundsToGo === 0 && round.getNrOfPlaces() > 1)) {
            if (round.getNrOfPlaces() === 2 && sameName === false) {
                const rank = round.getStructureNumber() + 1;
                return this.getHtmlNumber(rank) + '/' + this.getHtmlNumber(rank + 1) + ' plaats';
            }
            return 'finale';
        } else if (nrOfRoundsToGo === 0) {
            return round.getParentQualifyGroup() ? this.getWinnersLosersDescription(round.getParentQualifyGroup().getWinnersOrLosers()) : '';
        }
        return '?';
    }

    getPouleName(poule: Poule, withPrefix: boolean): string {
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

    getPoulePlaceFromName(place: PoulePlace, competitorName = false, longName = false): string {
        if (competitorName === true && place.getCompetitor() !== undefined) {
            return place.getCompetitor().getName();
        }

        const parentQualifyGroup = place.getRound().getParentQualifyGroup();
        if (parentQualifyGroup === undefined) {
            return this.getPoulePlaceName(place, false, longName);
        }

        const fromQualifyRule = place.getFromQualifyRule();
        if (fromQualifyRule.isMultiple()) {
            if (longName) {
                return this.getHorizontalPouleName((<QualifyRuleMultiple>fromQualifyRule).getFromHorizontalPoule());
            }
            return '?' + fromQualifyRule.getFromPlaceNumber();
        }

        const fromPoulePlace = (<QualifyRuleSingle>fromQualifyRule).getFromPlace();
        if (longName !== true || fromPoulePlace.getPoule().needsRanking()) {
            return this.getPoulePlaceName(fromPoulePlace, false, longName);
        }
        const name = this.getWinnersLosersDescription(fromPoulePlace.getNumber() === 1 ? QualifyGroup.WINNERS : QualifyGroup.LOSERS);
        return name + ' ' + this.getPouleName(fromPoulePlace.getPoule(), false);
    }

    /**
     * 
     * "nummers 2" voor winners complete
     * "3 beste nummers 2" voor winners incomplete
     * 
     * "nummers 2 na laast" voor losers complete
     * "3 slechtste nummers 2 na laast" voor losers incomplete
     * 
     * @param horizontalPoule 
     */
    getHorizontalPouleName(horizontalPoule: HorizontalPoule): string {
        const nrOfQualifiers = horizontalPoule.getNrOfQualifiers();
        let name = 'nummer' + (nrOfQualifiers > 1 ? 's ' : ' ') + horizontalPoule.getNumber();
        if (horizontalPoule.getWinnersOrLosers() === QualifyGroup.WINNERS) {
            if (horizontalPoule.isBorderPoule()) {
                return (nrOfQualifiers > 1 ? (nrOfQualifiers + ' ') : '') + 'beste ' + name;
            }
            return name;
        }
        if (horizontalPoule.isBorderPoule()) {
            return (nrOfQualifiers > 1 ? (nrOfQualifiers + ' ') : '') + 'slechtste ' + name;
        }
        return name + ' na laatst';
    }

    protected childRoundsHaveEqualDepth(round: Round): boolean {
        if (round.getQualifyGroups().length < 2) {
            return true;
        }
        let depthAll = undefined;
        return round.getQualifyGroups().every(qualifyGroup => {
            const qualifyGroupMaxDepth = this.getMaxDepth(qualifyGroup.getChildRound());
            if (depthAll === undefined) {
                depthAll = qualifyGroupMaxDepth;
            }
            return depthAll === qualifyGroupMaxDepth;
        });
    }

    getPoulePlacesFromName(gamePoulePlaces: GamePoulePlace[], competitorName = false, longName = false): string {
        return gamePoulePlaces.map(gamePoulePlace => this.getPoulePlaceFromName(gamePoulePlace.getPoulePlace(), competitorName, longName)).join(' & ');
    }

    getPoulePlaceName(poulePlace: PoulePlace, competitorName = false, longName = false): string {
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

    private roundAndParentsNeedsRanking(round: Round): boolean {

        if (!round.needsRanking()) {
            return false;
        }
        if (!round.isRoot()) {
            return this.roundAndParentsNeedsRanking(round.getParent());
        }
        return true;
    }

    private getHtmlFractalNumber(number): string {
        if (number === 2 || number === 4) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    private getHtmlNumber(number): string {
        return number + '<sup>' + (number === 1 ? 'st' : 'd') + 'e</sup>';
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
