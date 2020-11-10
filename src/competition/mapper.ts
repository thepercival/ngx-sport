import { Injectable } from '@angular/core';

import { Competition } from '../competition';

import { LeagueMapper } from '../league/mapper';
import { SeasonMapper } from '../season/mapper';
import { SportMapper } from '../sport/mapper';
import { RefereeMapper } from '../referee/mapper';
import { SportConfigMapper } from '../sport/config/mapper';
import { FieldMapper } from '../field/mapper';
import { JsonCompetition } from './json';

@Injectable({
    providedIn: 'root'
})
export class CompetitionMapper {

    constructor(
        private leagueMapper: LeagueMapper,
        private seasonMapper: SeasonMapper,
        private refereeMapper: RefereeMapper,
        private sportConfigMapper: SportConfigMapper
    ) { }

    toObject(json: JsonCompetition, disableCache?: boolean): Competition {
        const league = this.leagueMapper.toObject(json.league, disableCache);
        const season = this.seasonMapper.toObject(json.season, disableCache);
        const competition = new Competition(league, season, new Date(json.startDateTime));

        competition.setId(json.id);
        this.updateObject(json, competition);

        json.referees.map(jsonReferee => this.refereeMapper.toObject(jsonReferee, competition));
        json.sportConfigs.forEach(jsonSportConfig => this.sportConfigMapper.toObject(jsonSportConfig, competition));
        return competition;
    }

    updateObject(json: JsonCompetition, competition: Competition) {
        competition.setRuleSet(json.ruleSet);
        competition.setState(json.state);
    }

    toJson(competition: Competition): JsonCompetition {
        return {
            id: competition.getId(),
            league: this.leagueMapper.toJson(competition.getLeague()),
            season: this.seasonMapper.toJson(competition.getSeason()),
            sportConfigs: competition.getSportConfigs().map(sport => this.sportConfigMapper.toJson(sport)),
            referees: competition.getReferees().map(referee => this.refereeMapper.toJson(referee)),
            ruleSet: competition.getRuleSet(),
            startDateTime: competition.getStartDateTime().toISOString(),
            state: competition.getState()
        };
    }
}
