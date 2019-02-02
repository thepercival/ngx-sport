import { RoundNumber } from '../number';
import { RoundNumberConfigScore } from './config/score';

export class RoundNumberConfig {

    static readonly DEFAULTNROFHEADTOHEADMATCHES = 1;
    static readonly DEFAULTWINPOINTS = 3;
    static readonly DEFAULTDRAWPOINTS = 1;
    static readonly DEFAULTHASEXTENSION = false;
    static readonly DEFAULTENABLETIME = false;
    static readonly POINTS_CALC_GAMEPOINTS = 0;
    static readonly POINTS_CALC_SCOREPOINTS = 1;
    static readonly POINTS_CALC_BOTH = 2;

    protected id: number;
    protected nrOfHeadtoheadMatches: number;
    protected qualifyRule: number;
    protected winPoints: number;
    protected drawPoints: number;
    protected hasExtension: boolean;
    protected winPointsExt: number;
    protected drawPointsExt: number;
    protected minutesPerGameExt: number;
    protected enableTime: boolean;
    protected minutesPerGame: number;
    protected minutesBetweenGames: number;
    protected minutesAfter: number;
    protected score: RoundNumberConfigScore;
    protected teamup: boolean;
    protected pointsCalculation: number;

    constructor(protected roundNumber: RoundNumber) {
        this.roundNumber.setConfig(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getNrOfHeadtoheadMatches(): number {
        return this.nrOfHeadtoheadMatches;
    }

    setNrOfHeadtoheadMatches(nrOfHeadtoheadMatches: number) {
        this.nrOfHeadtoheadMatches = nrOfHeadtoheadMatches;
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

    getHasExtension(): boolean {
        return this.hasExtension;
    }

    setHasExtension(hasExtension: boolean) {
        this.hasExtension = hasExtension;
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

    getMinutesPerGameExt(): number {
        return this.minutesPerGameExt;
    }

    setMinutesPerGameExt(minutesPerGameExt: number) {
        this.minutesPerGameExt = minutesPerGameExt;
    }

    getEnableTime(): boolean {
        return this.enableTime;
    }

    setEnableTime(enableTime: boolean) {
        this.enableTime = enableTime;
    }

    getMinutesPerGame(): number {
        return this.minutesPerGame;
    }

    setMinutesPerGame(minutesPerGame: number) {
        this.minutesPerGame = minutesPerGame;
    }

    getMinutesBetweenGames(): number {
        return this.minutesBetweenGames;
    }

    setMinutesBetweenGames(minutesBetweenGames: number) {
        this.minutesBetweenGames = minutesBetweenGames;
    }

    getMinutesAfter(): number {
        return this.minutesAfter;
    }

    setMinutesAfter(minutesAfter: number) {
        this.minutesAfter = minutesAfter;
    }

    getTeamup(): boolean {
        return this.teamup;
    }

    setTeamup(teamup: boolean) {
        this.teamup = teamup;
    }

    getPointsCalculation(): number {
        return this.pointsCalculation;
    }

    setPointsCalculation(pointsCalculation: number) {
        this.pointsCalculation = pointsCalculation;
    }

    getScore(): RoundNumberConfigScore {
        return this.score;
    }

    setScore(score: RoundNumberConfigScore) {
        this.score = score;
    }

    getInputScore(): RoundNumberConfigScore {
        let parentScoreConfig: RoundNumberConfigScore = this.getScore().getRoot();
        let childScoreConfig = parentScoreConfig.getChild();
        while (childScoreConfig !== undefined && (childScoreConfig.getMaximum() > 0 || parentScoreConfig.getMaximum() === 0)) {
            parentScoreConfig = childScoreConfig;
            childScoreConfig = childScoreConfig.getChild();
        }
        return parentScoreConfig;
    }

    getCalculateScore(): RoundNumberConfigScore {
        let scoreConfig: RoundNumberConfigScore = this.getScore().getRoot();
        while (scoreConfig.getMaximum() === 0 && scoreConfig.getChild() !== undefined) {
            scoreConfig = scoreConfig.getChild();
        }
        return scoreConfig;
    }

    hasMultipleScores(): boolean {
        return this.getScore().getRoot() !== this.getScore();
    }

    getMaximalNrOfMinutesPerGame(): number {
        let nrOfMinutes = this.getMinutesPerGame();
        if (this.getHasExtension()) {
            nrOfMinutes += this.getMinutesPerGameExt();
        }
        return nrOfMinutes;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}

