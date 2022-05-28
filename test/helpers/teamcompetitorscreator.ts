import { Competition, Place, RoundNumber, Team, TeamCompetitor } from "../../public-api";


export function createTeamCompetitors(competition: Competition, firstRoundNumber: RoundNumber): TeamCompetitor[] {
    return firstRoundNumber.getPlaces().map((place: Place) =>
        new TeamCompetitor(
            competition,
            place.getStartLocation(),
            new Team(competition.getAssociation(), 'tc ' + place.getRoundLocationId())
        )
    );
}