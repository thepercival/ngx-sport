import { PlaceLocation } from '../place/location';
import { Round } from '../round';

export class RankingItem {
    private uniqueRank: number;
    private rank: number;

    constructor(
    ) {
    }

    getUniqueRank(): number {
        return this.uniqueRank;
    }

    setUniqueRank(uniqueRank: number) {
        this.uniqueRank = uniqueRank;
    }

    getRank(): number {
        return this.rank;
    }

    setRank(rank: number) {
        this.rank = rank;
    }
}

export class EndRankingItem extends RankingItem {
    constructor(uniqueRank: number, rank: number, private name: string) {
        super();
        this.setUniqueRank(uniqueRank);
        this.setRank(rank);
    }

    getName(): string {
        return this.name;
    }
}

export class RoundRankingItem extends RankingItem {
    private games: number = 0;
    private points: number = 0;
    private scored: number = 0;
    private received: number = 0;
    private subReceived: number = 0;
    private subScored: number = 0;

    constructor(private round: Round, private placeLocation: PlaceLocation, penaltyPoints?: number) {
        super();
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
