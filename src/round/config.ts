import { Round } from '../round';
import { RoundConfigScore } from './config/score';

export class RoundConfig {
    static readonly DEFAULTNROFHEADTOHEADMATCHES = 1;
    static readonly DEFAULTWINPOINTS = 3;
    static readonly DEFAULTDRAWPOINTS = 1;
    static readonly DEFAULTHASEXTENSION = false;
    static readonly DEFAULTENABLETIME = false;

    protected id: number;
    protected round: Round;
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
    protected score: RoundConfigScore;

    // constructor
    constructor(round: Round) {
        this.setRound(round);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getRound(): Round {
        return this.round;
    }

    private setRound(round: Round) {
        this.round = round;
        if (round !== undefined) {
            round.setConfig(this);
        }
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

    getScore(): RoundConfigScore {
        return this.score;
    }

    setScore(score: RoundConfigScore) {
        this.score = score;
    }

    getInputScore(): RoundConfigScore {
        let parentScoreConfig: RoundConfigScore = this.getScore().getRoot();
        let childScoreConfig = parentScoreConfig.getChild();
        while (childScoreConfig !== undefined && (childScoreConfig.getMaximum() > 0 || parentScoreConfig.getMaximum() === 0)) {
            parentScoreConfig = childScoreConfig;
            childScoreConfig = childScoreConfig.getChild();
        }
        return parentScoreConfig;
    }

    getCalculateScore(): RoundConfigScore {
        let scoreConfig: RoundConfigScore = this.getScore().getRoot();
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
}

