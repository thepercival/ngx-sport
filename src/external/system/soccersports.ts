/**
 * Created by coen on 17-2-17.
 */

import { ExternalSystemCompetitionInterface } from './interface';
import { ExternalSystem } from './../system';
import { Association } from './../../association';
import { Competition } from './../../competition';
import { Season } from './../../season';
import { Competitionseason } from './../../competitionseason';
import { Round } from '../../round';
import { Team } from './../../team';
import { ExternalSystemSoccerSportsRepository } from './soccersports/repository';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { ExternalSystemRepository } from './repository';

export class ExternalSystemSoccerSports extends ExternalSystem implements ExternalSystemCompetitionInterface{
    protected website: string;
    protected repos: ExternalSystemSoccerSportsRepository;
    // protected associations: Association[];
    // protected competitions: Competition[];
    // protected seasons: Season[];
    // protected competitionseasons: Competitionseason[];

    // constructor
    constructor( name: string, http: HttpClient, externalSystemRepository: ExternalSystemRepository )
    {
        super(name);

        this.repos = new ExternalSystemSoccerSportsRepository( http, this, externalSystemRepository );
    }

    getExportableClasses(): any[]
    {
        return [
            { "name": 'Association', "source": true },
            { "name": 'Competition', "source": true },
            { "name": 'Season', "source": true },
            { "name": 'Competitionseason', "source": true },
            { "name": 'Team', "source": true },
            { "name": 'Round', "source": true }
        ];
    }

    getAssociations(): Observable<Association[]>
    {
        return this.repos.getAssociations()
    }

    getCompetitions(): Observable<Competition[]>
    {
        return this.repos.getCompetitions()
    }

    getSeasons(): Observable<Season[]>
    {
        return this.repos.getSeasons()
    }

    getCompetitionseasons(): Observable<Competitionseason[]>
    {
        return this.repos.getCompetitionseasons()
    }

    getTeams( competitionseason: Competitionseason ): Observable<Team[]>
    {
        return this.repos.getTeams( competitionseason );
    }

    getStructure( competitionseason: Competitionseason ): Observable<Round[]>
    {
        return this.repos.getStructure( competitionseason );
    }
}
