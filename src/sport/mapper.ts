import { Sport } from '../sport';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class SportMapper {
    constructor() {}

    toObject(json: JsonSport, sport?: Sport): Sport {
        if (sport === undefined) {
            sport = TheCache.sports[json.name];
        }
        if (sport === undefined) {
            sport = new Sport(json.name);
            sport.setId(json.id);
            TheCache.sports[sport.getName()] = sport;
        }
        sport.setScoreUnitName(json.scoreUnitName);
        sport.setScoreSubUnitName(json.scoreSubUnitName);
        sport.setNrOfGameCompetitors(json.nrOfGameCompetitors),
        sport.setCustomId(json.customId);
        return sport;
    }

    toJson(sport: Sport): JsonSport {
        return {
            id: sport.getId(),
            name: sport.getName(),
            scoreUnitName: sport.getScoreUnitName(),
            scoreSubUnitName: sport.getScoreSubUnitName(),
            nrOfGameCompetitors: sport.getNrOfGameCompetitors(),
            customId: sport.getCustomId()
        };
    }
}

export interface JsonSport {
    id?: number;
    name: string;
    scoreUnitName: string;
    scoreSubUnitName?: string;
    nrOfGameCompetitors: number;
    customId: number;
}
