import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportConfig } from '../config';
import { JsonSport, SportMapper } from '../mapper';
import { TheCache } from '../../cache';

@Injectable()
export class SportConfigMapper {
    constructor(private sportMapper: SportMapper) { }

    toObject(json: JsonSportConfig, competition: Competition, config?: SportConfig): SportConfig {
        if (config === undefined) {
            config = new SportConfig(TheCache.sports[json.sportId], competition);
        }
        config.setId(json.id);
        config.setWinPoints(json.winPoints);
        config.setDrawPoints(json.drawPoints);
        config.setWinPointsExt(json.winPointsExt);
        config.setDrawPointsExt(json.drawPointsExt);
        config.setPointsCalculation(json.pointsCalculation);
        config.setNrOfGamePlaces(json.nrOfGamePlaces);
        return config;
    }

    toJson(config: SportConfig): JsonSportConfig {
        return {
            id: config.getId(),
            sportId: config.getSport().getId(),
            winPoints: config.getWinPoints(),
            drawPoints: config.getDrawPoints(),
            winPointsExt: config.getWinPointsExt(),
            drawPointsExt: config.getDrawPointsExt(),
            pointsCalculation: config.getPointsCalculation(),
            nrOfGamePlaces: config.getNrOfGamePlaces()
        };
    }
}

export interface JsonSportConfig {
    id?: number;
    sportId: string | number;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    pointsCalculation: number;
    nrOfGamePlaces: number;
}
