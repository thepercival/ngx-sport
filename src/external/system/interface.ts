/**
 * Created by coen on 11-2-17.
 */
import { Observable } from 'rxjs/Observable';

import { Association } from './../../association';
import { League } from './../../league';
import { Season } from './../../season';


export interface ExternalSystemAssociation {
    getAssociations(): Association[];
}

export interface ExternalSystemLeagueInterface {
    getLeagues(appLeagues: League[]): Observable<League[]>;
}

export interface ExternalSystemSeasonInterface {
    getSeasons(): Season[];
}
