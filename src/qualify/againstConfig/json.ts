import { JsonIdentifiable } from "../../identifiable/json";
import { PointsCalculation } from "../../ranking/pointsCalculation";

export interface JsonAgainstQualifyConfig extends JsonIdentifiable {
    competitionSportId: string|number;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    losePointsExt: number;
    pointsCalculation: PointsCalculation;
}