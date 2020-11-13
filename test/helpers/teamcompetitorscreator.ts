import { RoundNumber } from '../../src/round/number';
import { Competition } from '../../src/competition';
import { TeamCompetitor } from '../../src/competitor/team';
import { Place } from '../../src/place';
import { Team } from '../../src/team';

export function createTeamCompetitors(competition: Competition, firstRoundNumber: RoundNumber): TeamCompetitor[] {
    const teamCompetitors: TeamCompetitor[] = [];
    firstRoundNumber.getPlaces().forEach((place: Place) => {
        teamCompetitors.push(new TeamCompetitor(competition, place.getPoule().getNumber(),
            place.getNumber(), new Team(competition.getAssociation(), 'tc ' + place.getLocationId())))
    });
    return teamCompetitors
}