import { SportConfigSupplier } from './config/supplier';
import { SportConfigScore } from './config/score';
import { Sport } from '../sport';

export class SportConfig {

    static readonly POINTS_CALC_GAMEPOINTS = 0;
    static readonly POINTS_CALC_SCOREPOINTS = 1;
    static readonly POINTS_CALC_BOTH = 2;

    protected id: number;
    protected qualifyRule: number;
    protected winPoints: number;
    protected drawPoints: number;
    protected winPointsExt: number;
    protected drawPointsExt: number;
    protected score: SportConfigScore;
    protected pointsCalculation: number;

    constructor(protected sport: Sport, protected supplier: SportConfigSupplier ) {
        this.supplier.setSportConfig(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getQualifyRule(): number {
        return this.qualifyRule;
    }

    setQualifyRule(qualifyRule: number) {
        this.qualifyRule = qualifyRule;
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

    getScore(): SportConfigScore {
        return this.score;
    }

    setScore(score: SportConfigScore) {
        this.score = score;
    }

    getInputScore(): SportConfigScore {
        let parentScoreConfig: SportConfigScore = this.getScore().getRoot();
        let childScoreConfig = parentScoreConfig.getChild();
        while (childScoreConfig !== undefined && (childScoreConfig.getMaximum() > 0 || parentScoreConfig.getMaximum() === 0)) {
            parentScoreConfig = childScoreConfig;
            childScoreConfig = childScoreConfig.getChild();
        }
        return parentScoreConfig;
    }

    getCalculateScore(): SportConfigScore {
        let scoreConfig: SportConfigScore = this.getScore().getRoot();
        while (scoreConfig.getMaximum() === 0 && scoreConfig.getChild() !== undefined) {
            scoreConfig = scoreConfig.getChild();
        }
        return scoreConfig;
    }

    hasMultipleScores(): boolean {
        return this.getScore().getRoot() !== this.getScore();
    }

    getSport(): Sport {
        return this.sport;
    }

    getSupplier(): SportConfigSupplier {
        return this.supplier;
    }
}
