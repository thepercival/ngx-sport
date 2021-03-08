import { PlaceLocation } from "../place/location";
import { Competitor } from "../competitor";

export class CompetitorMap extends Map<string, Competitor> {

    constructor(competitors: Competitor[]) {
        super();
        competitors.forEach(competitor => {
            this.set(this.getPlaceLocationId(competitor), competitor);
        });
    }

    protected getPlaceLocationId(placeLocation: PlaceLocation): string {
        return placeLocation.getPouleNr() + '.' + placeLocation.getPlaceNr();
    }

    public getCompetitor(placeLocation: PlaceLocation): Competitor | undefined {
        return this.get(this.getPlaceLocationId(placeLocation));
    }
}