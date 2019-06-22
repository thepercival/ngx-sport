import { Injectable } from '@angular/core';

import { Competition } from '../competition';
import { FieldMapper, JsonField } from '../field/mapper';
import { JsonLeague, LeagueMapper } from '../league/mapper';
import { JsonReferee, RefereeMapper } from '../referee/mapper';
import { JsonSeason, SeasonMapper } from '../season/mapper';
import { JsonSport, SportMapper } from '../sport/mapper';

@Injectable()
export class CompetitionMapper {

    constructor(
        private leagueMapper: LeagueMapper,
        private seasonMapper: SeasonMapper,
        private refereeMapper: RefereeMapper,
        private fieldMapper: FieldMapper,
        private sportMapper: SportMapper
    ) { }

    toObject(json: JsonCompetition, competition?: Competition): Competition {
        if (competition === undefined) {
            const league = this.leagueMapper.toObject(json.league);
            const season = this.seasonMapper.toObject(json.season);
            competition = new Competition(league, season);
        }
        competition.setId(json.id);
        competition.setRuleSet(json.ruleSet);
        competition.setState(json.state);
        competition.setStartDateTime(new Date(json.startDateTime));
        json.sports.map(jsonSport => this.sportMapper.toObject(jsonSport));
        json.fields.map(jsonField => this.fieldMapper.toObject(jsonField, competition));
        json.referees.map(jsonReferee => this.refereeMapper.toObject(jsonReferee, competition));
        json.sports.map(jsonSport => this.sportMapper.toObject(jsonSport));
        return competition;
    }

    toJson(competition: Competition): JsonCompetition {
        return {
            id: competition.getId(),
            league: this.leagueMapper.toJson(competition.getLeague()),
            season: this.seasonMapper.toJson(competition.getSeason()),
            sports: competition.getSports().map(sport => this.sportMapper.toJson(sport)),
            fields: competition.getFields().map(field => this.fieldMapper.toJson(field)),
            referees: competition.getReferees().map(referee => this.refereeMapper.toJson(referee)),
            ruleSet: competition.getRuleSet(),
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
    ruleSet: number;
    startDateTime: string;
    state: number;
    sports: JsonSport[];
}
