import { CompetitionSport } from "../competition/sport";
import { Place } from "../place";
import { PlacePerformance } from "./performance";

export class PlaceSportPerformance extends PlacePerformance {
    constructor(place: Place, private competitionSport: CompetitionSport, penaltyPoints?: number) {
        super(place);
        if (penaltyPoints !== undefined) {
            this.addPoints(-penaltyPoints);
        }
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }
}
