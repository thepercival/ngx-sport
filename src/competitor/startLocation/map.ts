import { Competitor } from "../../competitor";
import { StartLocation } from "../startLocation";

export class StartLocationMap extends Map<string, Competitor> {

    constructor(competitors: Competitor[]) {
        super();
        competitors.forEach(competitor => {
            this.set(competitor.getStartLocation().getStartId(), competitor);
        });
    }

    public getCompetitor(startLocation: StartLocation): Competitor | undefined {
        return this.get(startLocation.getStartId());
    }
}