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
        const config = new AgainstQualifyConfig(competitionSport, round, this.getDefaultPointCalculation(competitionSport));
        const sport = competitionSport.getSport();
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setWinPointsExt(this.getDefaultWinPointsExt(sport));
        config.setDrawPointsExt(this.getDefaultDrawPointsExt(sport));
        config.setLosePointsExt(this.getDefaultLosePointsExt(sport));
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
        const config = new AgainstQualifyConfig(competitionSport, round, sourceConfig.getPointsCalculation());
        config.setWinPoints(sourceConfig.getWinPoints());
        config.setDrawPoints(sourceConfig.getDrawPoints());
        config.setWinPointsExt(sourceConfig.getWinPointsExt());
        config.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        config.setLosePointsExt(sourceConfig.getLosePointsExt());
        return config;
    }

    getDefaultPointCalculation(competitionSport: CompetitionSport): PointsCalculation {
        if (competitionSport.getVariant() instanceof AgainstVariant) {
            return PointsCalculation.AgainstGamePoints;
        }
        return PointsCalculation.Scores;
    }

    getDefaultWinPoints(sport: Sport): number {
        return sport.getCustomId() !== CustomSport.Chess ? AgainstQualifyConfig.Default_WinPoints : 1;
    }

    getDefaultDrawPoints(sport: Sport): number {
        return sport.getCustomId() !== CustomSport.Chess ? AgainstQualifyConfig.Default_DrawPoints : 0.5;
    }

    getDefaultWinPointsExt(sport: Sport): number {
        return sport.getCustomId() !== CustomSport.Chess ? AgainstQualifyConfig.Default_WinPointsExt : 1;
    }

    getDefaultDrawPointsExt(sport: Sport): number {
        return sport.getCustomId() !== CustomSport.Chess ? AgainstQualifyConfig.Default_DrawPointsExt : 0.5;
    }

    getDefaultLosePointsExt(sport: Sport): number {
        return sport.getCustomId() !== CustomSport.IceHockey ? AgainstQualifyConfig.Default_LosePointsExt : 1;
    }
}
