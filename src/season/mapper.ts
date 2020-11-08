import { Injectable } from '@angular/core';

import { Season } from '../season';
import { JsonSeason } from './json';
import { TheCache } from '../cache';

@Injectable({
    providedIn: 'root'
})
export class SeasonMapper {
    constructor() { }

    toObject(json: JsonSeason, disableCache?: boolean): Season {
        let season;
        if (disableCache !== true) {
            season = TheCache.seasons[json.id];
        }
        if (season === undefined) {
            season = new Season(json.name, new Date(json.startDateTime), new Date(json.endDateTime));
            season.setId(json.id);
            TheCache.seasons[season.getId()] = season;
        }
        this.updateObject(json, season);
        return season;
    }

    updateObject(json: JsonSeason, season: Season) {
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
    }

    toJson(season: Season): JsonSeason {
        return {
            name: season.getName(),
            startDateTime: season.getStartDateTime().toISOString(),
            endDateTime: season.getEndDateTime().toISOString()
        };
    }
}
