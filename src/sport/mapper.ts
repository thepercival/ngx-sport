import { Sport } from '../sport';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class SportMapper {
    constructor() {}

    toObject(json: JsonSport, sport?: Sport): Sport {
        if (sport === undefined && json.id !== undefined) {
            sport = TheCache.sports[json.id];
        }
        if (sport === undefined) {
            sport = new Sport(json.name);
            sport.setId(json.id);
            TheCache.sports[sport.getId()] = sport;
        }
        sport.setScoreUnitName(json.scoreUnitName);
        sport.setScoreSubUnitName(json.scoreSubUnitName);
        return sport;
    }

    toJson(sport: Sport): JsonSport {
        return {
            id: sport.getId(),
            name: sport.getName(),
            scoreUnitName: sport.getScoreUnitName(),
            scoreSubUnitName: sport.getScoreSubUnitName(),
        };
    }
}

export interface JsonSport {
    id?: number;
    name: string;
    scoreUnitName: string;
    scoreSubUnitName?: string;
}
