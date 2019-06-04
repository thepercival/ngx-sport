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
import { ConfigMapper } from '../src/config/mapper';
import { ConfigScoreMapper } from '../src/config/score/mapper';
import { RoundNumberMapper } from '../src/round/number/mapper';
import { SeasonMapper } from '../src/season/mapper';
import { StructureMapper } from '../src/structure/mapper';


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
    } else if (mapper === 'configscore') {
        return new ConfigScoreMapper();
    } else if (mapper === 'config') {
        return new ConfigMapper(getMapper('configscore'));
    } else if (mapper === 'roundnumber') {
        return new RoundNumberMapper(getMapper('config'));
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
