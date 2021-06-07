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
            place = new Place(poule, json.placeNr);
        }
        place.setId(json.id);
        place.setPenaltyPoints(json.penaltyPoints);
        if (json.qualifiedPlace) {
            place.setQualifiedPlace(
                poule.getRound().getParentQualifyGroup()?.getParentRound().getPlace(this.toLocation(json.qualifiedPlace))
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
            pouleNr: place.getPouleNr(),
            placeNr: place.getPlaceNr(),
            penaltyPoints: place.getPenaltyPoints(),
            qualifiedPlace: qualifiedPlace ? this.toJson(qualifiedPlace) : undefined
        };
    }

    toJsonLocation(place: Place): JsonPlaceLocation {
        return {
            placeNr: place.getPlaceNr(),
            pouleNr: place.getPoule().getNumber()
        };
    }
}

export interface PlaceMap {
    [key: string]: Place;
}
