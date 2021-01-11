import { Injectable } from '@angular/core';

import { Sport } from '../sport';
import { JsonSport } from './json';

@Injectable({
    providedIn: 'root'
})
export class SportMapper {
    protected cache: SportMap = {};

    constructor() { }

    toObject(json: JsonSport, disableCache?: boolean): Sport {
        let sport;
        if (disableCache !== true) {
            sport = this.cache[json.name];
        }
        if (sport === undefined) {
            sport = new Sport(json.name, json.team, json.gameMode, json.nrOfGamePlaces);
            sport.setId(json.id);
            this.cache[sport.getName()] = sport;
        }
        this.updateObject(json, sport);
        return sport;
    }

    updateObject(json: JsonSport, sport: Sport) {
        // sport.setTeam(json.team);
        if (json.customId) {
            sport.setCustomId(json.customId);
        }
    }

    toJson(sport: Sport): JsonSport {
        return {
            id: sport.getId(),
            name: sport.getName(),
            team: sport.getTeam(),
            gameMode: sport.getGameMode(),
            nrOfGamePlaces: sport.getNrOfGamePlaces(),
            customId: sport.getCustomId()
        };
    }
}

interface SportMap {
    [key: string]: Sport;
}