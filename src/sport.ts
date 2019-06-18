import { ConfigScore } from './config/count/score';
import { CountConfig } from './config/count';

export class Sport {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;

    protected id: number;
    protected name: string;
    protected scoreUnitName: string;
    protected scoreSubUnitName: string;
    protected teamup: boolean;
    protected customId: number;

    constructor(name: string) {
        this.setName(name);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getScoreUnitName(): string {
        return this.scoreUnitName;
    }

    setScoreUnitName(name: string): void {
        this.scoreUnitName = name;
    }

    getScoreSubUnitName(): string {
        return this.scoreSubUnitName;
    }

    setScoreSubUnitName(name: string): void {
        this.scoreSubUnitName = name;
    }

    hasScoreSubUnitName(): boolean {
        return this.scoreSubUnitName === undefined;
    }

    createScoreConfig(config: CountConfig): ConfigScore {

        const unitScoreConfig = new ConfigScore(config, undefined);
        unitScoreConfig.setName(this.getScoreUnitName());
        unitScoreConfig.setDirection(ConfigScore.UPWARDS);
        unitScoreConfig.setMaximum(0);

        if ( this.hasScoreSubUnitName() ) {
            const subUnitScoreConfig = new ConfigScore(config, unitScoreConfig);
            subUnitScoreConfig.setName(this.getScoreSubUnitName());
            subUnitScoreConfig.setDirection(ConfigScore.UPWARDS);
            subUnitScoreConfig.setMaximum(0);
        }
        return unitScoreConfig;
    }

    getTeamup(): boolean {
        return this.teamup;
    }

    setTeamup(teamup: boolean): void {
        this.teamup = teamup;
    }

    getCustomId(): number {
        return this.customId;
    }

    setCustomId(id: number): void {
        this.customId = id;
    }
}
