export class RankingItem {
    private uniqueRank: number;
    private rank: number;

    // constructor(
    //     private uniqueRank: number,
    //     private rank: number,
    //     private poulePlace?: PoulePlace
    // ) {
    // }

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

    // getPoulePlace(): PoulePlace {
    //     return this.poulePlace;
    // }

    // getPoulePlaceForRank(): PoulePlace {
    //     return this.poulePlace.getPoule().getPlace(this.getUniqueRank());
    // }

    // isSpecified(): boolean {
    //     return this.poulePlace !== undefined;
    // }

    private games: number = 0;
    private points: number = 0;
    private scored: number = 0;
    private received: number = 0;
    private subReceived: number = 0;
    private subScored: number = 0;

    constructor(private pouleNumber: number, private placeNumber: number, penaltyPoints?: number) {
        if (penaltyPoints !== undefined) {
            this.addPoints(-penaltyPoints);
        }
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
}
