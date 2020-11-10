import { JsonPlaceLocation } from '../place/location/json';

export interface JsonCompetitor extends JsonPlaceLocation {
    name: string;
    id: string | number;
    registered?: boolean;
    info?: string;
}