import { CompetitionSportMap, JsonAgainstGame, Place, PlaceMap, Poule, Round, RoundNumber } from '../../public-api';
import { jsonGames2Places } from '../data/games/2places';
import { getCompetitionSportMapper, getGameMapper } from './singletonCreator';
import { jsonGames3Places } from '../data/games/3places';
import { jsonGames4Places, jsonGames4PlacesMultipleSports } from '../data/games/4places';
import { jsonGames5Places } from '../data/games/5places';
import { AgainstGame } from '../../src/game/against';

export function createGames(roundNumber: RoundNumber) {

    const getJson = (poule: Poule, multiSports: boolean): JsonAgainstGame[] => {
        if (poule.getPlaces().length === 2) {
            return jsonGames2Places;
        } else if (poule.getPlaces().length === 3) {
            return jsonGames3Places;
        } else if (poule.getPlaces().length === 4) {
            if (multiSports) {
                return jsonGames4PlacesMultipleSports;
            }
            return jsonGames4Places;
        } else /*if (poule.getPlaces().length === 5)*/ {
            return jsonGames5Places;
        }
    };

    const fillPlaceMap = (roundNumber: RoundNumber, placeMap: PlaceMap) => {
        roundNumber.getRounds().forEach((round: Round) => {
            round.getPoules().forEach((poule: Poule) => {
                poule.getPlaces().forEach((place: Place) => {
                    placeMap[place.getStructureLocation()] = place;
                });
            });
        });
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber) {
            fillPlaceMap(nextRoundNumber, placeMap);
        }
    }

    const gameMapper = getGameMapper();
    const competitionSportMapper = getCompetitionSportMapper();

    const placeMap: PlaceMap = {};
    fillPlaceMap(roundNumber, placeMap);
    gameMapper.setPlaceMap(placeMap);
    const sportMap: CompetitionSportMap = competitionSportMapper.getMap(roundNumber.getCompetition());
    const multiSports = roundNumber.getCompetition().hasMultipleSports();
    roundNumber.getPoules().forEach((poule: Poule) => {
        getJson(poule, multiSports).forEach((jsonGame: JsonAgainstGame): AgainstGame => {
            const competitionSport = sportMap[jsonGame.competitionSport.id];
            return gameMapper.toNewAgainst(jsonGame, poule, competitionSport);
        });
    });


}