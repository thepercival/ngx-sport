import { Competition } from '../competition';
import { Sport } from '../sport';
import { Game } from '../game';
import { Field } from '../field';

export class SportConfig {

    static readonly POINTS_CALC_GAMEPOINTS = 0;
    static readonly POINTS_CALC_SCOREPOINTS = 1;
    static readonly POINTS_CALC_BOTH = 2;
    static readonly DEFAULT_NROFGAMEPLACES = 2;

    protected id: number;
    protected winPoints: number;
    protected drawPoints: number;
    protected winPointsExt: number;
    protected drawPointsExt: number;
    protected losePointsExt: number;
    protected pointsCalculation: number;
    protected nrOfGamePlaces: number;
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

    getField(priority: number): Field {
        return this.fields.find(fieldIt => priority === fieldIt.getPriority());
    }
}
