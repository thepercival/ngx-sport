import { JsonCompetitionSport } from "../../competition/sport/json";
import { JsonIdentifiable } from "../../identifiable/json";
import { PointsCalculation } from "../../ranking/pointsCalculation";

export interface JsonAgainstQualifyConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    losePointsExt: number;
    pointsCalculation: PointsCalculation;
}