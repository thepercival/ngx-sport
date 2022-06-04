import { Competition, Place, Round, Team, TeamCompetitor } from "../../public-api";


export function createTeamCompetitors(competition: Competition, rootRounds: Round[]): TeamCompetitor[] {
    let places = [];
    rootRounds.forEach((rootRound: Round) => places = places.concat(rootRound.getPlaces()));

    return places.map((place: Place) =>
        new TeamCompetitor(
            competition,
            place.getStartLocation(),
            new Team(competition.getAssociation(), 'tc ' + place.getRoundLocationId())
        )
    );
}