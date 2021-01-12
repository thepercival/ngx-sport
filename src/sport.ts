import { Identifiable } from "./identifiable";

export class Sport extends Identifiable {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    protected customId: number | undefined;

    constructor(
        protected name: string,
        protected team: boolean,
        protected gameMode: number,
        protected nrOfGamePlaces: number) {
        super();
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getTeam(): boolean {
        return this.team;
    }

    // setTeam(team: boolean): void {
    //     this.team = team;
    // }

    getGameMode(): number {
        return this.gameMode;
    }

    // setGameMode(gameMode: number): void {
    //     this.gameMode = gameMode;
    // }

    getNrOfGamePlaces(): number {
        return this.nrOfGamePlaces;
    }

    getCustomId(): number | undefined {
        return this.customId;
    }

    setCustomId(id: number): void {
        this.customId = id;
    }
}
