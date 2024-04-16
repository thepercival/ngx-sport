import { Injectable } from '@angular/core';

import { JsonStructureLocation } from './json';
import { StructureLocation } from '../location';
import { PlaceLocation } from '../../place/location';
import { QualifyPathNodeMapper } from '../../qualify/pathNode/mapper';

@Injectable({
    providedIn: 'root'
})
export class StructureLocationMapper {
    constructor(private qualifyNodeMapper: QualifyPathNodeMapper) { }

    toObject(json: JsonStructureLocation): StructureLocation {
        return new StructureLocation(
            json.categoryNr,
            this.qualifyNodeMapper.toObject(json.pathNode),
            new PlaceLocation(json.placeLocation.pouleNr, json.placeLocation.placeNr)
        );
    }

    toJson(structureLocation: StructureLocation): JsonStructureLocation {
        const placeLocation = structureLocation.getPlaceLocation(); 
        return {
            categoryNr: structureLocation.getCategoryNr(),
            pathNode: structureLocation.getPathNode().pathToString(),
            placeLocation: {
                pouleNr: placeLocation.getPouleNr(), placeNr: placeLocation.getPlaceNr() }
        };
    }
}