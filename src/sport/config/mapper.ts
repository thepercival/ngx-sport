import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportConfig } from '../config';
import { SportMapper } from '../mapper';
import { JsonSportConfig } from './json';

@Injectable()
export class SportConfigMapper {
    constructor(private sportMapper: SportMapper) { }

    toObject(json: JsonSportConfig, competition: Competition, config?: SportConfig): SportConfig {
        if (config === undefined) {
            const sport = this.sportMapper.toObject(json.sport);
            config = new SportConfig(sport, competition);
        }
        config.setId(json.id);
        config.setWinPoints(json.winPoints);
        config.setDrawPoints(json.drawPoints);
        config.setWinPointsExt(json.winPointsExt);
        config.setDrawPointsExt(json.drawPointsExt);
        config.setLosePointsExt(json.losePointsExt);
        config.setPointsCalculation(json.pointsCalculation);
        config.setNrOfGamePlaces(json.nrOfGamePlaces);
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
            losePointsExt: config.getLosePointsExt(),
            pointsCalculation: config.getPointsCalculation(),
            nrOfGamePlaces: config.getNrOfGamePlaces()
        };
    }
}
