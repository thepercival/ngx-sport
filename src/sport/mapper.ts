import { Injectable } from '@angular/core';

import { Sport } from '../sport';
import { JsonSport } from './json';

@Injectable({
    providedIn: 'root'
})
export class SportMapper {
    constructor() { }

    toObject(json: JsonSport, sport?: Sport): Sport {
        if (sport === undefined) {
            sport = new Sport(json.name);
            sport.setId(json.id);
        }
        // sport.setScoreUnitName(json.scoreUnitName);
        // sport.setScoreSubUnitName(json.scoreSubUnitName);
        sport.setTeam(json.team);
        sport.setCustomId(json.customId);
        return sport;
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
