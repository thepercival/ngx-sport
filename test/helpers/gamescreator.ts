import { JsonAgainstGame, Poule, RoundNumber } from '../../public_api';
import { jsonGames2Places } from '../data/games/2places';
import { getGameMapper, getPlanningMapper } from './singletonCreator';
import { jsonGames3Places } from '../data/games/3places';
import { jsonGames4Places } from '../data/games/4places';
import { jsonGames5Places } from '../data/games/5places';
import { AgainstGame } from '../../src/game/against';

export function createGames(roundNumber: RoundNumber) {

    const getJson = (poule: Poule): JsonAgainstGame[] => {
        if (poule.getPlaces().length === 2) {
            return jsonGames2Places;
        } else if (poule.getPlaces().length === 3) {
            return jsonGames3Places;
        } else if (poule.getPlaces().length === 4) {
            return jsonGames4Places;
        } else /*if (poule.getPlaces().length === 5)*/ {
            return jsonGames5Places;
        }
    };
    const planningMapper = getPlanningMapper();
    const map = planningMapper.getCompetitionSportMap(roundNumber.getCompetition());
    roundNumber.getPoules().forEach((poule: Poule) => {
        getJson(poule).forEach((jsonGame: JsonAgainstGame): AgainstGame => {
            const competitionSport = map[jsonGame.competitionSport.id];
            return getGameMapper().toNewAgainst(jsonGame, poule, competitionSport);
        });
    });
}