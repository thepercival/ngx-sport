import { Round } from './group';
import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';

export class QualifyAgainstConfig extends Identifiable {
    static readonly Default_WinPoints = 3;
    static readonly Default_DrawPoints = 1;
    static readonly Default_WinPointsExt = 2;
    static readonly Default_DrawPointsExt = 1;
    static readonly Default_LosePointsExt = 0;

    static readonly Points_Calc_GamePoints = 0;
    static readonly Points_Calc_ScorePoints = 1;
    static readonly Points_Calc_Both = 2;

    protected winPoints: number = QualifyAgainstConfig.Default_WinPoints;
    protected drawPoints: number = QualifyAgainstConfig.Default_DrawPoints;
    protected winPointsExt: number = QualifyAgainstConfig.Default_WinPointsExt;
    protected drawPointsExt: number = QualifyAgainstConfig.Default_DrawPointsExt;
    protected losePointsExt: number = QualifyAgainstConfig.Default_LosePointsExt;
    protected pointsCalculation: number = QualifyAgainstConfig.Points_Calc_GamePoints;


    constructor(protected competitionSport: CompetitionSport, protected round: Round) {
        super();
        round.getQualifyAgainstConfigs().push(this);
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getRound(): Round {
        return this.round;
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
}

