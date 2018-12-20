import { Observable } from 'rxjs';

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
