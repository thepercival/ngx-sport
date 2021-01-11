
import { JsonGame } from '../json';
import { JsonTogetherGamePlace } from '../place/together/json';

export interface JsonTogetherGame extends JsonGame {
    places: JsonTogetherGamePlace[];
}
