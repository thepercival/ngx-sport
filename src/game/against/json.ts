
import { JsonAgainstScore } from '../../score/against/json';
import { JsonGame } from '../json';
import { JsonAgainstGamePlace } from '../place/against/json';

export interface JsonAgainstGame extends JsonGame {
    gameRoundNumber: number;
    places: JsonAgainstGamePlace[];
    scores: JsonAgainstScore[];
    homeExtraPoints: number;
    awayExtraPoints: number;
}
