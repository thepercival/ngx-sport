import { AssociationMapper, CompetitionMapper, CompetitionSportMapper, FieldMapper, GameMapper, GamePlaceMapper, LeagueMapper, PlanningMapper, RefereeMapper, ScoreMapper, SeasonMapper, SportMapper, TeamCompetitorMapper, TeamMapper } from "../../public_api";


export function getCompetitionMapper(): CompetitionMapper {
    return new CompetitionMapper(
        getLeagueMapper(),
        new SeasonMapper(),
        new RefereeMapper(),
        getCompetitionSportMapper(),
        getTeamCompetitorMapper()
    );
}

export function getLeagueMapper(): LeagueMapper {
    return new LeagueMapper(new AssociationMapper());
}

export function getCompetitionSportMapper(): CompetitionSportMapper {
    return new CompetitionSportMapper(new SportMapper(), new FieldMapper());
}

export function getTeamCompetitorMapper(): TeamCompetitorMapper {
    return new TeamCompetitorMapper(new TeamMapper());
}

export function getPlanningMapper(): PlanningMapper {
    return new PlanningMapper(getGameMapper());
}

export function getGameMapper(): GameMapper {
    return new GameMapper(new GamePlaceMapper(getScoreMapper()), getScoreMapper(), getCompetitionSportMapper());
}

export function getScoreMapper(): ScoreMapper {
    return new ScoreMapper();
}
