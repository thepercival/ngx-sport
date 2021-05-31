import { JsonCompetitionSport } from "../../competition/sport/json";
import { JsonIdentifiable } from "../../identifiable/json";

export interface JsonAgainstQualifyConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    losePointsExt: number;
    pointsCalculation: number;
}