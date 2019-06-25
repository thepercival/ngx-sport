import { Competition } from '../competition';
import { Sport } from '../sport';

export class SportConfig {

    static readonly POINTS_CALC_GAMEPOINTS = 0;
    static readonly POINTS_CALC_SCOREPOINTS = 1;
    static readonly POINTS_CALC_BOTH = 2;
    static readonly DEFAULT_NROFGAMECOMPETITORS = 2;

    protected id: number;
    protected winPoints: number;
    protected drawPoints: number;
    protected winPointsExt: number;
    protected drawPointsExt: number;
    protected pointsCalculation: number;
    protected nrOfGameCompetitors: number;

    constructor(protected sport: Sport, protected competition: Competition ) {
        this.competition.setSportConfig(this);
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

    getPointsCalculation(): number {
        return this.pointsCalculation;
    }

    setPointsCalculation(pointsCalculation: number) {
        this.pointsCalculation = pointsCalculation;
    }

    getNrOfGameCompetitors(): number {
        return this.nrOfGameCompetitors;
    }

    setNrOfGameCompetitors(nrOfGameCompetitors: number): void {
        this.nrOfGameCompetitors = nrOfGameCompetitors;
    }

    getSport(): Sport {
        return this.sport;
    }

    getCompetition(): Competition {
        return this.competition;
    }
}
