import { AssociationMapper, CompetitionMapper, CompetitionSportMapper, CompetitionSportService, FieldMapper, GameAmountConfigService, GameMapper, GamePlaceMapper, LeagueMapper, PlaceMapper, PlaceRange, PlanningMapper, QualifyAgainstConfigService, RefereeMapper, ScoreConfigService, ScoreMapper, SeasonMapper, SportMapper, StructureEditor, TeamCompetitorMapper, TeamMapper } from "../../public_api";

export function getStructureEditor(placeRanges?: PlaceRange[]): StructureEditor {
    return new StructureEditor(
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
        getRefereeMapper(),
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

export function getRefereeMapper(): RefereeMapper {
    return new RefereeMapper();
}

export function getFieldMapper(): FieldMapper {
    return new FieldMapper();
}

export function getGameMapper(): GameMapper {
    return new GameMapper(
        new GamePlaceMapper(getScoreMapper()),
        getFieldMapper(),
        getRefereeMapper(),
        new PlaceMapper(),
        getScoreMapper(),
        getCompetitionSportMapper());
}

export function getScoreMapper(): ScoreMapper {
    return new ScoreMapper();
}
