import { JsonSport } from "../json";

export interface JsonSportConfig {
    id?: number;
    sport: JsonSport;
    winPoints: number;
    drawPoints: number;
    winPointsExt: number;
    drawPointsExt: number;
    losePointsExt: number;
    pointsCalculation: number;
    nrOfGamePlaces: number;
}