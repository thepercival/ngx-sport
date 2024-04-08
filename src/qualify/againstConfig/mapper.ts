import { Injectable } from '@angular/core';

import { JsonAgainstQualifyConfig } from './json';
import { Round } from '../group';
import { AgainstQualifyConfig } from '../againstConfig';

@Injectable({
    providedIn: 'root'
})
export class AgainstQualifyConfigMapper {
    constructor() { }

    toObject(json: JsonAgainstQualifyConfig, round: Round, againstQualifyConfig?: AgainstQualifyConfig): AgainstQualifyConfig {
        if (againstQualifyConfig === undefined) {
            const competitionSport = round.getCompetition().getSportById(json.competitionSportId);
            if (competitionSport === undefined) {
                throw new Error('competitionSport could not be found');
            }
            againstQualifyConfig = new AgainstQualifyConfig(
                competitionSport,
                round,
                json.pointsCalculation,
                json.winPoints,
                json.drawPoints,
                json.winPointsExt,
                json.drawPointsExt,
                json.losePointsExt);
        } else {
            againstQualifyConfig.setWinPoints(json.winPoints);
            againstQualifyConfig.setDrawPoints(json.drawPoints);
            againstQualifyConfig.setWinPointsExt(json.winPointsExt);
            againstQualifyConfig.setDrawPointsExt(json.drawPointsExt);
            againstQualifyConfig.setLosePointsExt(json.losePointsExt);
        }
        againstQualifyConfig.setId(json.id);

        return againstQualifyConfig;
    }

    toJson(config: AgainstQualifyConfig): JsonAgainstQualifyConfig {
        return {
            id: config.getId(),
            competitionSportId: config.getCompetitionSport().getId(),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            losePointsExt: config.getLosePointsExt(),
            pointsCalculation: config.getPointsCalculation()
        };
    }
}
