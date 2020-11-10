import { Injectable } from '@angular/core';

import { Season } from '../season';
import { JsonSeason } from './json';
@Injectable({
    providedIn: 'root'
})
export class SeasonMapper {
    protected cache: SeasonMap = {};

    constructor() { }

    toObject(json: JsonSeason, disableCache?: boolean): Season {
        let season;
        if (disableCache !== true) {
            season = this.cache[json.id];
        }
        if (season === undefined) {
            season = new Season(json.name, new Date(json.start), new Date(json.end));
            season.setId(json.id);
            this.cache[season.getId()] = season;
        }
        this.updateObject(json, season);
        return season;
    }

    updateObject(json: JsonSeason, season: Season) {
        season.setStartDateTime(new Date(json.start));
        season.setEndDateTime(new Date(json.end));
    }

    toJson(season: Season): JsonSeason {
        return {
            id: season.getId(),
            name: season.getName(),
            start: season.getStartDateTime().toISOString(),
            end: season.getEndDateTime().toISOString()
        };
    }
}

interface SeasonMap {
    [key: string]: Season;
}
