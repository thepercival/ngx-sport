import { AssociationMapper, CompetitionMapper, CompetitionSportMapper, CompetitionSportService, FieldMapper, GameAmountConfigService, GameMapper, GamePlaceMapper, LeagueMapper, PlaceRange, PlanningMapper, QualifyAgainstConfigService, RefereeMapper, ScoreConfigService, ScoreMapper, SeasonMapper, SportMapper, StructureService, TeamCompetitorMapper, TeamMapper } from "../../public_api";

export function getStructureService(placeRanges?: PlaceRange[]): StructureService {
    return new StructureService(
        getCompetitionSportService(), placeRanges ? placeRanges : []
    );
}

export function getCompetitionSportService(): CompetitionSportService {
    return new CompetitionSportService(
        new ScoreConfigService(),
        new GameAmountConfigService(),
        new QualifyAgainstConfigService()
    );
}

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

export function getFieldMapper(): FieldMapper {
    return new FieldMapper();
}

export function getGameMapper(): GameMapper {
    return new GameMapper(new GamePlaceMapper(getScoreMapper()), getFieldMapper(), getScoreMapper(), getCompetitionSportMapper());
}

export function getScoreMapper(): ScoreMapper {
    return new ScoreMapper();
}
