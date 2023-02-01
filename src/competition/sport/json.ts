import { JsonSport } from "../../sport/json";
import { JsonField } from "../../field/json";
import { JsonIdentifiable } from "../../identifiable/json";
import { JsonPersistSportVariant } from "../../sport/variant/json";
import { PointsCalculation } from "../../ranking/pointsCalculation";

export interface JsonCompetitionSport extends JsonIdentifiable, JsonPersistSportVariant {
    defaultPointsCalculation: PointsCalculation;
    defaultWinPoints: number,
    defaultDrawPoints: number,
    defaultWinPointsExt: number,
    defaultDrawPointsExt: number,
    defaultLosePointsExt: number,
    sport: JsonSport;
    fields: JsonField[];
}