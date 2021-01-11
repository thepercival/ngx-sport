import { JsonCompetitionSport } from "src/competition/sport/json";
import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonQualifyAgainstConfig extends JsonIdentifiable {
    competitionSport: JsonCompetitionSport;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    losePointsExt: number;
    pointsCalculation: number;
}