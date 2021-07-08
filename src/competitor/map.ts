import { PlaceLocation } from "../place/location";
import { Competitor } from "../competitor";

export class CompetitorMap extends Map<string, Competitor> {

    constructor(competitors: Competitor[]) {
        super();
        competitors.forEach(competitor => {
            this.set(competitor.getRoundLocationId(), competitor);
        });
    }

    public getCompetitor(placeLocation: PlaceLocation): Competitor | undefined {
        return this.get(placeLocation.getRoundLocationId());
    }
}