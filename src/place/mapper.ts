import { Injectable } from '@angular/core';

import { CompetitorMapper } from '../competitor/mapper';
import { Poule } from '../poule';
import { Place } from '../place';
import { JsonPlace } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlaceMapper {
    constructor(private competitorMapper: CompetitorMapper) {
    }

    toObject(json: JsonPlace, poule: Poule, place?: Place): Place {
        if (place === undefined) {
            place = new Place(poule, json.number);
        }
        place.setId(json.id);
        // poule.setName(json.name);
        let competitor;
        if (json.competitor) {
            competitor = this.competitorMapper.toObject(json.competitor, poule.getCompetition().getLeague().getAssociation());
        }
        place.setCompetitor(competitor);
        place.setPenaltyPoints(json.penaltyPoints);
        return place;
    }

    toJson(place: Place): JsonPlace {
        return {
            id: place.getId(),
            number: place.getNumber(),
            name: place.getName(),
            competitor: place.getCompetitor() ? this.competitorMapper.toJson(place.getCompetitor()) : undefined,
            penaltyPoints: place.getPenaltyPoints()
        };
    }
}
