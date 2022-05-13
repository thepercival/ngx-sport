import { CompetitionSport } from "../competition/sport";
import { Place } from "../place";
import { PlacePerformance } from "./performance";

export class PlaceSportPerformance extends PlacePerformance {
    constructor(place: Place, private competitionSport: CompetitionSport, extraPoints?: number) {
        super(place);
        if (extraPoints !== undefined) {
            this.addPoints(extraPoints);
        }
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }
}
