import { AssociationMapper } from '../../src/association/mapper';
import { CompetitionMapper } from '../../src/competition/mapper';
import { FieldMapper } from '../../src/field/mapper';
import { GameMapper } from '../../src/game/mapper';
import { GamePlaceMapper } from '../../src/game/place/mapper';
import { GameScoreMapper } from '../../src/game/score/mapper';
import { LeagueMapper } from '../../src/league/mapper';
import { RefereeMapper } from '../../src/referee/mapper';
import { SportConfigMapper } from '../../src/sport/config/mapper';
import { SeasonMapper } from '../../src/season/mapper';
import { SportMapper } from '../../src/sport/mapper';
import { PlanningMapper } from '../../src/planning/mapper';

export function getCompetitionMapper(): CompetitionMapper {
    return new CompetitionMapper(
        getLeagueMapper(),
        new SeasonMapper(),
        new RefereeMapper(),
        getSportConfigMapper()
    );
}

export function getLeagueMapper(): LeagueMapper {
    return new LeagueMapper(new AssociationMapper());
}

export function getSportConfigMapper(): SportConfigMapper {
    return new SportConfigMapper(new SportMapper(), new FieldMapper());
}

export function getPlanningMapper(): PlanningMapper {
    return new PlanningMapper(getGameMapper());
}

export function getGameMapper(): GameMapper {
    return new GameMapper(new GamePlaceMapper(), new GameScoreMapper());
}
