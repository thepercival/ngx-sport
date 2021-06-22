import { AgainstSide, CustomSport, GameMode, JsonAgainstGame, State } from "../../../public_api";


export const jsonGames2Places: JsonAgainstGame[] = [{
    id: 0,
    batchNr: 1,
    gameRoundNumber: 1,
    competitionSport: {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: CustomSport.Football,
            defaultGameMode: GameMode.Against,
            defaultNrOfSidePlaces: 1
        },
        gameMode: GameMode.Against,
        nrOfHomePlaces: 1,
        nrOfAwayPlaces: 1,
        nrOfGamePlaces: 0,
        nrOfH2H: 1,
        nrOfGamesPerPlace: 0,
        fields: []
    },
    places: [
        {
            id: 0,
            place: { placeNr: 1, pouleNr: 1, id: 0, penaltyPoints: 0, qualifiedPlace: undefined },
            side: AgainstSide.Home
        },
        {
            id: 0,
            place: { placeNr: 2, pouleNr: 1, id: 0, penaltyPoints: 0, qualifiedPlace: undefined },
            side: AgainstSide.Away
        }
    ],
    field: {
        id: 1,
        priority: 1,
        name: '1'
    },
    state: State.Created,
    startDateTime: '2021-06-11T11:00:00.000000Z',
    referee: undefined,
    refereeStructureLocation: undefined,
    scores: []
}];