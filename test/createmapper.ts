import { AssociationMapper } from '../src/association/mapper';
import { CompetitionMapper } from '../src/competition/mapper';
import { FieldMapper } from '../src/field/mapper';
import { GameMapper } from '../src/game/mapper';
import { GamePoulePlaceMapper } from '../src/game/pouleplace/mapper';
import { GameScoreMapper } from '../src/game/score/mapper';
import { LeagueMapper } from '../src/league/mapper';
import { PouleMapper } from '../src/poule/mapper';
import { PoulePlaceMapper } from '../src/pouleplace/mapper';
import { RefereeMapper } from '../src/referee/mapper';
import { RoundMapper } from '../src/round/mapper';
import { RoundNumberConfigMapper } from '../src/round/number/config/mapper';
import { RoundNumberConfigScoreMapper } from '../src/round/number/config/score/mapper';
import { RoundNumberMapper } from '../src/round/number/mapper';
import { SeasonMapper } from '../src/season/mapper';
import { StructureMapper } from '../src/structure/mapper';
import { TeamMapper } from '../src/team/mapper';


export function getMapper(mapper: string) {
    if (mapper === 'association') {
        return new AssociationMapper();
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
    } else if (mapper === 'roundconfigscore') {
        return new RoundNumberConfigScoreMapper();
    } else if (mapper === 'roundconfig') {
        return new RoundNumberConfigMapper(getMapper('roundconfigscore'));
    } else if (mapper === 'roundnumber') {
        return new RoundNumberMapper(getMapper('roundconfig'));
    } else if (mapper === 'team') {
        return new TeamMapper();
    } else if (mapper === 'pouleplace') {
        return new PoulePlaceMapper(getMapper('team'));
    } else if (mapper === 'gamepouleplace') {
        return new GamePoulePlaceMapper(getMapper('pouleplace'));
    } else if (mapper === 'gamescore') {
        return new GameScoreMapper();
    } else if (mapper === 'game') {
        return new GameMapper(
            getMapper('gamepouleplace'),
            getMapper('field'),
            getMapper('referee'),
            getMapper('gamescore')
        );
    } else if (mapper === 'poule') {
        return new PouleMapper(getMapper('pouleplace'), getMapper('game'));
    } else if (mapper === 'round') {
        return new RoundMapper(getMapper('poule'));
    } else if (mapper === 'structure') {
        return new StructureMapper(getMapper('roundnumber'), getMapper('round'));
    }
}
