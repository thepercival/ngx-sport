import { JsonFormationLine } from './line/json';

export interface JsonFormation {
    name: string;
    lines: JsonFormationLine[];
}