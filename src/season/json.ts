import { JsonPeriod } from '../period/json';

export interface JsonSeason extends JsonPeriod {
    id: string | number;
    name: string;
}
