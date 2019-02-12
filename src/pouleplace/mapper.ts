import { Injectable } from '@angular/core';

import { CompetitorMapper, JsonCompetitor } from '../competitor/mapper';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';

@Injectable()
export class PoulePlaceMapper {
    constructor(private competitorMapper: CompetitorMapper) {
    }

    toObject(json: JsonPoulePlace, poule: Poule, poulePlace?: PoulePlace): PoulePlace {
        if (poulePlace === undefined) {
            poulePlace = new PoulePlace(poule, json.number);
        }
        poulePlace.setId(json.id);
        // poule.setName(json.name);
        let competitor;
        if (json.competitor) {
            competitor = this.competitorMapper.toObject(json.competitor, poule.getCompetition().getLeague().getAssociation());
        }
        poulePlace.setCompetitor(competitor);
        poulePlace.setPenaltyPoints(json.penaltyPoints);
        return poulePlace;
    }

    toJson(poulePlace: PoulePlace): JsonPoulePlace {
        return {
            id: poulePlace.getId(),
            number: poulePlace.getNumber(),
            name: poulePlace.getName(),
            competitor: poulePlace.getCompetitor() ? this.competitorMapper.toJson(poulePlace.getCompetitor()) : undefined,
            penaltyPoints: poulePlace.getPenaltyPoints()
        };
    }
}

export interface JsonPoulePlace {
    id?: number;
    number: number;
    name?: string;
    competitor?: JsonCompetitor;
    penaltyPoints: number;
}
