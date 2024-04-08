import { AgainstSide, GameState, JsonAgainstGame } from "../../../public-api";
import { jsonVoetbal } from "../competition";


export const jsonGames2Places: JsonAgainstGame[] = [{
    id: 0,
    batchNr: 1,
    gameRoundNumber: 1,
    competitionSportId: jsonVoetbal.id,
    places: [
        {
            id: 0,
            place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
            side: AgainstSide.Home
        },
        {
            id: 0,
            place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
            side: AgainstSide.Away
        }
    ],
    fieldId: 1,
    state: GameState.Created,
    startDateTime: '2021-06-11T11:00:00.000000Z',
    refereeId: undefined,
    refereeStructureLocation: undefined,
    scores: [],
    homeExtraPoints: 0,
    awayExtraPoints: 0
}];