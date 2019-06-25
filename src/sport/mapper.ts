import { Sport } from '../sport';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class SportMapper {
    constructor() {}

    toObject(json: JsonSport, sport?: Sport): Sport {
        if (sport === undefined) {
            sport = TheCache.sports[json.id];
        }
        if (sport === undefined) {
            sport = new Sport(json.name);
            sport.setId(json.id);
            TheCache.sports[sport.getId()] = sport;
        }
        // sport.setScoreUnitName(json.scoreUnitName);
        // sport.setScoreSubUnitName(json.scoreSubUnitName);
        sport.setTeam(json.team),
        sport.setCustomId(json.customId);
        return sport;
    }

    toJson(sport: Sport): JsonSport {
        return {
            id: sport.getId(),
            name: sport.getName(),
            // scoreUnitName: sport.getScoreUnitName(),
            // scoreSubUnitName: sport.getScoreSubUnitName(),
            team: sport.getTeam(),
            customId: sport.getCustomId()
        };
    }
}

export interface JsonSport {
    id?: number;
    name: string;
    // scoreUnitName: string;
    // scoreSubUnitName?: string;
    team: boolean;
    customId: number;
}
