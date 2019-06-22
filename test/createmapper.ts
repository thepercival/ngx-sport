import { AssociationMapper } from '../src/association/mapper';
import { CompetitionMapper } from '../src/competition/mapper';
import { CompetitorMapper } from '../src/competitor/mapper';
import { FieldMapper } from '../src/field/mapper';
import { GameMapper } from '../src/game/mapper';
import { GamePlaceMapper } from '../src/game/place/mapper';
import { GameScoreMapper } from '../src/game/score/mapper';
import { LeagueMapper } from '../src/league/mapper';
import { PouleMapper } from '../src/poule/mapper';
import { PlaceMapper } from '../src/place/mapper';
import { RefereeMapper } from '../src/referee/mapper';
import { RoundMapper } from '../src/round/mapper';
import { CountConfigMapper } from '../src/sport/config/mapper';
import { PlanningConfigMapper } from '../src/planning/config/mapper';
import { ConfigScoreMapper } from '../src/sport/config/score/mapper';
import { RoundNumberMapper } from '../src/round/number/mapper';
import { SeasonMapper } from '../src/season/mapper';
import { StructureMapper } from '../src/structure/mapper';
import { SportMapper } from '../src/sport/mapper';

export function getMapper(mapper: string) {
    if (mapper === 'sport') {
        return new SportMapper(getMapper('countconfig'));
    } else if (mapper === 'association') {
        return new AssociationMapper(getMapper('sport'));
    } else if (mapper === 'league') {
        return new LeagueMapper(getMapper('association'));
    } else if (mapper === 'season') {
        return new SeasonMapper();
    } else if (mapper === 'field') {
        return new FieldMapper();
    } else if (mapper === 'referee') {
        return new RefereeMapper();
    } else if (mapper === 'competition') {
        return new CompetitionMapper(
            getMapper('league'),
            getMapper('season'),
            getMapper('referee'),
            getMapper('field')
        );
    } else if (mapper === 'configscore') {
        return new ConfigScoreMapper();
    } else if (mapper === 'countconfig') {
        return new CountConfigMapper(getMapper('configscore'));
    } else if (mapper === 'planningconfig') {
        return new PlanningConfigMapper();
    } else if (mapper === 'roundnumber') {
        return new RoundNumberMapper(getMapper('countconfig'), getMapper('planningconfig'));
    } else if (mapper === 'competitor') {
        return new CompetitorMapper();
    } else if (mapper === 'place') {
        return new PlaceMapper(getMapper('competitor'));
    } else if (mapper === 'gameplace') {
        return new GamePlaceMapper();
    } else if (mapper === 'gamescore') {
        return new GameScoreMapper();
    } else if (mapper === 'game') {
        return new GameMapper(
            getMapper('gameplace'),
            getMapper('gamescore')
        );
    } else if (mapper === 'poule') {
        return new PouleMapper(getMapper('place'), getMapper('game'));
    } else if (mapper === 'round') {
        return new RoundMapper(getMapper('poule'));
    } else if (mapper === 'structure') {
        return new StructureMapper(getMapper('roundnumber'), getMapper('round'));
    }
}
