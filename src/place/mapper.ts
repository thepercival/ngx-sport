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
        place.setExtraPoints(json.extraPoints);
        if (json.qualifiedPlaceLocation) {
            const qualifiedPlaceLocation = new PlaceLocation(json.qualifiedPlaceLocation.pouleNr, json.qualifiedPlaceLocation.placeNr);
            place.setQualifiedPlace(
                poule.getRound().getParentQualifyGroup()?.getParentRound().getPlace(qualifiedPlaceLocation)
            );
        }
        return place;
    }

    toLocation(jsonPlaceLocation: JsonPlaceLocation): PlaceLocation {
        return new PlaceLocation(jsonPlaceLocation.pouleNr, jsonPlaceLocation.placeNr);
    }

    toJson(place: Place): JsonPlace {
        return {
            id: place.getId(),
            pouleNr: place.getPouleNr(),
            placeNr: place.getPlaceNr(),
            extraPoints: place.getExtraPoints(),
            qualifiedPlaceLocation: undefined
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
