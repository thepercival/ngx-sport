import { AssociationMapper, CompetitionMapper, CompetitionSportMapper, FieldMapper, GameAmountConfigService, GameMapper, GamePlaceMapper, LeagueMapper, PlaceMapper, PlaceRange, PlaceRanges, PlanningConfigMapper, PlanningMapper, AgainstQualifyConfigService, RefereeMapper, ScoreConfigService, ScoreMapper, SeasonMapper, SportMapper, StructureEditor, TeamCompetitorMapper, TeamMapper, StructureMapper, RoundNumberMapper, RoundMapper, CategoryMapper, CompetitionSportEditor, StructureLocationMapper } from "../../public-api";
import { GameAmountConfigMapper } from "../../src/planning/gameAmountConfig/mapper";
import { PouleMapper } from "../../src/poule/mapper";
import { AgainstQualifyConfigMapper } from "../../src/qualify/againstConfig/mapper";
import { QualifyPathNodeMapper } from "../../src/qualify/pathNode/mapper";
import { ScoreConfigMapper } from "../../src/score/config/mapper";
import { StructureCellMapper } from "../../src/structure/cell/mapper";

export function getStructureEditor(placeRanges?: PlaceRanges): StructureEditor {
    const structureEditor = new StructureEditor(getCompetitionSportEditor(), new PlanningConfigMapper());
    if (placeRanges) {
        structureEditor.setPlaceRanges(placeRanges);
    }
    return structureEditor;
}

export function getCompetitionSportEditor(): CompetitionSportEditor {
    return new CompetitionSportEditor(
        new ScoreConfigService(),
        new GameAmountConfigService(),
        new AgainstQualifyConfigService()
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
        getScoreMapper(),
        new StructureLocationMapper(new QualifyPathNodeMapper()));
}

export function getScoreMapper(): ScoreMapper {
    return new ScoreMapper();
}

export function getStructureMapper(): StructureMapper {
    return new StructureMapper(
        getCompetitionSportMapper(),
        getRoundNumberMapper(),
        new CategoryMapper(new StructureCellMapper(), getRoundMapper()),
        getPlanningMapper()
    );
}

export function getRoundNumberMapper(): RoundNumberMapper {
    return new RoundNumberMapper(
        new PlanningConfigMapper(),
        new GameAmountConfigMapper(),
    );
}

export function getRoundMapper(): RoundMapper {
    return new RoundMapper(
        new PouleMapper(new PlaceMapper()),
        new ScoreConfigMapper(),
        new AgainstQualifyConfigMapper()
    );
}