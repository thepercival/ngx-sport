import { JsonPerson } from '../../person/json';
import { JsonPeriod } from '../../period/json';
import { JsonTeam } from "../json";

export interface JsonPlayer extends JsonPeriod {
    id: string | number;
    team: JsonTeam;
    line: number;
    person?: JsonPerson;
    marketValue: number;
}
