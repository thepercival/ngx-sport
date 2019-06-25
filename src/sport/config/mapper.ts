import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportConfig } from '../config';
import { JsonSport, SportMapper } from '../mapper';

@Injectable()
export class SportConfigMapper {
    constructor(private sportMapper: SportMapper) { }

    toObject(json: JsonSportConfig, competition: Competition, config?: SportConfig): SportConfig {
        if (config === undefined) {
            config = new SportConfig( this.sportMapper.toObject(json.sport), competition);
        }
        config.setId(json.id);
        config.setWinPoints(json.winPoints);
        config.setDrawPoints(json.drawPoints);
        config.setWinPointsExt(json.winPointsExt);
        config.setDrawPointsExt(json.drawPointsExt);
        config.setPointsCalculation(json.pointsCalculation);
        config.setNrOfGameCompetitors(json.nrOfGameCompetitors);
        return config;
    }

    toJson(config: SportConfig): JsonSportConfig {
        return {
            id: config.getId(),
            sport: this.sportMapper.toJson(config.getSport()),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            pointsCalculation: config.getPointsCalculation(),
            nrOfGameCompetitors: config.getNrOfGameCompetitors()
        };
    }
}

export interface JsonSportConfig {
    id?: number;
    sport: JsonSport;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    pointsCalculation: number;
    nrOfGameCompetitors: number;
}
