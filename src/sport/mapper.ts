import { Injectable } from '@angular/core';

import { Sport } from '../sport';
import { JsonSport } from './json';
import { TheCache } from '../cache';

@Injectable({
    providedIn: 'root'
})
export class SportMapper {
    constructor() { }

    toObject(json: JsonSport, disableCache?: boolean): Sport {
        let sport;
        if (disableCache !== true) {
            sport = TheCache.sports[json.name];
        }
        if (sport === undefined) {
            sport = new Sport(json.name);
            sport.setId(json.id);
            TheCache.sports[sport.getName()] = sport;
        }
        this.updateObject(json, sport);
        return sport;
    }

    updateObject(json: JsonSport, sport: Sport) {
        // sport.setScoreUnitName(json.scoreUnitName);
        // sport.setScoreSubUnitName(json.scoreSubUnitName);
        sport.setTeam(json.team);
        sport.setCustomId(json.customId);
    }

    toJson(sport: Sport): JsonSport {
        return {
            name: sport.getName(),
            // scoreUnitName: sport.getScoreUnitName(),
            // scoreSubUnitName: sport.getScoreSubUnitName(),
            team: sport.getTeam(),
            customId: sport.getCustomId()
        };
    }
}
