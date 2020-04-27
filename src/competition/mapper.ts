import { Injectable } from '@angular/core';

import { Competition } from '../competition';

import { LeagueMapper } from '../league/mapper';
import { SeasonMapper } from '../season/mapper';
import { SportMapper } from '../sport/mapper';
import { RefereeMapper } from '../referee/mapper';
import { SportConfigMapper } from '../sport/config/mapper';
import { FieldMapper } from '../field/mapper';
import { JsonCompetition } from './json';

@Injectable()
export class CompetitionMapper {

    constructor(
        private leagueMapper: LeagueMapper,
        private seasonMapper: SeasonMapper,
        private sportMapper: SportMapper,
        private refereeMapper: RefereeMapper,
        private fieldMapper: FieldMapper,
        private sportConfigMapper: SportConfigMapper
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
        json.sportConfigs.forEach(jsonSportConfig => this.sportConfigMapper.toObject(jsonSportConfig, competition));
        return competition;
    }

    toJson(competition: Competition): JsonCompetition {
        return {
            league: this.leagueMapper.toJson(competition.getLeague()),
            season: this.seasonMapper.toJson(competition.getSeason()),
            sportConfigs: competition.getSportConfigs().map(sport => this.sportConfigMapper.toJson(sport)),
            fields: competition.getFields().map(field => this.fieldMapper.toJson(field)),
            referees: competition.getReferees().map(referee => this.refereeMapper.toJson(referee)),
            ruleSet: competition.getRuleSet(),
            startDateTime: competition.getStartDateTime().toISOString(),
            state: competition.getState()
        };
    }
}
