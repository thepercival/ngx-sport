import { Injectable } from '@angular/core';

import { CompetitionSport } from '../../competition/sport';
import { AgainstQualifyConfig } from '../againstConfig';
import { Round } from '../group';

@Injectable({
    providedIn: 'root'
})
export class AgainstQualifyConfigService {

    constructor(/*private competitionSportMapper: CompetitionSportMapper,
        private againstQualifyConfigMapper: AgainstQualifyConfigMapper*/) {
    }

    createFirst(competitionSport: CompetitionSport, round: Round): AgainstQualifyConfig {
        const sport = competitionSport.getSport();
        const config = new AgainstQualifyConfig(competitionSport, round,
            competitionSport.getDefaultPointsCalculation(),
            competitionSport.getDefaultWinPoints(),
            competitionSport.getDefaultDrawPoints(),
            competitionSport.getDefaultWinPointsExt(),
            competitionSport.getDefaultDrawPointsExt(),
            competitionSport.getDefaultLosePointsExt()
        );
        return config;
    }

    createByPrevious(previous: AgainstQualifyConfig, competitionSport: CompetitionSport, round: Round): AgainstQualifyConfig {
        const sport = competitionSport.getSport();
        const config = new AgainstQualifyConfig(competitionSport, round,
            previous.getPointsCalculation(),
            previous.getWinPoints(),
            previous.getDrawPoints(),
            previous.getWinPointsExt(),
            previous.getDrawPointsExt(),
            previous.getLosePointsExt()
        );
        return config;
    }

    // createDefaultJsonFromPrevious(competitionSport: CompetitionSport): JsonAgainstQualifyConfig {
    //     const sport = competitionSport.getSport();
    //     const config: JsonAgainstQualifyConfig = {competitionSportId
    //         new AgainstQualifyConfig(competitionSport, round,
    //         competitionSport.getDefaultPointsCalculation(),
    //         competitionSport.getDefaultWinPoints(),
    //         competitionSport.getDefaultDrawPoints(),
    //         competitionSport.getDefaultWinPointsExt(),
    //         competitionSport.getDefaultDrawPointsExt(),
    //         competitionSport.getDefaultLosePointsExt()
    //     );
    //     return config;
    // }

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
