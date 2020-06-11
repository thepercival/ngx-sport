import { AssociationMapper } from '../../src/association/mapper';
import { CompetitionMapper } from '../../src/competition/mapper';
import { CompetitorMapper } from '../../src/competitor/mapper';
import { FieldMapper } from '../../src/field/mapper';
import { GameMapper } from '../../src/game/mapper';
import { GamePlaceMapper } from '../../src/game/place/mapper';
import { GameScoreMapper } from '../../src/game/score/mapper';
import { LeagueMapper } from '../../src/league/mapper';
import { PouleMapper } from '../../src/poule/mapper';
import { PlaceMapper } from '../../src/place/mapper';
import { RefereeMapper } from '../../src/referee/mapper';
import { RoundMapper } from '../../src/round/mapper';
import { SportConfigMapper } from '../../src/sport/config/mapper';
import { PlanningConfigMapper } from '../../src/planning/config/mapper';
import { SportScoreConfigMapper } from '../../src/sport/scoreconfig/mapper';
import { RoundNumberMapper } from '../../src/round/number/mapper';
import { SeasonMapper } from '../../src/season/mapper';
import { StructureMapper } from '../../src/structure/mapper';
import { SportMapper } from '../../src/sport/mapper';
import { PlanningMapper } from '../../src/planning/mapper';

export function getCompetitionMapper(): CompetitionMapper {
    return new CompetitionMapper(
        getLeagueMapper(),
        new SeasonMapper(),
        new SportMapper(),
        new RefereeMapper(),
        getFieldMapper(),
        getSportConfigMapper()
    );
}

export function getLeagueMapper(): LeagueMapper {
    return new LeagueMapper(new AssociationMapper());
}

export function getFieldMapper(): FieldMapper {
    return new FieldMapper(new SportMapper());
}

export function getSportConfigMapper(): SportConfigMapper {
    return new SportConfigMapper(new SportMapper());
}

export function getGameMapper(): GameMapper {
    return new GameMapper(new GamePlaceMapper(), new GameScoreMapper());
}

// function getMapper(mapper: string) {
//     if (mapper === 'planning') {
//         return new PlanningMapper(getMapper('game'));
//     } else if (mapper === 'planningconfig') {
//         return new PlanningConfigMapper();
//     } else if (mapper === 'sportscoreconfig') {
//         return new SportScoreConfigMapper(getMapper('sport'));
//     } else if (mapper === 'roundnumber') {
//         return new RoundNumberMapper(getMapper('planningconfig'), getMapper('sportplanningconfig'), getMapper('sportscoreconfig'));
//     } else if (mapper === 'competitor') {
//         return new CompetitorMapper();
//     } else if (mapper === 'place') {
//         return new PlaceMapper(getMapper('competitor'));
//     } else if (mapper === 'poule') {
//         return new PouleMapper(getMapper('place'), getMapper('game'));
//     } else if (mapper === 'round') {
//         return new RoundMapper(getMapper('poule'));
//     } else if (mapper === 'structure') {
//         // this is not good
//         return new StructureMapper(getMapper('roundnumber'), getMapper('round'), getMapper('planning'));
//     }
// }
