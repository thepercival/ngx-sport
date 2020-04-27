import { Season } from '../season';

export interface JsonSeason {
    id?: string | number;
    name: string;
    startDateTime: string;
    endDateTime: string;
}
