
import { JsonAgainstScore } from 'src/score/against/json';
import { JsonGame } from '../json';
import { JsonAgainstGamePlace } from '../place/against/json';

export interface JsonAgainstGame extends JsonGame {
    places: JsonAgainstGamePlace[];
    scores: JsonAgainstScore[];
}
