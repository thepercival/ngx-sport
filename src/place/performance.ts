import { Place } from "../place";
import { PlaceLocation } from "./location";
import { PlaceSportPerformance } from "./sportPerformance";

export class PlacePerformance {
    private games = 0;
    private points = 0;
    private scored = 0;
    private received = 0;
    private subScored = 0;
    private subReceived = 0;

    constructor(private place: Place) {
    }

    getPlace(): Place {
        return this.place;
    }

    getPlaceLocation(): PlaceLocation {
        return this.place;
    }

    getGames(): number {
        return this.games;
    }

    addGames(games: number) {
        this.games += games;
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

    addSportPerformace(sportPerformance: PlaceSportPerformance) {
        this.addGames(sportPerformance.getGames());
        this.addPoints(sportPerformance.getPoints());
        this.addScored(sportPerformance.getScored());
        this.addReceived(sportPerformance.getReceived());
        this.addSubScored(sportPerformance.getSubScored());
        this.addSubReceived(sportPerformance.getSubReceived());
    }
}
