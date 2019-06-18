import { Injectable } from '@angular/core';

import { Association } from '../association';
import { TheCache } from '../cache';
import { Competitor } from '../competitor';

@Injectable()
export class CompetitorMapper {
    constructor() { }

    toObject(json: JsonCompetitor, association: Association, competitor?: Competitor): Competitor {
        if (competitor === undefined && json.id !== undefined) {
            competitor = TheCache.competitors[json.id];
        }
        if (competitor === undefined) {
            competitor = new Competitor(association, json.name);
            competitor.setId(json.id);
            TheCache.competitors[competitor.getId()] = competitor;
        }
        competitor.setAbbreviation(json.abbreviation);
        competitor.setRegistered(json.registered),
            competitor.setInfo(json.info);
        competitor.setImageUrl(json.imageUrl);
        return competitor;
    }

    toJson(competitor: Competitor): JsonCompetitor {
        return {
            id: competitor.getId(),
            name: competitor.getName(),
            abbreviation: competitor.getAbbreviation(),
            registered: competitor.getRegistered(),
            info: competitor.getInfo(),
            imageUrl: competitor.getImageUrl()
        };
    }
}

export interface JsonCompetitor {
    id?: number;
    name?: string;
    abbreviation?: string;
    registered?: boolean;
    info?: string;
    imageUrl?: string;
}
