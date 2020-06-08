import { PlaceLocation } from '../place/location';
import { Place } from '../place';
import { Round } from '../round';

export class RankedRoundItem {
    constructor(private unranked: UnrankedRoundItem, private uniqueRank: number, private rank: number
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getPlaceLocation(): PlaceLocation {
        return this.unranked.getPlaceLocation();
    }

    getUnranked(): UnrankedRoundItem {
        return this.unranked;
    }

    getPlace(): Place {
        return this.unranked.getRound().getPlace(this.unranked.getPlaceLocation());
    }
}

export class UnrankedRoundItem {
    private games = 0;
    private points = 0;
    private scored = 0;
    private received = 0;
    private subScored = 0;
    private subReceived = 0;

    constructor(private round: Round, private placeLocation: PlaceLocation, penaltyPoints?: number) {
        if (penaltyPoints !== undefined) {
            this.addPoints(-penaltyPoints);
        }
    }

    getRound(): Round {
        return this.round;
    }

    getPlaceLocation(): PlaceLocation {
        return this.placeLocation;
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

export class EndRankingItem {
    constructor(private uniqueRank: number, private rank: number, private name: string) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    getName(): string {
        return this.name;
    }
}