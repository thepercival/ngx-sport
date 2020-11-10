import { Competition } from '../competition';
import { Sport } from '../sport';
import { Game } from '../game';
import { Field } from '../field';

export class SportConfig {
    static readonly Default_WinPoints = 3;
    static readonly Default_DrawPoints = 1;
    static readonly Default_WinPointsExt = 2;
    static readonly Default_DrawPointsExt = 1;
    static readonly Default_LosePointsExt = 0;

    static readonly Points_Calc_GamePoints = 0;
    static readonly Points_Calc_ScorePoints = 1;
    static readonly Points_Calc_Both = 2;

    static readonly Default_NrOfGamePlaces = 2;

    protected id: number = 0;
    protected winPoints: number = SportConfig.Default_WinPoints;
    protected drawPoints: number = SportConfig.Default_DrawPoints;
    protected winPointsExt: number = SportConfig.Default_WinPointsExt;
    protected drawPointsExt: number = SportConfig.Default_DrawPointsExt;
    protected losePointsExt: number = SportConfig.Default_LosePointsExt;
    protected pointsCalculation: number = SportConfig.Points_Calc_GamePoints;
    protected nrOfGamePlaces: number = SportConfig.Default_NrOfGamePlaces;
    protected fields: Field[] = [];

    constructor(protected sport: Sport, protected competition: Competition) {
        this.competition.getSportConfigs().push(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getWinPoints(): number {
        return this.winPoints;
    }

    setWinPoints(winPoints: number) {
        this.winPoints = winPoints;
    }

    getDrawPoints(): number {
        return this.drawPoints;
    }

    setDrawPoints(drawPoints: number) {
        this.drawPoints = drawPoints;
    }

    getWinPointsExt(): number {
        return this.winPointsExt;
    }

    setWinPointsExt(winPointsExt: number) {
        this.winPointsExt = winPointsExt;
    }

    getDrawPointsExt(): number {
        return this.drawPointsExt;
    }

    setDrawPointsExt(drawPointsExt: number) {
        this.drawPointsExt = drawPointsExt;
    }

    getLosePointsExt(): number {
        return this.losePointsExt;
    }

    setLosePointsExt(losePointsExt: number) {
        this.losePointsExt = losePointsExt;
    }

    getPointsCalculation(): number {
        return this.pointsCalculation;
    }

    setPointsCalculation(pointsCalculation: number) {
        this.pointsCalculation = pointsCalculation;
    }

    getNrOfGamePlaces(): number {
        return this.nrOfGamePlaces;
    }

    setNrOfGamePlaces(nrOfGamePlaces: number): void {
        this.nrOfGamePlaces = nrOfGamePlaces;
    }

    getSport(): Sport {
        return this.sport;
    }

    setSport(sport: Sport) {
        this.sport = sport;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getFields(): Field[] {
        return this.fields;
    }

    getField(priority: number): Field | undefined {
        return this.fields.find(fieldIt => priority === fieldIt.getPriority());
    }
}
