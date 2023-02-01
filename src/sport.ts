import { Identifiable } from "./identifiable";
import { GameMode } from "./planning/gameMode";

export class Sport extends Identifiable {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    protected customId: number = 0;

    constructor(
        protected name: string,
        protected team: boolean,
        protected defaultGameMode: GameMode,
        protected defaultNrOfSidePlaces: number
    ) {
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

    getDefaultGameMode(): GameMode {
        return this.defaultGameMode;
    }

    getDefaultNrOfSidePlaces(): number {
        return this.defaultNrOfSidePlaces;
    }

    getCustomId(): number {
        return this.customId;
    }

    setCustomId(id: number): void {
        this.customId = id;
    }
}
