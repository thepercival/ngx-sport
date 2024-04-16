import { PlaceLocation } from "../place/location";
import { QualifyPathNode } from "../qualify/pathNode";

export class StructureLocation {
    
    constructor(
        private categoryNr: number,
        private pathNode: QualifyPathNode,
        private placeLocation: PlaceLocation) { }

    getCategoryNr(): number {
        return this.categoryNr
    }

    getPathNode(): QualifyPathNode {
        return this.pathNode
    }

    getPlaceLocation(): PlaceLocation {
        return this.placeLocation
    }

    toString(): string {
        return this.categoryNr + '.' + 
            this.pathNode.pathToString() + '.' + 
            this.placeLocation.getRoundLocationId();
    }
}