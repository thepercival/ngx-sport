import { Game } from './game';
import { GamePlace } from './game/place';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Place } from './place';
import { QualifyGroup, Round } from './qualify/group';
import { QualifyRuleMultiple } from './qualify/rule/multiple';
import { QualifyRuleSingle } from './qualify/rule/single';
import { RoundNumber } from './round/number';
import { PlaceLocationMap } from './place/location/map';
import { GameMode } from './planning/gameMode';
import { PointsCalculation } from './ranking/pointsCalculation';
import { FootballLine } from './sport/football';
import { CustomSport } from './sport/custom';

export class NameService {
    constructor(private placeLocationMap?: PlaceLocationMap) {
    }

    getWinnersLosersDescription(winnersOrLosers: number, multiple: boolean = false): string {
        const descr = winnersOrLosers === QualifyGroup.WINNERS ? 'winnaar' : (winnersOrLosers === QualifyGroup.LOSERS ? 'verliezer' : '');
        return ((multiple && (descr !== '')) ? descr + 's' : descr);
    }

    /**
    *   als allemaal dezelfde naam dan geef die naam
    *   als verschillende namen geef dan xde ronde met tooltip van de namen
    */
    getRoundNumberName(roundNumber: RoundNumber): string {
        if (this.roundsHaveSameName(roundNumber) && roundNumber.getRounds().length > 0) {
            return this.getRoundName(roundNumber.getRounds()[0], true);
        }
        return this.getHtmlNumber(roundNumber.getNumber()) + ' ronde';
    }

    getRoundNumbersName(startRoundNumber: RoundNumber): string {
        if (startRoundNumber.getNumber() === 1) {
            return 'alle ronden';
        }
        if (startRoundNumber.hasNext()) {
            return 'vanaf de ' + this.getRoundNumberName(startRoundNumber);
        }
        return 'alleen de ' + this.getRoundNumberName(startRoundNumber);
    }

