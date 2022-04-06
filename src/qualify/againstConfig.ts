import { Round } from './group';
import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { PointsCalculation } from '../ranking/pointsCalculation';
import { Sport } from '../sport';

export class AgainstQualifyConfig extends Identifiable {
    constructor(
        protected competitionSport: CompetitionSport,
        protected round: Round,
        protected pointsCalculation: PointsCalculation,
        protected winPoints: number,
        protected drawPoints: number,
        protected winPointsExt: number,
        protected drawPointsExt: number,
        protected losePointsExt: number) {
        super();
        round.getAgainstQualifyConfigs().push(this);
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getSport(): Sport {
        return this.competitionSport.getSport();
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

    getPointsCalculation(): PointsCalculation {
        return this.pointsCalculation;
    }
}

