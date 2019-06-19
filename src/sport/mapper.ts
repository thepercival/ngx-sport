import { Sport } from '../sport';
import { TheCache } from '../cache';
import { Injectable } from '@angular/core';
import { JsonCountConfig, CountConfigMapper } from '../config/count/mapper';

@Injectable()
export class SportMapper {
    constructor( private countConfigMapper: CountConfigMapper ) {}

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
        sport.setCustomId(json.customId);
        sport.setCountConfig(this.countConfigMapper.toObject(json.countConfig, sport));
        return sport;
    }

    toJson(sport: Sport): JsonSport {
        return {
            id: sport.getId(),
            name: sport.getName(),
            scoreUnitName: sport.getScoreUnitName(),
            scoreSubUnitName: sport.getScoreSubUnitName(),
            customId: sport.getCustomId(),
            countConfig: this.countConfigMapper.toJson(sport.getCountConfig()),
        };
    }
}

export interface JsonSport {
    id?: number;
    name: string;
    scoreUnitName: string;
    scoreSubUnitName?: string;
    customId: number;
    countConfig: JsonCountConfig;
}
