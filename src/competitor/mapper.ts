import { Injectable } from '@angular/core';

import { Association } from '../association';
import { Competitor } from '../competitor';
import { JsonCompetitor } from './json';
import { TheCache } from '../cache';
import { Competition } from '../competition';

@Injectable({
    providedIn: 'root'
})
export class CompetitorMapper {
    constructor() { }

    toObject(json: JsonCompetitor, association: Association, disableCache?: boolean): Competitor {
        let competitor;
        if (disableCache !== true) {
            competitor = TheCache.competitors[json.id];
        }
        if (competitor === undefined) {
            competitor = new Competitor(association, json.name);
            competitor.setId(json.id);
            TheCache.competitors[competitor.getId()] = competitor;
        }
        this.updateObject(json, competitor);
        return competitor;
    }

    updateObject(json: JsonCompetitor, competitor: Competitor) {
        competitor.setName(json.name);
        competitor.setAbbreviation(json.abbreviation);
        competitor.setRegistered(json.registered);
        competitor.setInfo(json.info);
        competitor.setImageUrl(json.imageUrl);
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
