/**
 * Created by coen on 11-2-17.
 */
import { Observable } from 'rxjs/Observable';

import { Association } from './../../association';
import { Competition } from './../../competition';
import { Season } from './../../season';


export interface ExternalSystemAssociation {
    getAssociations(): Association[];
}

export interface ExternalSystemCompetitionInterface {
    getCompetitions(appCompetitions: Competition[]): Observable<Competition[]>;
}

export interface ExternalSystemSeasonInterface {
    getSeasons(): Season[];
}
