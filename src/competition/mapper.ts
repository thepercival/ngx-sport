import { Competition } from '../competition';
import { JsonField, FieldMapper } from '../field/mapper';
import { JsonReferee, RefereeMapper } from '../referee/mapper';
import { JsonSeason, SeasonMapper } from '../season/mapper';
import { JsonLeague, LeagueMapper } from '../league/mapper';
import { Injectable } from '@angular/core';

@Injectable()
export class CompetitionMapper {

    constructor(
        private leagueMapper: LeagueMapper,
        private seasonMapper: SeasonMapper,
        private refereeMapper: RefereeMapper,
        private fieldMapper: FieldMapper
    ) {}

    toObject(json: JsonCompetition, competition?: Competition): Competition {
        if (competition === undefined) {
            const league = this.leagueMapper.toObject(json.league);
            const season = this.seasonMapper.toObject(json.season);
            competition = new Competition(league, season);
        }
        competition.setId(json.id);
        competition.setState(json.state);
        competition.setStartDateTime(new Date(json.startDateTime));
        json.fields.map( jsonField => this.fieldMapper.toObject(jsonField, competition) );
        json.referees.map( jsonReferee => this.refereeMapper.toObject(jsonReferee, competition) );
        return competition;
    }

    toJson(competition: Competition): JsonCompetition {
        return {
            id: competition.getId(),
            league: this.leagueMapper.toJson(competition.getLeague()),
            season: this.seasonMapper.toJson(competition.getSeason()),
            fields: competition.getFields().map( field => this.fieldMapper.toJson(field)),
            referees: competition.getReferees().map( referee => this.refereeMapper.toJson(referee)),
            startDateTime: competition.getStartDateTime().toISOString(),
            state: competition.getState()
        };
    }
}

export interface JsonCompetition {
    id?: number;
    league: JsonLeague;
    season: JsonSeason;
    fields: JsonField[];
    referees: JsonReferee[];
    startDateTime: string;
    state: number;
}