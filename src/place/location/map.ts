import { PlaceLocation } from "../location";
import { Competitor } from "../../competitor";

export class PlaceLocationMap {
    private map = {};

    constructor(competitors: Competitor[]) {
        competitors.forEach(competitor => {
            this.map[this.getPlaceLocationId(competitor)] = competitor;
        });
    }

    protected getPlaceLocationId(placeLocation: PlaceLocation): string {
        return placeLocation.getPouleNr() + '.' + placeLocation.getPlaceNr();
    }

    public getCompetitor(placeLocation: PlaceLocation): Competitor {
        return this.map[this.getPlaceLocationId(placeLocation)];
    }
}