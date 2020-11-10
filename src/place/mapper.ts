import { Injectable } from '@angular/core';

import { Poule } from '../poule';
import { Place } from '../place';
import { JsonPlace } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlaceMapper {
    constructor() {
    }

    toObject(json: JsonPlace, poule: Poule, place?: Place): Place {
        if (place === undefined) {
            place = new Place(poule, json.number);
        }
        place.setId(json.id);
        place.setPenaltyPoints(json.penaltyPoints);
        return place;
    }

    toJson(place: Place): JsonPlace {
        return {
            id: place.getId(),
            number: place.getNumber(),
            penaltyPoints: place.getPenaltyPoints()
        };
    }
}
