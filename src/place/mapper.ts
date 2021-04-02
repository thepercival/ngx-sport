import { Injectable } from '@angular/core';

import { Poule } from '../poule';
import { Place } from '../place';
import { JsonPlace } from './json';
import { JsonPlaceLocation } from './location/json';
import { PlaceLocation } from './location';

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
        if (json.qualifiedPlaceLocation) {
            place.setQualifiedPlace(
                poule.getRound().getParentQualifyGroup()?.getParentRound().getPlace(this.toLocation(json.qualifiedPlaceLocation))
            );
        }
        return place;
    }

    toLocation(jsonPlaceLocation: JsonPlaceLocation): PlaceLocation {
        return new PlaceLocation(jsonPlaceLocation.pouleNr, jsonPlaceLocation.placeNr);
    }

    toJson(place: Place): JsonPlace {
        const qualifiedPlace: Place | undefined = place.getQualifiedPlace();
        return {
            id: place.getId(),
            number: place.getNumber(),
            penaltyPoints: place.getPenaltyPoints(),
            qualifiedPlaceLocation: qualifiedPlace ? this.toJsonLocation(qualifiedPlace) : undefined
        };
    }

    toJsonLocation(place: Place): JsonPlaceLocation {
        return {
            placeNr: place.getNumber(),
            pouleNr: place.getPoule().getNumber()
        };
    }
}

export interface PlaceMap {
    [key: string]: Place;
}
