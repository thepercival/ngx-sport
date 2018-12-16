import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { TeamMapper, JsonTeam } from '../team/mapper';
import { Injectable } from '@angular/core';

@Injectable()
export class PoulePlaceMapper {
    constructor(private teamMapper: TeamMapper) {
    }

    toObject(json: JsonPoulePlace, poule: Poule, poulePlace?: PoulePlace): PoulePlace {
        if (poulePlace === undefined) {
            poulePlace = new PoulePlace(poule, json.number);
        }
        poulePlace.setId(json.id);
        // poule.setName(json.name);
        let team;
        if (json.team) {
            team = this.teamMapper.toObject(json.team, poule.getCompetition().getLeague().getAssociation());
        }
        poulePlace.setTeam(team);
        poulePlace.setPenaltyPoints(json.penaltyPoints);
        return poulePlace;
    }

    toJson(poulePlace: PoulePlace): JsonPoulePlace {
        return {
            id: poulePlace.getId(),
            number: poulePlace.getNumber(),
            name: poulePlace.getName(),
            team: poulePlace.getTeam() ? this.teamMapper.toJson(poulePlace.getTeam()) : undefined,
            penaltyPoints: poulePlace.getPenaltyPoints()
        };
    }
}

export interface JsonPoulePlace {
    id?: number;
    number: number;
    name?: string;
    team?: JsonTeam;
    penaltyPoints: number;
}
