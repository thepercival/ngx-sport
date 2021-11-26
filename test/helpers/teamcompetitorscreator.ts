import { Competition, Place, RoundNumber, Team, TeamCompetitor } from "../../public-api";


export function createTeamCompetitors(competition: Competition, firstRoundNumber: RoundNumber): TeamCompetitor[] {
    const teamCompetitors: TeamCompetitor[] = [];
    firstRoundNumber.getPlaces().forEach((place: Place) => {
        teamCompetitors.push(new TeamCompetitor(competition, place.getPoule().getNumber(),
            place.getPlaceNr(), new Team(competition.getAssociation(), 'tc ' + place.getRoundLocationId())))
    });
    return teamCompetitors
}