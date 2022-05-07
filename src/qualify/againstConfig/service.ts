import { Injectable } from '@angular/core';

import { CompetitionSport } from '../../competition/sport';
import { AgainstQualifyConfig } from '../againstConfig';
import { Sport } from '../../sport';
import { Round } from '../group';
import { PointsCalculation } from '../../ranking/pointsCalculation';
import { CustomSport } from '../../sport/custom';
import { AgainstVariant } from '../../sport/variant/against';

@Injectable({
    providedIn: 'root'
})
export class AgainstQualifyConfigService {

    constructor(/*private competitionSportMapper: CompetitionSportMapper,
        private againstQualifyConfigMapper: AgainstQualifyConfigMapper*/) {
    }

    // createDefaultJson(competitionSport: CompetitionSport): JsonAgainstQualifyConfig {
    //     const sport = competitionSport.getSport();
    //     return {
    //         id: 0,
    //         competitionSport: this.competitionSportMapper.toJson(competitionSport),
    //         winPoints: this.getDefaultWinPoints(sport),
    //         drawPoints: this.getDefaultDrawPoints(sport),
    //         winPointsExt: this.getDefaultWinPointsExt(sport),
    //         drawPointsExt: this.getDefaultDrawPointsExt(sport),
    //         losePointsExt: this.getDefaultLosePointsExt(sport),
    //         pointsCalculation: PointsCalculationType.AgainstGamePoints
    //     };
    // }

    createDefault(competitionSport: CompetitionSport, round: Round): AgainstQualifyConfig {
        const sport = competitionSport.getSport();
        const config = new AgainstQualifyConfig(competitionSport, round,
            competitionSport.getDefaultPointsCalculation(),
            sport.getDefaultWinPoints(),
            sport.getDefaultDrawPoints(),
            sport.getDefaultWinPointsExt(),
            sport.getDefaultDrawPointsExt(),
            sport.getDefaultLosePointsExt()
        );
        return config;
    }

    removeFromRound(competitionSport: CompetitionSport, round: Round) {
        const qualifyagainstConfig = round.getAgainstQualifyConfig(competitionSport);
        if (qualifyagainstConfig) {
            round.getAgainstQualifyConfigs().splice(round.getAgainstQualifyConfigs().indexOf(qualifyagainstConfig), 1);
        }
        round.getChildren().forEach((child: Round) => this.removeFromRound(competitionSport, child));
    }

    copy(competitionSport: CompetitionSport, round: Round, sourceConfig: AgainstQualifyConfig): AgainstQualifyConfig {
        return new AgainstQualifyConfig(
            competitionSport,
            round,
            sourceConfig.getPointsCalculation(),
            sourceConfig.getWinPoints(),
            sourceConfig.getDrawPoints(),
            sourceConfig.getWinPointsExt(),
            sourceConfig.getDrawPointsExt(),
            sourceConfig.getLosePointsExt()
        );
    }
}
