import { Team } from '../team';
import { Season } from '../season';
import { SportCache } from '../cache';
import { Injectable } from '@angular/core';

@Injectable()
export class SeasonMapper {
    constructor() {}

    toObject(json: JsonSeason, season?: Season): Season {
        if (season === undefined && json.id !== undefined) {
            season = SportCache.seasons[json.id];
        }
        if (season === undefined) {
            season = new Season(json.name);
            season.setId(json.id);
            SportCache.seasons[season.getId()] = season;
        }
        season.setStartDateTime(new Date(json.startDateTime));
        season.setEndDateTime(new Date(json.endDateTime));
        return season;
    }

    toJson(season: Season): JsonSeason {
        return {
            id: season.getId(),
            name: season.getName(),
            startDateTime: season.getStartDateTime().toISOString(),
            endDateTime: season.getEndDateTime().toISOString()
        };
    }
}

export interface JsonSeason {
    id?: number;
    name: string;
    startDateTime: string;
    endDateTime: string;
}
