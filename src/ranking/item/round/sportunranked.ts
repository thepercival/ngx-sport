import { CompetitionSport } from "../../../competition/sport";
import { Place } from "../../../place";
import { PlaceLocation } from "../../../place/location";

export class UnrankedSportRoundItem {
    private games = 0;
    private points = 0;
    private scored = 0;
    private received = 0;
    private subScored = 0;
    private subReceived = 0;

    constructor(private competitionSport: CompetitionSport, private place: Place, penaltyPoints?: number) {
        if (penaltyPoints !== undefined) {
            this.addPoints(-penaltyPoints);
        }
    }

    getPlace(): Place {
        return this.place;
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getPlaceLocation(): PlaceLocation {
        return this.place;
    }

    getGames(): number {
        return this.games;
    }

    addGame() {
        this.games++;
    }

    getPoints(): number {
        return this.points;
    }

    addPoints(points: number) {
        this.points += points;
    }

    getScored(): number {
        return this.scored;
    }

    addScored(scored: number) {
        this.scored += scored;
    }

    getReceived(): number {
        return this.received;
    }

    addReceived(received: number) {
        this.received += received;
    }

    getDiff(): number {
        return this.getScored() - this.getReceived();
    }

    getSubScored(): number {
        return this.subScored;
    }

    addSubScored(subScored: number) {
        this.subScored += subScored;
    }

    getSubReceived(): number {
        return this.subReceived;
    }

    addSubReceived(subReceived: number) {
        this.subReceived += subReceived;
    }

    getSubDiff(): number {
        return this.getSubScored() - this.getSubReceived();
    }
}
