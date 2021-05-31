import { Injectable } from '@angular/core';

import { JsonAgainstQualifyConfig } from './json';
import { Round } from '../group';
import { CompetitionSportMapper } from '../../competition/sport/mapper';
import { AgainstQualifyConfig } from '../againstConfig';

@Injectable({
    providedIn: 'root'
})
export class AgainstQualifyConfigMapper {
    constructor(private competitionSportMapper: CompetitionSportMapper) { }

    toObject(json: JsonAgainstQualifyConfig, round: Round, againstQualifyConfig?: AgainstQualifyConfig): AgainstQualifyConfig {
        if (againstQualifyConfig === undefined) {
            const competitionSport = this.competitionSportMapper.toObject(json.competitionSport, round.getCompetition());
            againstQualifyConfig = new AgainstQualifyConfig(competitionSport, round, json.pointsCalculation);
        }
        againstQualifyConfig.setId(json.id);
        againstQualifyConfig.setWinPoints(json.winPoints);
        againstQualifyConfig.setDrawPoints(json.drawPoints);
        againstQualifyConfig.setWinPointsExt(json.winPointsExt);
        againstQualifyConfig.setDrawPointsExt(json.drawPointsExt);
        againstQualifyConfig.setLosePointsExt(json.losePointsExt);
        return againstQualifyConfig;
    }

    toJson(config: AgainstQualifyConfig): JsonAgainstQualifyConfig {
        return {
            id: config.getId(),
            competitionSport: this.competitionSportMapper.toJson(config.getCompetitionSport()),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            losePointsExt: config.getLosePointsExt(),
            pointsCalculation: config.getPointsCalculation()
        };
    }
}
