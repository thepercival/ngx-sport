import { PlaceLocation } from "../location";
import { Competitor } from "../../competitor";

export class PlaceLocationMap {
    private map: CompetitorMap = {};

    constructor(competitors: Competitor[]) {
        competitors.forEach(competitor => {
            this.map[this.getPlaceLocationId(competitor)] = competitor;
        });
    }

    protected getPlaceLocationId(placeLocation: PlaceLocation): string {
        return placeLocation.getPouleNr() + '.' + placeLocation.getPlaceNr();
    }

    public getCompetitor(placeLocation: PlaceLocation): Competitor | undefined {
        return this.map[this.getPlaceLocationId(placeLocation)];
    }
}

interface CompetitorMap {
    [key: string]: Competitor;
}