/**
 * Created by coen on 11-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Competition } from './../../competition';
import { Team } from './../../team';
import { ExternalSystemSoccerOddsRepository } from './soccerodds/repository';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { ExternalSystemRepository } from './repository';

export class ExternalSystemSoccerOdds extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerOddsRepository;
    protected competitions: Competition[];

    // constructor
    constructor( name: string, http: HttpClient, externalSystemRepository: ExternalSystemRepository )
    {
        super(name);
        this.repos = new ExternalSystemSoccerOddsRepository( http, this, externalSystemRepository );
    }

    getExportableClasses(): any[]
    {
        return [
            { "name": 'Competition', "source": false },
            { "name": 'Team', "source": false }
        ];
    }


    getCompetitions(): Observable<Competition[]>
    {
        return this.repos.getCompetitions()
    }
}