    getRoundName(round: Round, sameName: boolean = false): string {
        if (this.roundAndParentsNeedsRanking(round) || !this.childRoundsHaveEqualDepth(round)) {
            return this.getHtmlNumber(round.getNumberAsValue()) + ' ronde';
        }

        const nrOfRoundsToGo = this.getMaxDepth(round);
        if (nrOfRoundsToGo >= 1) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        }
        if (round.getNrOfPlaces() === 2 && sameName === false) {
            const rank = round.getStructureNumber() + 1;
            return this.getHtmlNumber(rank) + ' / ' + this.getHtmlNumber(rank + 1) + ' pl';
        }
        return 'finale';
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
            pouleName += this.getPouleLetter(firstLetter);
        }
        pouleName += this.getPouleLetter(secondLetter + 1);
        return pouleName;
    }

    getPouleLetter(structureNumber: number): string {
        return (String.fromCharCode('A'.charCodeAt(0) + structureNumber - 1));
    }

    getPlaceName(place: Place, p_competitorName?: boolean, longName?: boolean): string {
        let competitorName = p_competitorName && this.placeLocationMap;
        if (competitorName && this.placeLocationMap) {
            const particpant = this.placeLocationMap.getCompetitor(place.getStartLocation());
            if (particpant !== undefined) {
                return particpant.getName();
            }
        }
        if (longName === true) {
            return this.getPouleName(place.getPoule(), true) + ' nr. ' + place.getNumber();
        }
        const name = this.getPouleName(place.getPoule(), false);
        return name + place.getNumber();
    }

    getPlaceFromName(place: Place, competitorName: boolean, longName?: boolean): string {
        competitorName = competitorName ? (this.placeLocationMap !== undefined) : false;
        if (competitorName && this.placeLocationMap) {
            const particpant = this.placeLocationMap.getCompetitor(place.getStartLocation());
            if (particpant !== undefined) {
                return particpant.getName();
            }
        }

        const parentQualifyGroup = place.getRound().getParentQualifyGroup();
        if (parentQualifyGroup === undefined) {
            return this.getPlaceName(place, false, longName);
        }

        const fromQualifyRule = place.getFromQualifyRule();
        if (fromQualifyRule?.isMultiple()) {
            if (longName) {
                return this.getHorizontalPouleName((<QualifyRuleMultiple>fromQualifyRule).getFromHorizontalPoule());
            }
            return '?' + fromQualifyRule.getFromPlaceNumber();
        }

        const fromPlace = (<QualifyRuleSingle>fromQualifyRule).getFromPlace();
        if (longName !== true || fromPlace.getPoule().needsRanking()) {
            return this.getPlaceName(fromPlace, false, longName);
        }
        const name = this.getWinnersLosersDescription(fromPlace.getNumber() === 1 ? QualifyGroup.WINNERS : QualifyGroup.LOSERS);
        return name + ' ' + this.getPouleName(fromPlace.getPoule(), false);
    }

    getPlacesFromName(gamePlaces: GamePlace[], competitorName: boolean, longName?: boolean): string {
        return gamePlaces.map(gamePlace => this.getPlaceFromName(gamePlace.getPlace(), competitorName, longName)).join(' & ');
    }

    /**
     * "nummers 2" voor winners complete
     * "3 beste nummers 2" voor winners incomplete
     *
     * "nummers 2 na laast" voor losers complete
     * "3 slechtste nummers 2 na laast" voor losers incomplete
     *
     * @param horizontalPoule
     */
    getHorizontalPouleName(horizontalPoule: HorizontalPoule): string {
        if (horizontalPoule.getQualifyGroup() === undefined) {
            return 'nummers ' + horizontalPoule.getNumber();
        }
        const nrOfQualifiers = horizontalPoule.getNrOfQualifiers();

        if (horizontalPoule.getWinnersOrLosers() === QualifyGroup.WINNERS) {
            const nameWinners = 'nummer' + (nrOfQualifiers > 1 ? 's ' : ' ') + horizontalPoule.getNumber();
            if (horizontalPoule.isBorderPoule() && horizontalPoule.getQualifyRuleMultiple() !== undefined) {
                return (nrOfQualifiers > 1 ? (nrOfQualifiers + ' ') : '') + 'beste ' + nameWinners;
            }
            return nameWinners;
        }
        let name = (nrOfQualifiers > 1 ? 'nummers ' : '');
        name += horizontalPoule.getNumber() > 1 ? ((horizontalPoule.getNumber() - 1) + ' na laatst') : 'laatste';
        if (horizontalPoule.isBorderPoule() && horizontalPoule.getQualifyRuleMultiple() !== undefined) {
            return (nrOfQualifiers > 1 ? (nrOfQualifiers + ' ') : '') + 'slechtste ' + name;
        }
        return name;
    }

    getRefereeName(game: Game, longName?: boolean): string | undefined {
        const referee = game.getReferee();
        if (referee) {
            return longName ? referee.getName() : referee.getInitials();
        }
        const refereePlace = game.getRefereePlace();
        if (refereePlace) {
            return this.getPlaceName(refereePlace, true, longName);
        }
        return '';
    }

    getFormationLineName(line: FootballLine): string {
        if (line === FootballLine.GoalKepeer) {
            return 'keeper';
        } else if (line === FootballLine.Defense) {
            return 'verdediging';
        } else if (line === FootballLine.Midfield) {
            return 'middenveld';
        } else if (line === FootballLine.Forward) {
            return 'aanval';
        }
        return 'alle linies';
    }

    getGameModeName(gameMode: GameMode): string {
        return gameMode === GameMode.Against ? 'tegen elkaar' : 'met elkaar';
    }

    getPointsCalculationName(pointsCalculation: PointsCalculation): string {
        switch (pointsCalculation) {
            case PointsCalculation.AgainstGamePoints:
                return 'alleen punten';
            case PointsCalculation.Scores:
                return 'alleen score';
        }
        return 'punten + score';
    }

    getNrOfGamePlacesName(nrOfGamePlaces: number): string {
        switch (nrOfGamePlaces) {
            case 0:
                return 'alle deelnemers';
            case 1:
                return '1 deelnemer';
        }
        return nrOfGamePlaces + ' deelnemers';
    }

    protected childRoundsHaveEqualDepth(round: Round): boolean {
        if (round.getQualifyGroups().length === 1) {
            return true;
        }
        let depthAll: number;
        return round.getQualifyGroups().every(qualifyGroup => {
            const qualifyGroupMaxDepth = this.getMaxDepth(qualifyGroup.getChildRound());
            if (depthAll === undefined) {
                depthAll = qualifyGroupMaxDepth;
            }
            return depthAll === qualifyGroupMaxDepth;
        });
    }

    private roundsHaveSameName(roundNumber: RoundNumber): boolean {
        let roundNameAll: string;
        return roundNumber.getRounds().every((round) => {
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
        const parent = round.getParent();
        if (parent) {
            return this.roundAndParentsNeedsRanking(parent);
        }
        return true;
    }

    private getHtmlFractalNumber(number: number): string {
        if (number === 2 || number === 4) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    private getHtmlNumber(number: number): string {
        return number + '<sup>' + (number === 1 ? 'st' : 'd') + 'e</sup>';
    }

    private getMaxDepth(round: Round): number {
        let biggestMaxDepth = 0;
        round.getChildren().forEach(child => {
            const maxDepth = 1 + this.getMaxDepth(child);
            if (maxDepth > biggestMaxDepth) {
                biggestMaxDepth = maxDepth;
            }
        });
        return biggestMaxDepth;
    }
}
