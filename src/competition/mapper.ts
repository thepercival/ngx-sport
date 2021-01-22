import { Injectable } from '@angular/core';

import { Competition } from '../competition';

import { LeagueMapper } from '../league/mapper';
import { SeasonMapper } from '../season/mapper';
import { SportMapper } from '../sport/mapper';
import { RefereeMapper } from '../referee/mapper';
import { CompetitionSportMapper } from './sport/mapper';
import { JsonCompetition } from './json';
import { TeamCompetitorMapper } from '../competitor/team/mapper';

@Injectable({
    providedIn: 'root'
})
export class CompetitionMapper {

    constructor(
        private leagueMapper: LeagueMapper,
        private seasonMapper: SeasonMapper,
        private refereeMapper: RefereeMapper,
        private competitionSportMapper: CompetitionSportMapper,
        private teamCompetitorMapper: TeamCompetitorMapper
    ) { }

    toObject(json: JsonCompetition, disableCache?: boolean): Competition {
        const league = this.leagueMapper.toObject(json.league, disableCache);
        const season = this.seasonMapper.toObject(json.season, disableCache);
        const competition = new Competition(league, season);
        competition.setStartDateTime(new Date(json.startDateTime));

        competition.setId(json.id);
        this.updateObject(json, competition);

        json.referees.map(jsonReferee => this.refereeMapper.toObject(jsonReferee, competition));
        json.sports.forEach(jsonSport => this.competitionSportMapper.toObject(jsonSport, competition, true));
        if (json.teamCompetitors) {
            json.teamCompetitors.forEach(jsonteamCompetitor => this.teamCompetitorMapper.toObject(jsonteamCompetitor, competition));
        };
        return competition;
    }

    updateObject(json: JsonCompetition, competition: Competition) {
        competition.setState(json.state);
    }

    toJson(competition: Competition): JsonCompetition {
        return {
            id: competition.getId(),
            league: this.leagueMapper.toJson(competition.getLeague()),
            season: this.seasonMapper.toJson(competition.getSeason()),
            rankingRuleSet: competition.getRankingRuleSet(),
            sports: competition.getSports().map(sport => this.competitionSportMapper.toJson(sport)),
            referees: competition.getReferees().map(referee => this.refereeMapper.toJson(referee)),
            startDateTime: competition.getStartDateTime().toISOString(),
            state: competition.getState()
        };
    }
}
