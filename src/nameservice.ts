import { Game } from './game';
import { GamePlace } from './game/place';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Place } from './place';
import { QualifyGroup, Round } from './qualify/group';
import { MultipleQualifyRule } from './qualify/rule/multiple';
import { SingleQualifyRule } from './qualify/rule/single';
import { RoundNumber } from './round/number';
import { GameMode } from './planning/gameMode';
import { PointsCalculation } from './ranking/pointsCalculation';
import { FootballLine } from './sport/football';
import { RankingRule } from './ranking/rule';
import { RankingRuleGetter } from './ranking/rule/getter';
import { ScoreConfig } from './score/config';
import { CompetitorMap } from './competitor/map';
import { RankingRuleSet } from './ranking/ruleSet';
import { QualifyTarget } from './qualify/target';
import { PreviousNrOfDropoutsMap } from './ranking/map/previousNrOfDropouts';
import { PouleStructureNumberMap } from './ranking/map/pouleStructureNumber';
import { PlaceLocation } from './place/location';

export class NameService {
    private previousNrOfDropoutsMap: PreviousNrOfDropoutsMap | undefined;
    private pouleStructureNumberMap: PouleStructureNumberMap | undefined;

    constructor(private competitorMap?: CompetitorMap) {
    }

    getCompetitorMap(): CompetitorMap | undefined {
        return this.competitorMap;
    }

    getQualifyTargetDescription(qualifyTarget: QualifyTarget, multiple: boolean = false): string {
        const descr = qualifyTarget === QualifyTarget.Winners ? 'winnaar' : (qualifyTarget === QualifyTarget.Losers ? 'verliezer' : '');
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
            const rank = this.getPreviousNrOfDropoutsMap(round).get(round) + 1;
            return this.getHtmlNumber(rank) + ' / ' + this.getHtmlNumber(rank + 1) + ' pl';
        }
        return 'finale';
    }

    getPouleName(poule: Poule, withPrefix: boolean): string {
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = poule.needsRanking() ? 'poule ' : 'wed. ';
        }
        const pouleStructureNumber = this.getPouleStructureNumberMap(poule.getRound()).get(poule) - 1;
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
        let competitorName = p_competitorName && this.competitorMap;
        const startLocation: PlaceLocation | undefined = place.getStartLocation();
        if (competitorName && this.competitorMap && startLocation) {
            const competitor = this.competitorMap.getCompetitor(startLocation);
            if (competitor !== undefined) {
                return competitor.getName();
            }
        }
        if (longName === true) {
            return this.getPouleName(place.getPoule(), true) + ' nr. ' + place.getPlaceNr();
        }
        const name = this.getPouleName(place.getPoule(), false);
        return name + place.getPlaceNr();
    }

    getPlaceFromName(place: Place, competitorName: boolean, longName?: boolean): string {
        competitorName = competitorName ? (this.competitorMap !== undefined) : false;
        const startLocation: PlaceLocation | undefined = place.getStartLocation();
        if (competitorName && this.competitorMap && startLocation) {
            const particpant = this.competitorMap.getCompetitor(startLocation);
            if (particpant !== undefined) {
                return particpant.getName();
            }
        }

        let fromQualifyRule: SingleQualifyRule | MultipleQualifyRule | undefined;
        try {
            fromQualifyRule = place.getRound().getParentQualifyGroup()?.getRule(place);
        } catch (e) { }
        if (fromQualifyRule === undefined) {
            return this.getPlaceName(place, false, longName);
        }
        if (fromQualifyRule instanceof MultipleQualifyRule) {
            if (longName) {
                return this.getHorizontalPouleName(fromQualifyRule.getFromHorizontalPoule());
            }
            return '?' + fromQualifyRule.getFromPlaceNumber();
        }

        const fromPlace = fromQualifyRule.getFromPlace(place);
        if (longName !== true || fromPlace.getPoule().needsRanking()) {
            return this.getPlaceName(fromPlace, false, longName);
        }
        const name = this.getQualifyTargetDescription(fromPlace.getPlaceNr() === 1 ? QualifyTarget.Winners : QualifyTarget.Losers);
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
        const qualifyRule = horizontalPoule.getQualifyRule();
        if (qualifyRule === undefined) {
            return 'nummers ' + horizontalPoule.getNumber();
        }
        const nrOfToPlaces = qualifyRule.getNrOfToPlaces();

        if (qualifyRule.getQualifyTarget() === QualifyTarget.Winners) {
            const nameWinners = 'nummer' + (nrOfToPlaces > 1 ? 's ' : ' ') + horizontalPoule.getNumber();
            if (qualifyRule instanceof MultipleQualifyRule) {
                return (nrOfToPlaces > 1 ? (nrOfToPlaces + ' ') : '') + 'beste ' + nameWinners;
            }
            return nameWinners;
        }
        let name = (nrOfToPlaces > 1 ? 'nummers ' : '');
        name += horizontalPoule.getNumber() > 1 ? ((horizontalPoule.getNumber() - 1) + ' na laatst') : 'laatste';
        if (qualifyRule instanceof MultipleQualifyRule) {
            return (nrOfToPlaces > 1 ? (nrOfToPlaces + ' ') : '') + 'slechtste ' + name;
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
        switch (gameMode) {
            case GameMode.Single:
                return 'alleen';
            case GameMode.Against:
                return 'tegen elkaar';
        }
        return 'iedereen tegelijk tegen elkaar';
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

    /*getRuleSetName(scoreConfig: ScoreConfig): string {
        return '?';
    }*/

    getRulesName(ruleSet: RankingRuleSet): string[] {
        const rankingRuleGetter = new RankingRuleGetter();
        return rankingRuleGetter.getRules(ruleSet, false).map((rule: RankingRule): string => {
            switch (rule) {
                case RankingRule.MostPoints:
                    return 'meeste aantal punten';
                case RankingRule.FewestGames:
                    return 'minste aantal wedstrijden';
                case RankingRule.BestUnitDifference:
                    return 'beste saldo';
                case RankingRule.MostUnitsScored:
                    return 'meeste aantal eenheden voor';
                case RankingRule.BestAmongEachOther:
                    return 'beste onderling resultaat';
                case RankingRule.BestSubUnitDifference:
                    return 'beste subsaldo';
                case RankingRule.MostSubUnitsScored:
                    return 'meeste aantal subeenheden voor';
            }
        });
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

    resetStructure(): void {
        this.previousNrOfDropoutsMap = undefined;
        this.pouleStructureNumberMap = undefined;
    }

    private getPreviousNrOfDropoutsMap(round: Round): PreviousNrOfDropoutsMap {
        if (this.previousNrOfDropoutsMap === undefined) {
            this.previousNrOfDropoutsMap = new PreviousNrOfDropoutsMap(round.getRoot());
        }
        return this.previousNrOfDropoutsMap;
    }

    private getPouleStructureNumberMap(round: Round): PouleStructureNumberMap {
        if (this.pouleStructureNumberMap === undefined) {
            this.pouleStructureNumberMap = new PouleStructureNumberMap(round.getNumber().getFirst(), this.getPreviousNrOfDropoutsMap(round));
        }
        return this.pouleStructureNumberMap;
    }

}
