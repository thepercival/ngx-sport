import { GameMode } from './planning/gameMode';
import { PointsCalculation } from './ranking/pointsCalculation';
import { FootballLine } from './sport/football';
import { RankingRule } from './ranking/rule';
import { RankingRuleGetter } from './ranking/rule/getter';
import { AgainstRuleSet } from './ranking/againstRuleSet';
import { QualifyTarget } from './qualify/target';

export class NameService {

    constructor(/*private competitorMap?: CompetitorMap*/) {
    }

    /*getCompetitorMap(): CompetitorMap | undefined {
        return this.competitorMap;
    }*/

    getQualifyTargetDescription(qualifyTarget: QualifyTarget, multiple: boolean = false): string {
        const descr = qualifyTarget === QualifyTarget.Winners ? 'winnaar' : (qualifyTarget === QualifyTarget.Losers ? 'verliezer' : '');
        return ((multiple && (descr !== '')) ? descr + 's' : descr);
    }


    getFormationLineName(line: FootballLine | undefined): string {
        if (line === FootballLine.GoalKeeper) {
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

    getRulesName(againstRuleSet: AgainstRuleSet | undefined): string[] {
        const rankingRuleGetter = new RankingRuleGetter();
        return rankingRuleGetter.getRules(againstRuleSet, false).map((rule: RankingRule): string => {
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
}