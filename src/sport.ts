import { Identifiable } from "./identifiable";
import { GameMode } from "./planning/gameMode";
import { PointsCalculation } from "./ranking/pointsCalculation";
import { CustomSport } from "./sport/custom";

export class Sport extends Identifiable {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    protected customId: CustomSport | 0 = 0;

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

    getCustomId(): CustomSport | 0 {
        return this.customId;
    }

    setCustomId(id: CustomSport | 0): void {
        this.customId = id;
    }

    hasNextDefaultScoreConfig(): boolean {
        if (
            this.customId === CustomSport.Badminton
            || this.customId === CustomSport.Darts
            || this.customId === CustomSport.Squash
            || this.customId === CustomSport.TableTennis
            || this.customId === CustomSport.Tennis
            || this.customId === CustomSport.Volleyball
            || this.customId === CustomSport.Padel
        ) {
            return true;
        }
        return false;
    }

    getDefaultWinPoints(): number {
        if (this.customId === CustomSport.Rugby) {
            return 4;
        }
        if (this.customId === CustomSport.Chess) {
            return 1;
        }
        return 3;
    }

    getDefaultDrawPoints(): number {
        if (this.customId === CustomSport.Rugby) {
            return 2;
        }
        if (this.customId === CustomSport.Chess) {
            return 0.5;
        }
        return 1;
    }

    getDefaultWinPointsExt(): number {
        if (this.customId === CustomSport.Chess) {
            return 1;
        }
        return 2;
    }

    getDefaultDrawPointsExt(): number {
        if (this.customId === CustomSport.Chess) {
            return 0.5;
        }
        return 1;
    }

    getDefaultLosePointsExt(): number {
        if (this.customId === CustomSport.IceHockey) {
            return 1;
        }
        return 0;
    }
}
