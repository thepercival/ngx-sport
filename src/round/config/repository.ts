/**
 * Created by coen on 3-3-17.
 */
import { QualifyRule } from '../../qualifyrule';
import { Round } from '../../round';
import { RoundConfig } from '../config';


export class RoundConfigRepository {

    constructor() {

    }

    jsonArrayToObject(jsonArray: IRoundConfig[], round: Round): RoundConfig[] {
        const objects: RoundConfig[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, round);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IRoundConfig, round: Round): RoundConfig {
        const roundConfig = new RoundConfig(round);
        roundConfig.setId(json.id);
        roundConfig.setNrOfHeadtoheadMatches(json.nrOfHeadtoheadMatches);
        roundConfig.setQualifyRule(json.qualifyRule);
        roundConfig.setWinPoints(json.winPoints);
        roundConfig.setDrawPoints(json.drawPoints);
        roundConfig.setHasExtension(json.hasExtension);
        roundConfig.setWinPointsExt(json.winPointsExt);
        roundConfig.setDrawPointsExt(json.drawPointsExt);
        roundConfig.setMinutesPerGameExt(json.minutesPerGameExt);
        roundConfig.setEnableTime(json.enableTime);
        roundConfig.setMinutesPerGame(json.minutesPerGame);
        roundConfig.setMinutesInBetween(json.minutesInBetween);
        return roundConfig;
    }

    objectsToJsonArray(objects: RoundConfig[]): IRoundConfig[] {
        const jsonArray: IRoundConfig[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: RoundConfig): IRoundConfig {
        return {
            id: object.getId(),
            nrOfHeadtoheadMatches: object.getNrOfHeadtoheadMatches(),
            qualifyRule: object.getQualifyRule(),
            winPoints: object.getWinPoints(),
            drawPoints: object.getDrawPoints(),
            hasExtension: object.getHasExtension(),
            winPointsExt: object.getWinPointsExt(),
            drawPointsExt: object.getDrawPointsExt(),
            minutesPerGameExt: object.getMinutesPerGameExt(),
            enableTime: object.getEnableTime(),
            minutesPerGame: object.getMinutesPerGame(),
            minutesInBetween: object.getMinutesInBetween()
        };
    }

    createObjectFromParent(round: Round): RoundConfig {
        const roundConfig = new RoundConfig(round);
        if (round.getParentRound() !== undefined) {
            const parentConfig = round.getParentRound().getConfig();
            roundConfig.setQualifyRule(parentConfig.getQualifyRule());
            roundConfig.setNrOfHeadtoheadMatches(parentConfig.getNrOfHeadtoheadMatches());
            roundConfig.setWinPoints(parentConfig.getWinPoints());
            roundConfig.setDrawPoints(parentConfig.getDrawPoints());
            roundConfig.setHasExtension(parentConfig.getHasExtension());
            roundConfig.setWinPointsExt(parentConfig.getWinPointsExt());
            roundConfig.setDrawPointsExt(parentConfig.getDrawPointsExt());
            roundConfig.setMinutesPerGameExt(parentConfig.getMinutesPerGameExt());
            roundConfig.setEnableTime(parentConfig.getEnableTime());
            roundConfig.setMinutesPerGame(parentConfig.getMinutesPerGame());
            roundConfig.setMinutesInBetween(parentConfig.getMinutesInBetween());
            return roundConfig;
        }

        roundConfig.setQualifyRule(QualifyRule.SOCCERWORLDCUP);
        roundConfig.setNrOfHeadtoheadMatches(RoundConfig.DEFAULTNROFHEADTOHEADMATCHES);
        roundConfig.setWinPoints(RoundConfig.DEFAULTWINPOINTS);
        roundConfig.setDrawPoints(RoundConfig.DEFAULTDRAWPOINTS);
        roundConfig.setHasExtension(RoundConfig.DEFAULTHASEXTENSION);
        roundConfig.setWinPointsExt(roundConfig.getWinPoints() - 1);
        roundConfig.setDrawPointsExt(roundConfig.getDrawPoints());
        roundConfig.setMinutesPerGameExt(0);
        roundConfig.setEnableTime(RoundConfig.DEFAULTENABLETIME);
        roundConfig.setMinutesPerGame(0);
        roundConfig.setMinutesInBetween(0);
        if (round.getCompetitionseason().getSport() === 'voetbal') {
            roundConfig.setHasExtension(!round.needsRanking());
            roundConfig.setMinutesPerGameExt(5);
            roundConfig.setEnableTime(true);
            roundConfig.setMinutesPerGame(20);
            roundConfig.setMinutesInBetween(5);
        }
        return roundConfig;
    }
}

export interface IRoundConfig {
    id?: number;
    nrOfHeadtoheadMatches: number;
    qualifyRule: number;
    winPoints: number;
    drawPoints: number;
    hasExtension: boolean;
    winPointsExt: number;
    drawPointsExt: number;
    minutesPerGameExt: number;
    enableTime: boolean;
    minutesPerGame: number;
    minutesInBetween: number;
}
