import { Injectable } from '@angular/core';

import { TheCache } from '../cache';
import { Season } from '../season';
import { JsonSeason } from './json';

@Injectable({
    providedIn: 'root'
})
export class SeasonMapper {
    constructor() { }

    toObject(json: JsonSeason, season?: Season): Season {
        if (season === undefined && json.id !== undefined) {
            season = TheCache.seasons[json.id];
        }
        if (season === undefined) {
            season = new Season(json.name);
            season.setId(json.id);
            TheCache.seasons[season.getId()] = season;
        }
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
        return season;
    }

    toJson(season: Season): JsonSeason {
        return {
            name: season.getName(),
            startDateTime: season.getStartDateTime().toISOString(),
            endDateTime: season.getEndDateTime().toISOString()
        };
    }
}
